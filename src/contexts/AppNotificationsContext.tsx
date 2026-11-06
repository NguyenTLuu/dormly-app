import { getNotificationLogs } from '@/api/notificationApi';
import { axiosClient } from '@/api/axiosClient';
import { authStorage } from '@/auth/authStorage';
import { useAuth } from '@/auth/AuthContext';
import {
    loadNotificationReads,
    saveNotificationReads,
} from '@/lib/notificationReadStorage';
import {
    mergeInboxItems,
    parseInboxEvent,
    personalInboxItems,
    type AppInboxItem,
} from '@/utils/app-notifications';
import { Client } from '@stomp/stompjs';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import { AppState, Platform } from 'react-native';
import { toast } from 'sonner-native';

interface InboxContext {
    items: AppInboxItem[];
    readIds: string[];
    unread: number;
    connected: boolean;
    loading: boolean;
    error: boolean;
    refreshing: boolean;
    more: boolean;
    loadingMore: boolean;
    readReady: boolean;
    markRead: (ids: string[]) => void;
    refresh: () => void;
    loadMore: () => void;
}
const emptyInbox: InboxContext = {
    items: [], readIds: [], unread: 0, connected: false,
    loading: false, error: false, refreshing: false, more: false,
    loadingMore: false, readReady: false,
    markRead: () => {}, refresh: () => {}, loadMore: () => {},
};
const Context = createContext<InboxContext>(emptyInbox);

export function AppNotificationsProvider({
    children,
}: {
    children: ReactNode;
}) {
    const { session } = useAuth();
    return session ? (
        <AccountInbox
            key={session.userId}
            userId={session.userId}
            email={session.email}
        >
            {children}
        </AccountInbox>
    ) : (
        <Context.Provider value={emptyInbox}>{children}</Context.Provider>
    );
}

function AccountInbox({
    children,
    userId,
    email,
}: {
    children: ReactNode;
    userId: string;
    email: string;
}) {
    const [live, setLive] = useState<AppInboxItem[]>([]);
    const [readIds, setReadIds] = useState<string[]>([]);
    const [readReady, setReadReady] = useState(false);
    const [connected, setConnected] = useState(false);
    const [active, setActive] = useState(
        AppState.currentState !== 'background' &&
            AppState.currentState !== 'inactive'
    );
    const readRef = useRef<string[]>([]);
    const writes = useRef(Promise.resolve());
    const history = useInfiniteQuery({
        queryKey: ['personal-notifications', userId, email],
        queryFn: async ({ pageParam }) => {
            const page = await getNotificationLogs(
                { recipient: email, channel: 'WEBSOCKET' },
                pageParam
            );
            return { ...page, items: personalInboxItems(page.content, email) };
        },
        initialPageParam: 0,
        getNextPageParam: (page) => (page.last ? undefined : page.number + 1),
        refetchInterval: active ? 30000 : false,
        refetchIntervalInBackground: false,
    });
    const refetch = history.refetch;
    useEffect(() => {
        let mounted = true;
        void loadNotificationReads(userId).then((ids) => {
            if (mounted) {
                readRef.current = ids;
                setReadIds(ids);
                setReadReady(true);
            }
        });
        return () => {
            mounted = false;
        };
    }, [userId]);
    useEffect(() => {
        const listener = AppState.addEventListener('change', (state) => {
            setActive(state === 'active');
            if (state !== 'active') setConnected(false);
            if (state === 'active') void refetch();
        });
        return () => listener.remove();
    }, [refetch]);
    useEffect(() => {
        if (!active) return;
        let disposed = false;
        const url = new URL('/ws/websocket', axiosClient.defaults.baseURL);
        url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
        const client = new Client({
            brokerURL: url.toString(),
            reconnectDelay: 5000,
            connectionTimeout: 10000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            forceBinaryWSFrames: Platform.OS !== 'web',
            appendMissingNULLonIncoming: Platform.OS !== 'web',
            beforeConnect: async () => {
                const token = await authStorage.getAccessToken();
                if (!disposed && token)
                    client.connectHeaders = {
                        Authorization: 'Bearer ' + token,
                    };
                else await client.deactivate();
            },
            onConnect: () => {
                if (disposed) return;
                setConnected(true);
                client.subscribe('/user/queue/notifications', (frame) => {
                    try {
                        const item = parseInboxEvent(JSON.parse(frame.body));
                        if (item && !disposed) {
                            setLive((current) =>
                                mergeInboxItems(current, [item]).slice(0, 100)
                            );
                            void refetch();
                        }
                    } catch {
                        /* Ignore malformed events. */
                    }
                });
                void refetch();
            },
            onWebSocketClose: () => {
                if (!disposed) setConnected(false);
            },
            onStompError: () => {
                if (!disposed) setConnected(false);
            },
        });
        client.activate();
        return () => {
            disposed = true;
            void client.deactivate({ force: true });
        };
    }, [active, email, refetch]);
    const items = mergeInboxItems(
        live,
        ...(history.data?.pages.map((page) => page.items) ?? [])
    );
    const markRead = (ids: string[]) => {
        if (!readReady) return;
        const allowed = new Set(items.map((item) => item.id));
        const next = [
            ...new Set([
                ...readRef.current,
                ...ids.filter((id) => allowed.has(id)),
            ]),
        ];
        readRef.current = next;
        setReadIds(next);
        writes.current = writes.current
            .catch(() => undefined)
            .then(() => saveNotificationReads(userId, next))
            .catch(() => {
                toast.error('Could not save read status on this device');
            });
    };
    return (
        <Context.Provider
            value={{
                items,
                readIds,
                readReady,
                unread: readReady
                    ? items.filter((item) => !readIds.includes(item.id)).length
                    : 0,
                connected: active && connected,
                loading: history.isLoading,
                error: history.isError,
                refreshing: history.isRefetching,
                more: Boolean(history.hasNextPage),
                loadingMore: history.isFetchingNextPage,
                markRead,
                refresh: () => {
                    void refetch();
                },
                loadMore: () => {
                    void history.fetchNextPage();
                },
            }}
        >
            {children}
        </Context.Provider>
    );
}

export function useAppNotifications() {
    return useContext(Context);
}
