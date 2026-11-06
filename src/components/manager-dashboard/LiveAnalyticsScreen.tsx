import { getOperationalInsights } from '@/api/operationalInsightsApi';
import {
    ManagerHeader,
    MetricTile,
    SectionTitle,
} from '@/components/manager-dashboard';
import SectionCard from '@/components/SectionCard';
import { roomInsights, ticketInsights } from '@/utils/operational-insights';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import {
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type ViewMode = 'report' | 'rooms' | 'operations';

export default function LiveAnalyticsScreen({ mode }: { mode: ViewMode }) {
    const router = useRouter();
    const query = useQuery({
        queryKey: ['operational-insights'],
        queryFn: getOperationalInsights,
    });
    const data = query.data;
    const rooms = data ? roomInsights(data.rooms) : null;
    const tickets = data ? ticketInsights(data.tickets) : null;
    const pendingTransfers =
        data?.transfers.filter((item) => item.status === 'PENDING').length ?? 0;
    const title =
        mode === 'report'
            ? 'Report Summary'
            : mode === 'rooms'
              ? 'Room Statistics'
              : 'Ticket Statistics';
    return (
        <View className="flex-1 bg-[#F4FAFD]">
            <ManagerHeader
                title={title}
                subtitle="Current backend data"
                onBack={() => router.back()}
            />
            <ScrollView
                className="-mt-8 px-4"
                contentContainerStyle={{ paddingBottom: 40, gap: 14 }}
                refreshControl={
                    <RefreshControl
                        refreshing={query.isRefetching}
                        onRefresh={() => void query.refetch()}
                    />
                }
            >
                {query.isLoading ? (
                    <StateCard text="Loading statistics..." />
                ) : null}
                {query.isError ? (
                    <TouchableOpacity onPress={() => void query.refetch()}>
                        <StateCard
                            text="Could not load statistics. Tap to retry."
                            error
                        />
                    </TouchableOpacity>
                ) : null}
                {data && rooms && tickets ? (
                    <>
                        {mode !== 'operations' ? (
                            <View className="flex-row flex-wrap justify-between gap-y-3">
                                <MetricTile
                                    label="Occupied beds"
                                    value={String(rooms.occupiedBeds)}
                                    caption="Current room assignments"
                                    icon="people-outline"
                                    color="#2563EB"
                                    bgColor="#DBEAFE"
                                />
                                <MetricTile
                                    label="Vacant beds"
                                    value={String(rooms.vacantBeds)}
                                    caption={`${rooms.totalBeds} total beds`}
                                    icon="bed-outline"
                                    color="#0F766E"
                                    bgColor="#CCFBF1"
                                />
                                <MetricTile
                                    label="Full rooms"
                                    value={`${rooms.fullRooms}/${rooms.totalRooms}`}
                                    icon="business-outline"
                                    color="#7C3AED"
                                    bgColor="#F3E8FF"
                                />
                                <MetricTile
                                    label="Occupancy"
                                    value={`${rooms.occupancyPercent}%`}
                                    icon="pie-chart-outline"
                                    color="#F97316"
                                    bgColor="#FFEDD5"
                                />
                            </View>
                        ) : (
                            <View className="flex-row flex-wrap justify-between gap-y-3">
                                <MetricTile
                                    label="Open tickets"
                                    value={String(
                                        tickets.statuses.find(
                                            (item) => item.label === 'OPEN'
                                        )?.count ?? 0
                                    )}
                                    icon="ticket-outline"
                                    color="#F97316"
                                    bgColor="#FFEDD5"
                                />
                                <MetricTile
                                    label="In progress"
                                    value={String(
                                        tickets.statuses.find(
                                            (item) =>
                                                item.label === 'IN_PROGRESS'
                                        )?.count ?? 0
                                    )}
                                    icon="time-outline"
                                    color="#2563EB"
                                    bgColor="#DBEAFE"
                                />
                                <MetricTile
                                    label="Pending transfers"
                                    value={String(pendingTransfers)}
                                    icon="swap-horizontal-outline"
                                    color="#7C3AED"
                                    bgColor="#F3E8FF"
                                />
                            </View>
                        )}
                        {mode !== 'operations' ? (
                            <SectionCard>
                                <SectionTitle
                                    title="By Building"
                                    icon="business-outline"
                                />
                                {rooms.byBuilding.map((building) => (
                                    <View
                                        key={building.id}
                                        className="border-t border-slate-100 py-3"
                                    >
                                        <Text className="text-slate-800 font-bold">
                                            {building.name}
                                        </Text>
                                        <Text className="text-slate-500 mt-1">
                                            {building.occupied}/{building.beds}{' '}
                                            beds occupied · {building.rooms}{' '}
                                            rooms
                                        </Text>
                                        {mode === 'rooms'
                                            ? building.floors.map((floor) => (
                                                  <View
                                                      key={floor.id}
                                                      className="flex-row justify-between pl-3 pt-2"
                                                  >
                                                      <Text className="text-slate-600">
                                                          {floor.name}
                                                      </Text>
                                                      <Text className="text-slate-800 font-medium">
                                                          {floor.occupied}/
                                                          {floor.beds} beds ·{' '}
                                                          {floor.fullRooms}/
                                                          {floor.rooms} full
                                                          rooms
                                                      </Text>
                                                  </View>
                                              ))
                                            : null}
                                    </View>
                                ))}
                                {!rooms.byBuilding.length ? (
                                    <Text className="text-slate-500">
                                        No buildings recorded.
                                    </Text>
                                ) : null}
                            </SectionCard>
                        ) : null}
                        {mode !== 'rooms' ? (
                            <SectionCard>
                                <SectionTitle
                                    title="Ticket Status"
                                    icon="ticket-outline"
                                />
                                {tickets.statuses.map((item) => (
                                    <CountRow
                                        key={item.label}
                                        label={formatLabel(item.label)}
                                        count={item.count}
                                    />
                                ))}
                                <CountRow
                                    label="Pending transfers"
                                    count={pendingTransfers}
                                />
                            </SectionCard>
                        ) : null}
                        {mode === 'operations' ? (
                            <SectionCard>
                                <SectionTitle
                                    title="Ticket Categories"
                                    icon="list-outline"
                                />
                                {tickets.categories.map((item) => (
                                    <CountRow
                                        key={item.label}
                                        label={formatLabel(item.label)}
                                        count={item.count}
                                    />
                                ))}
                                {!tickets.categories.length ? (
                                    <Text className="text-slate-500">
                                        No tickets recorded.
                                    </Text>
                                ) : null}
                            </SectionCard>
                        ) : null}
                        {mode !== 'rooms' ? (
                            <SectionCard>
                                <SectionTitle
                                    title="Tickets This Year"
                                    icon="bar-chart-outline"
                                />
                                {(
                                    data.operations?.resolutionTrends ??
                                    data.overview?.ticketVolume ??
                                    []
                                ).map((item) => (
                                    <View
                                        key={item.month}
                                        className="flex-row justify-between border-t border-slate-100 py-2"
                                    >
                                        <Text className="text-slate-600 font-medium">
                                            {item.month}
                                        </Text>
                                        <Text className="text-slate-800">
                                            {item.created} created ·{' '}
                                            {item.resolved} resolved
                                        </Text>
                                    </View>
                                ))}
                                {!data.operations?.resolutionTrends?.length &&
                                !data.overview?.ticketVolume?.length ? (
                                    <Text className="text-slate-500">
                                        Monthly trend unavailable from analytics
                                        API.
                                    </Text>
                                ) : null}
                            </SectionCard>
                        ) : null}
                        {mode === 'report' ? (
                            <SectionCard>
                                <SectionTitle
                                    title="Report Coverage"
                                    icon="information-circle-outline"
                                />
                                <Text className="text-slate-600 leading-5">
                                    Room and ticket totals use current records.
                                    Monthly ticket counts are shown when
                                    available.
                                </Text>
                            </SectionCard>
                        ) : null}
                    </>
                ) : null}
            </ScrollView>
        </View>
    );
}

function CountRow({ label, count }: { label: string; count: number }) {
    return (
        <View className="flex-row justify-between border-t border-slate-100 py-3">
            <Text className="text-slate-600">{label}</Text>
            <Text className="text-slate-800 font-bold">{count}</Text>
        </View>
    );
}

function StateCard({ text, error = false }: { text: string; error?: boolean }) {
    return (
        <View className={`rounded-2xl p-5 ${error ? 'bg-red-50' : 'bg-white'}`}>
            <Text className={error ? 'text-red-700' : 'text-slate-500'}>
                {text}
            </Text>
        </View>
    );
}

function formatLabel(value: string) {
    return value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
