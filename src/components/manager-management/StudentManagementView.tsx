import {
    DormStudent,
    managementBlockOptions,
} from '@/data/manager-management';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import React, { useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import ManagementSearchBar from './ManagementSearchBar';
import StudentCard from './StudentCard';
import StudentFilterModal from './StudentFilterModal';

interface StudentManagementViewProps {
    students: DormStudent[];
    onStudentPress: (student: DormStudent) => void;
}

export default function StudentManagementView({
    students,
    onStudentPress,
}: StudentManagementViewProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMajor, setSelectedMajor] = useState('All');
    const [selectedBlock, setSelectedBlock] = useState('All');
    const [selectedFloor, setSelectedFloor] = useState('All');
    const [filterVisible, setFilterVisible] = useState(false);
    const debouncedSearch = useDebouncedValue(searchQuery, 300);

    const majors = useMemo(
        () => ['All', ...Array.from(new Set(students.map((item) => item.major)))],
        [students]
    );
    const floors = ['All', 'Floor 1', 'Floor 2', 'Floor 3'];
    const activeFilterCount = [selectedMajor, selectedBlock, selectedFloor].filter(
        (value) => value !== 'All'
    ).length;

    const filteredStudents = useMemo(() => {
        const query = debouncedSearch.trim().toLowerCase();

        return students.filter((student) => {
            const matchesSearch =
                query.length === 0 ||
                student.fullName.toLowerCase().includes(query) ||
                student.id.includes(query);
            const matchesMajor =
                selectedMajor === 'All' || student.major === selectedMajor;
            const matchesBlock =
                selectedBlock === 'All' || student.block === selectedBlock;
            const matchesFloor =
                selectedFloor === 'All' || student.floor === selectedFloor;

            return (
                matchesSearch && matchesMajor && matchesBlock && matchesFloor
            );
        });
    }, [
        debouncedSearch,
        selectedBlock,
        selectedFloor,
        selectedMajor,
        students,
    ]);

    return (
        <>
            <FlatList
                data={filteredStudents}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 10, paddingBottom: 28 }}
                ListHeaderComponent={
                    <View className="gap-3 pb-2">
                        <ManagementSearchBar
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onFilterPress={() => setFilterVisible(true)}
                            activeFilterCount={activeFilterCount}
                        />
                        <View className="flex-row items-center justify-between">
                            <Text className="text-[#1E293B] text-lg font-bold">
                                Dorm Students
                            </Text>
                            <Text className="text-[#64748B] text-sm font-bold">
                                {filteredStudents.length} students
                            </Text>
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <StudentCard student={item} onPress={onStudentPress} />
                )}
                ListEmptyComponent={
                    <View className="bg-white rounded-2xl p-5 border border-gray-100">
                        <Text className="text-[#64748B] text-sm font-semibold text-center">
                            No students match this search.
                        </Text>
                    </View>
                }
            />

            <StudentFilterModal
                visible={filterVisible}
                majors={majors}
                blocks={managementBlockOptions}
                floors={floors}
                selectedMajor={selectedMajor}
                selectedBlock={selectedBlock}
                selectedFloor={selectedFloor}
                onClose={() => setFilterVisible(false)}
                onApply={(major, block, floor) => {
                    setSelectedMajor(major);
                    setSelectedBlock(block);
                    setSelectedFloor(floor);
                    setFilterVisible(false);
                }}
            />
        </>
    );
}
