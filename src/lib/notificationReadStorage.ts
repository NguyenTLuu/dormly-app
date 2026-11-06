import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

const key = (userId: string) =>
    'dormly-notification-read-' + encodeURIComponent(userId);
export async function loadNotificationReads(userId: string): Promise<string[]> {
    try {
        const raw =
            Platform.OS === 'web'
                ? localStorage.getItem(key(userId))
                : await FileSystem.readAsStringAsync(
                      FileSystem.documentDirectory + key(userId) + '.json'
                  );
        const value: unknown = JSON.parse(raw || '[]');
        return Array.isArray(value)
            ? value.filter((id): id is string => typeof id === 'string')
            : [];
    } catch {
        return [];
    }
}
export async function saveNotificationReads(userId: string, ids: string[]) {
    const raw = JSON.stringify(ids);
    if (Platform.OS === 'web') localStorage.setItem(key(userId), raw);
    else {
        if (!FileSystem.documentDirectory)
            throw new Error('Local storage unavailable');
        await FileSystem.writeAsStringAsync(
            FileSystem.documentDirectory + key(userId) + '.json',
            raw
        );
    }
}
