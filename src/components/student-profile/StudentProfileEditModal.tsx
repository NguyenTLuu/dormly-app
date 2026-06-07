import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { toast } from 'sonner-native';

export interface StudentProfileForm {
    fullName: string;
    studentId: string;
    email: string;
    phone: string;
    dob: string;
    major: string;
}

interface StudentProfileEditModalProps {
    visible: boolean;
    form: StudentProfileForm;
    onChange: (form: StudentProfileForm) => void;
    onClose: () => void;
    onSave: () => void;
}

export default function StudentProfileEditModal({
    visible,
    form,
    onChange,
    onClose,
    onSave,
}: StudentProfileEditModalProps) {
    const { height } = useWindowDimensions();

    const handleSave = () => {
        if (!form.email.trim() || !form.phone.trim() || !form.dob.trim()) {
            toast.error('Complete all personal information fields');
            return;
        }
        onSave();
        toast.success('Profile information updated');
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-end bg-black/45"
            >
                <View
                    className="bg-[#F4FAFD] rounded-t-[32px] overflow-hidden"
                    style={{ maxHeight: height * 0.9 }}
                >
                    <View className="items-center pt-2">
                        <View className="w-10 h-1.5 rounded-full bg-slate-300" />
                    </View>
                    <View className="px-5 pt-4 pb-4 flex-row items-center">
                        <View className="w-11 h-11 rounded-2xl bg-blue-100 items-center justify-center">
                            <Ionicons
                                name="person-outline"
                                size={22}
                                color="#2563EB"
                            />
                        </View>
                        <View className="ml-3 flex-1">
                            <Text className="text-[#1E293B] text-xl font-bold">
                                Edit personal info
                            </Text>
                            <Text className="text-[#64748B] text-xs font-medium mt-0.5">
                                Keep your contact details up to date
                            </Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={onClose}
                            className="w-10 h-10 rounded-full bg-white items-center justify-center"
                        >
                            <Ionicons name="close" size={20} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        automaticallyAdjustKeyboardInsets
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 16,
                            paddingBottom: 24,
                        }}
                    >
                        <View className="bg-blue-600 rounded-3xl p-4 flex-row items-center">
                            <View className="w-12 h-12 rounded-2xl bg-white/15 items-center justify-center">
                                <Ionicons
                                    name="id-card-outline"
                                    size={23}
                                    color="white"
                                />
                            </View>
                            <View className="ml-3 flex-1">
                                <Text className="text-white text-base font-bold">
                                    {form.fullName}
                                </Text>
                                <Text className="text-blue-100 text-xs font-medium mt-1">
                                    {form.studentId} - {form.major}
                                </Text>
                            </View>
                        </View>

                        <View className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xl mt-4">
                            <ProfileInput
                                label="Email address"
                                icon="mail-outline"
                                value={form.email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onChangeText={(email) =>
                                    onChange({ ...form, email })
                                }
                            />
                            <ProfileInput
                                label="Phone number"
                                icon="call-outline"
                                value={form.phone}
                                keyboardType="phone-pad"
                                onChangeText={(phone) =>
                                    onChange({ ...form, phone })
                                }
                            />
                            <ProfileInput
                                label="Date of birth"
                                icon="calendar-outline"
                                value={form.dob}
                                placeholder="DD/MM/YYYY"
                                isLast
                                onChangeText={(dob) =>
                                    onChange({ ...form, dob })
                                }
                            />
                        </View>

                        <View className="bg-amber-50 rounded-2xl p-3 flex-row items-start mt-4">
                            <Ionicons
                                name="information-circle-outline"
                                size={18}
                                color="#D97706"
                            />
                            <Text className="text-amber-700 text-xs font-medium leading-5 ml-2 flex-1">
                                Name, student ID, and major are managed by the
                                dormitory office.
                            </Text>
                        </View>

                        <View className="flex-row mt-5">
                            <TouchableOpacity
                                activeOpacity={0.75}
                                onPress={onClose}
                                className="flex-1 bg-white border border-slate-200 py-4 rounded-2xl items-center mr-2"
                            >
                                <Text className="text-[#64748B] font-bold">
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={handleSave}
                                className="flex-1 bg-blue-600 py-4 rounded-2xl items-center ml-2"
                            >
                                <Text className="text-white font-bold">
                                    Save changes
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

function ProfileInput({
    label,
    icon,
    isLast = false,
    ...props
}: React.ComponentProps<typeof TextInput> & {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    isLast?: boolean;
}) {
    return (
        <View className={isLast ? '' : 'mb-4'}>
            <Text className="text-[#475569] text-xs font-bold mb-2">
                {label}
            </Text>
            <View className="flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-3">
                <Ionicons name={icon} size={18} color="#2563EB" />
                <TextInput
                    {...props}
                    placeholderTextColor="#94A3B8"
                    className="flex-1 text-[#1E293B] text-sm py-3.5 ml-2"
                />
            </View>
        </View>
    );
}
