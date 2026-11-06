import { getAdminUsers } from '@/api/adminApi';
import { getRoomManagementData } from '@/api/roomManagementApi';
import {
    activeAssignment,
    isResidentRole,
    nodeAncestors,
    nodePath,
    nodeTypeKind,
} from '@/utils/room-management';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const audiences = [
    { id: 'people', label: 'Specific people' },
    { id: 'room', label: 'Room' },
    { id: 'floor', label: 'Floor' },
    { id: 'building', label: 'Block' },
    { id: 'users', label: 'All users (USER)' },
    { id: 'team', label: 'All Admin / Staff' },
] as const;

type AudienceSelection =
    | { kind: 'people'; emails: string[] }
    | { kind: 'room' | 'floor' | 'building'; nodeId: string }
    | { kind: 'users' | 'team' };

export function useNotificationAudience() {
    const [selection, setSelection] = useState<AudienceSelection>({
        kind: 'people',
        emails: [],
    });
    const location = 'nodeId' in selection;
    const users = useQuery({
        queryKey: ['admin-users'],
        queryFn: getAdminUsers,
        enabled: !location,
    });
    const rooms = useQuery({
        queryKey: ['room-management'],
        queryFn: getRoomManagementData,
        enabled: location,
    });
    const source = location ? rooms : users;
    const data = rooms.data;
    const locations =
        data && location
            ? data.nodes
                  .flatMap((node) => {
                      const type = data.nodeTypes.find(
                          (item) => item.id === node.nodeTypeId
                      );
                      return type &&
                          nodeTypeKind(type, data.nodeTypes) === selection.kind
                          ? [{ id: node.id, label: nodePath(node, data) }]
                          : [];
                  })
                  .sort((a, b) =>
                      a.label.localeCompare(b.label, undefined, {
                          numeric: true,
                      })
                  )
            : [];
    const accounts = location ? data?.users : users.data;
    const selectedLocation =
        location && locations.find((node) => node.id === selection.nodeId);
    const residentIds = new Set<string>();
    if (location && selectedLocation && data) {
        const roomIds = new Set(
            data.nodes
                .filter(
                    (node) =>
                        node.id === selection.nodeId ||
                        nodeAncestors(node, data.nodes).some(
                            (parent) => parent.id === selection.nodeId
                        )
                )
                .map((node) => node.id)
        );
        for (const assignment of data.assignments) {
            if (
                roomIds.has(assignment.roomNodeId) &&
                activeAssignment(assignment)
            ) {
                residentIds.add(assignment.userId);
            }
        }
    }
    const emails = new Map<string, string>();
    for (const account of accounts ?? []) {
        const email = account.email?.trim();
        if (!email) continue;
        const key = email.toLowerCase();
        const roles = account.roles ?? [];
        if (
            (selection.kind === 'people' && selection.emails.includes(key)) ||
            (selection.kind === 'users' && isResidentRole(roles)) ||
            (selection.kind === 'team' &&
                roles.some((role) =>
                    ['ADMIN', 'STAFF'].includes(
                        role.toUpperCase().replace(/^ROLE_/, '')
                    )
                )) ||
            residentIds.has(account.id)
        )
            emails.set(key, email);
    }

    return {
        selection,
        setSelection,
        locations,
        accounts: accounts ?? [],
        recipients: [...emails.values()].sort((a, b) => a.localeCompare(b)),
        label: selectedLocation
            ? selectedLocation.label
            : audiences.find((item) => item.id === selection.kind)?.label,
        ready: source.isSuccess && !source.isFetching,
        loading: source.isFetching,
        failed: source.isError,
        refresh: () => void source.refetch(),
    };
}

