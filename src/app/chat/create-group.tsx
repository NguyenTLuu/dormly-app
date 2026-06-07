import { createStudentGroupChat } from '@/app/(student)/chat';
import { ManagementAvatar } from '@/components/manager-management';
import { dormStudents } from '@/data/manager-management';
import { addActivityLog } from '@/data/activity-log';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

export default function CreateStudentGroupScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [name, setName] = useState('');
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const members = useMemo(
        () =>
            dormStudents.filter(
                (student) =>
                    student.id !== '2231200123' &&
                    (student.fullName
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                        student.room
                            .toLowerCase()
                            .includes(search.toLowerCase()))
            ),
        [search]
    );

    const toggleMember = (id: string) => {
        setSelectedIds((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        );
    };

    const createGroup = () => {
        if (!name.trim()) {
            toast.error('Group name is required');
            return;
        }
        if (selectedIds.length < 2) {
            toast.error('Select at least two members');
            return;
        }
        const selected = dormStudents.filter((student) =>
            selectedIds.includes(student.id)
        );
        const id = createStudentGroupChat(
            name.trim(),
            selected.map((student) => student.fullName)
        );
        addActivityLog({
            action: 'Created student chat group',
            detail: `${name.trim()} created with ${selectedIds.length + 1} members.`,
            actorName: 'Nguyen Van A',
            actorRole: 'Student',
            time: 'Just now',
            icon: 'person-outline',
            color: '#2563EB',
        });
        toast.success('Student group created');
        router.replace({
            pathname: '/chat/[id]',
            params: { id, name: name.trim(), type: 'group' },
        });
    };

    return (
        <View
            className="flex-1 bg-[#F4FAFD]"
            style={{ paddingTop: insets.top }}
        >
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <View className="bg-white px-4 py-3 flex-row items-center border-b border-gray-100">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-[#F8FAFC] items-center justify-center"
                >
                    <Ionicons name="chevron-back" size={22} color="#1E293B" />
                </TouchableOpacity>
                <View className="ml-3 flex-1">
                    <Text className="text-[#1E293B] text-lg font-bold">
                        Create Group Chat
                    </Text>
                    <Text className="text-[#64748B] text-xs font-semibold">
                        Choose students to join the group
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={createGroup}
                    className="bg-blue-600 rounded-xl px-4 py-2.5"
                >
                    <Text className="text-white text-xs font-bold">Create</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ padding: 16, gap: 12 }}
            >
                <View className="bg-white rounded-2xl p-4 shadow-xl">
                    <Text className="text-[#1E293B] text-xs font-bold mb-2">
                        Group name
                    </Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Example: Study Group"
                        placeholderTextColor="#94A3B8"
                        className="bg-[#F8FAFC] rounded-xl px-3 py-3 text-[#1E293B]"
                    />
                </View>
                <View className="bg-white rounded-2xl px-3 flex-row items-center shadow-xl">
                    <Ionicons name="search-outline" size={18} color="#94A3B8" />
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search student or room..."
                        placeholderTextColor="#94A3B8"
                        className="flex-1 px-2 py-3 text-[#1E293B]"
                    />
                </View>
                <Text className="text-[#64748B] text-xs font-bold">
                    Selected {selectedIds.length} members
                </Text>
                {members.map((student) => {
                    const selected = selectedIds.includes(student.id);
                    return (
                        <TouchableOpacity
                            key={student.id}
                            activeOpacity={0.75}
                            onPress={() => toggleMember(student.id)}
                            className={`bg-white rounded-2xl p-3 flex-row items-center border shadow-xl ${selected ? 'border-blue-300' : 'border-gray-100'}`}
                        >
                            <ManagementAvatar initials={student.initials} />
                            <View className="ml-3 flex-1">
                                <Text className="text-[#1E293B] text-sm font-bold">
                                    {student.fullName}
                                </Text>
                                <Text className="text-[#64748B] text-xs font-semibold mt-1">
                                    {student.id} - Room {student.room}
                                </Text>
                            </View>
                            <Ionicons
                                name={
                                    selected
                                        ? 'checkmark-circle'
                                        : 'ellipse-outline'
                                }
                                size={23}
                                color={selected ? '#2563EB' : '#CBD5E1'}
                            />
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}
