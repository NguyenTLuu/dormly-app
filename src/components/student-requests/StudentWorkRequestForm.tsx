import {
    StudentAttachment,
    StudentIssueType,
    StudentRequestKind,
    studentIssueTypes,
    studentPriorityOptions,
    submitStudentWorkRequest,
} from '@/data/student-requests';
import { Priority } from '@/data/manager-requests';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { toast } from 'sonner-native';
import AttachmentPicker from './AttachmentPicker';
import StudentRequestHeader from './StudentRequestHeader';

const issueTypeStyles: Record<
    StudentIssueType,
    { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }
> = {
    Electric: { icon: 'flash-outline', color: '#D97706', bg: '#FEF3C7' },
    Water: { icon: 'water-outline', color: '#0284C7', bg: '#E0F2FE' },
    Internet: { icon: 'wifi-outline', color: '#2563EB', bg: '#DBEAFE' },
    Facility: { icon: 'build-outline', color: '#EA580C', bg: '#FFEDD5' },
};

interface StudentWorkRequestFormProps {
    kind: StudentRequestKind;
}

export default function StudentWorkRequestForm({
    kind,
}: StudentWorkRequestFormProps) {
    const router = useRouter();
    const params = useLocalSearchParams<{ type?: StudentIssueType }>();
    const isIssue = kind === 'issue';
    const accentColor = isIssue ? '#EA580C' : '#7C3AED';
    const accentBg = isIssue ? '#FFF7ED' : '#F5F3FF';
    const [issueType, setIssueType] = useState<StudentIssueType | undefined>(
        isIssue && studentIssueTypes.includes(params.type as StudentIssueType)
            ? (params.type as StudentIssueType)
            : undefined
    );
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>('Medium');
    const [attachments, setAttachments] = useState<StudentAttachment[]>([]);

    const handleSubmit = () => {
        if (isIssue && !issueType) {
            toast.error('Select an issue type');
            return;
        }
        if (!title.trim() || !description.trim()) {
            toast.error('Title and description are required');
            return;
        }

        submitStudentWorkRequest({
            kind,
            issueType,
            title: title.trim(),
            description: description.trim(),
            priority,
            attachments,
        });
        toast.success(isIssue ? 'Issue submitted' : 'Complaint submitted', {
            description: 'Dormitory management will review your request.',
        });
        router.back();
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-[#F4FAFD]"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                className="flex-1"
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                automaticallyAdjustKeyboardInsets
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 160 }}
            >
                <StudentRequestHeader
                    title={isIssue ? 'Report an issue' : 'Create complaint'}
                    subtitle={
                        isIssue
                            ? 'Tell us what needs to be fixed'
                            : 'Share your concern with dormitory management'
                    }
                    color={accentColor}
                />

                <View className="px-4 pt-5">
                    {isIssue && (
                        <View className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xl mb-4">
                            <Text className="text-[#1E293B] text-base font-bold">
                                Choose issue type
                            </Text>
                            <Text className="text-[#94A3B8] text-xs font-medium mt-1">
                                Select the category that best matches the issue.
                            </Text>
                            <View className="flex-row flex-wrap justify-between mt-3">
                                {studentIssueTypes.map((type) => {
                                    const style = issueTypeStyles[type];
                                    const selected = issueType === type;

                                    return (
                                        <TouchableOpacity
                                            key={type}
                                            activeOpacity={0.75}
                                            onPress={() => setIssueType(type)}
                                            className="w-[48%] rounded-2xl border p-3 mb-3 flex-row items-center"
                                            style={{
                                                borderColor: selected
                                                    ? style.color
                                                    : '#E2E8F0',
                                                backgroundColor: selected
                                                    ? style.bg
                                                    : '#FFFFFF',
                                            }}
                                        >
                                            <View
                                                className="w-10 h-10 rounded-xl items-center justify-center"
                                                style={{
                                                    backgroundColor: style.bg,
                                                }}
                                            >
                                                <Ionicons
                                                    name={style.icon}
                                                    size={20}
                                                    color={style.color}
                                                />
                                            </View>
                                            <Text
                                                className="text-sm font-bold ml-2 flex-1"
                                                style={{
                                                    color: selected
                                                        ? style.color
                                                        : '#475569',
                                                }}
                                            >
                                                {type}
                                            </Text>
                                            {selected && (
                                                <Ionicons
                                                    name="checkmark-circle"
                                                    size={18}
                                                    color={style.color}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    <View className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xl">
                        <FormLabel
                            label={isIssue ? 'Issue title' : 'Complaint title'}
                        />
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder={
                                isIssue
                                    ? 'Example: Bathroom light is not working'
                                    : 'Briefly summarize your complaint'
                            }
                            placeholderTextColor="#94A3B8"
                            className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-[#1E293B] text-sm mt-2"
                        />

                        <View className="mt-5">
                            <FormLabel label="Description" />
                            <TextInput
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Describe what happened, where, and any details that may help."
                                placeholderTextColor="#94A3B8"
                                multiline
                                textAlignVertical="top"
                                className="min-h-32 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-[#1E293B] text-sm mt-2"
                            />
                        </View>

                        <View className="mt-5">
                            <FormLabel label="Priority" />
                            <View className="flex-row mt-2">
                                {studentPriorityOptions.map((option, index) => {
                                    const selected = priority === option;
                                    const color =
                                        option === 'Urgent'
                                            ? '#DC2626'
                                            : option === 'Medium'
                                              ? '#D97706'
                                              : '#16A34A';

                                    return (
                                        <TouchableOpacity
                                            key={option}
                                            activeOpacity={0.75}
                                            onPress={() => setPriority(option)}
                                            className={`flex-1 rounded-xl border py-3 items-center ${
                                                index === 1 ? 'mx-2' : ''
                                            }`}
                                            style={{
                                                borderColor: selected
                                                    ? color
                                                    : '#E2E8F0',
                                                backgroundColor: selected
                                                    ? `${color}12`
                                                    : '#FFFFFF',
                                            }}
                                        >
                                            <Text
                                                className="text-xs font-bold"
                                                style={{
                                                    color: selected
                                                        ? color
                                                        : '#64748B',
                                                }}
                                            >
                                                {option}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View className="h-px bg-slate-100 my-5" />
                        <AttachmentPicker
                            attachments={attachments}
                            accentColor={accentColor}
                            accentBg={accentBg}
                            onChange={setAttachments}
                        />
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleSubmit}
                        className="rounded-2xl py-4 items-center mt-5"
                        style={{ backgroundColor: accentColor }}
                    >
                        <Text className="text-white text-base font-bold">
                            {isIssue ? 'Submit issue' : 'Submit complaint'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function FormLabel({ label }: { label: string }) {
    return (
        <Text className="text-[#1E293B] text-sm font-bold">
            {label}
            <Text className="text-red-500"> *</Text>
        </Text>
    );
}