export default function NotificationRecipientPicker({
    audience,
    disabled,
}: {
    audience: ReturnType<typeof useNotificationAudience>;
    disabled: boolean;
}) {
    const { selection, setSelection, locations, accounts, recipients } =
        audience;
    const [search, setSearch] = useState('');
    const [showRecipients, setShowRecipients] = useState(false);
    const query = search.trim().toLowerCase();
    const suggestions = new Map<string, { label: string; detail?: string }>();
    if (selection.kind === 'people') {
        for (const account of accounts) {
            const label = account.email?.trim();
            const key = label?.toLowerCase();
            if (
                key &&
                !selection.emails.includes(key) &&
                (key.includes(query) ||
                    account.fullName?.toLowerCase().includes(query))
            ) {
                suggestions.set(key, { label, detail: account.fullName });
            }
        }
    } else if ('nodeId' in selection) {
        for (const option of locations) {
            if (option.label.toLowerCase().includes(query))
                suggestions.set(option.id, option);
        }
    }
    const options = [...suggestions.entries()].slice(0, 8);
    const isPicker = selection.kind === 'people' || 'nodeId' in selection;

    return (
        <View className="gap-2">
            <Text className="text-slate-600 text-xs font-bold">Audience</Text>
            <View className="flex-row flex-wrap gap-2">
                {audiences.map(({ id, label }) => (
                    <TouchableOpacity
                        key={id}
                        disabled={disabled}
                        accessibilityRole="button"
                        accessibilityState={{ selected: selection.kind === id }}
                        onPress={() => {
                            if (selection.kind === id) return;
                            setSearch('');
                            setShowRecipients(false);
                            if (id === 'people')
                                setSelection({ kind: id, emails: [] });
                            else if (id === 'users' || id === 'team')
                                setSelection({ kind: id });
                            else setSelection({ kind: id, nodeId: '' });
                        }}
                        className={
                            selection.kind === id
                                ? 'rounded-xl bg-blue-600 p-2'
                                : 'rounded-xl bg-slate-100 p-2'
                        }
                    >
                        <Text
                            className={
                                selection.kind === id
                                    ? 'text-white'
                                    : 'text-slate-700'
                            }
                        >
                            {label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            {isPicker && (
                <TextInput
                    editable={!disabled}
                    value={search}
                    onChangeText={setSearch}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder={
                        selection.kind === 'people'
                            ? 'Search by login email or name'
                            : 'Search by location name'
                    }
                    className="border border-slate-200 rounded-xl p-3"
                />
            )}
            {audience.loading && (
                <Text className="text-slate-500">Loading recipients…</Text>
            )}
            {audience.failed && (
                <TouchableOpacity
                    onPress={audience.refresh}
                    disabled={disabled}
                >
                    <Text className="text-red-700">
                        Could not load recipients. Tap to retry.
                    </Text>
                </TouchableOpacity>
            )}
            {audience.ready &&
                isPicker &&
                (selection.kind !== 'people' || query.length > 0) && (
                    <View className="gap-1">
                        {options.map(([id, option]) => (
                            <TouchableOpacity
                                key={id}
                                disabled={disabled}
                                accessibilityState={{
                                    selected:
                                        'nodeId' in selection &&
                                        selection.nodeId === id,
                                }}
                                onPress={() => {
                                    if (selection.kind === 'people') {
                                        setSelection({
                                            ...selection,
                                            emails: [...selection.emails, id],
                                        });
                                        setSearch('');
                                    } else if ('nodeId' in selection) {
                                        setSelection({
                                            ...selection,
                                            nodeId: id,
                                        });
                                    }
                                }}
                                className={
                                    'nodeId' in selection &&
                                    selection.nodeId === id
                                        ? 'rounded-lg bg-blue-100 p-2'
                                        : 'rounded-lg bg-slate-50 p-2'
                                }
                            >
                                <Text className="text-slate-800">
                                    {option.label}
                                </Text>
                                {!!option.detail && (
                                    <Text className="text-xs text-slate-500">
                                        {option.detail}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        ))}
                        {!options.length && (
                            <Text className="text-slate-500">
                                No matching options.
                            </Text>
                        )}
                        {suggestions.size > options.length && (
                            <Text className="text-xs text-slate-500">
                                Type to narrow the suggestions.
                            </Text>
                        )}
                    </View>
                )}
            {audience.ready && (
                <View className="rounded-xl bg-slate-50 p-3 gap-2">
                    <Text className="font-bold text-slate-700">
                        {recipients.length} recipients
                        {selection.kind !== 'people' && audience.label
                            ? ' · ' + audience.label
                            : ''}
                    </Text>
                    {selection.kind === 'people'
                        ? recipients.map((email) => (
                              <TouchableOpacity
                                  key={email}
                                  accessibilityRole="button"
                                  accessibilityLabel={'Remove ' + email}
                                  disabled={disabled}
                                  onPress={() =>
                                      setSelection({
                                          ...selection,
                                          emails: selection.emails.filter(
                                              (value) =>
                                                  value !== email.toLowerCase()
                                          ),
                                      })
                                  }
                              >
                                  <Text className="text-blue-700">
                                      {email} ×
                                  </Text>
                              </TouchableOpacity>
                          ))
                        : recipients.length > 0 && (
                              <>
                                  <TouchableOpacity
                                      onPress={() =>
                                          setShowRecipients(!showRecipients)
                                      }
                                  >
                                      <Text className="font-semibold text-blue-700">
                                          {showRecipients
                                              ? 'Hide email list'
                                              : 'Preview email list'}
                                      </Text>
                                  </TouchableOpacity>
                                  {showRecipients &&
                                      recipients.map((email) => (
                                          <Text
                                              key={email}
                                              className="text-slate-700"
                                          >
                                              {email}
                                          </Text>
                                      ))}
                              </>
                          )}
                </View>
            )}
        </View>
    );
}
