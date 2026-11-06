import {
    notificationPalette,
    type InboxPriority,
} from '@/utils/app-notifications';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export default function NotificationPriorityBadge({
    priority,
}: {
    priority?: InboxPriority;
}) {
    if (!priority) return null;
    const palette = notificationPalette(priority);
    return (
        <View
            className="self-start flex-row items-center gap-1 rounded-full px-2 py-1"
            style={{ backgroundColor: palette.badge }}
        >
            <Ionicons name={palette.icon} size={13} color={palette.color} />
            <Text
                className="text-xs font-bold"
                style={{ color: palette.color }}
            >
                {priority}
            </Text>
        </View>
    );
}
