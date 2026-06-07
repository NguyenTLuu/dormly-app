import { EmergencyContact } from '@/data/manager-management';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { toast } from 'sonner-native';

interface EmergencyContactCardProps {
    contact: EmergencyContact;
}

export default function EmergencyContactCard({
    contact,
}: EmergencyContactCardProps) {
    return (
        <View className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xl">
            <Text className="text-[#1E293B] text-base font-bold mb-3">
                Emergency Contact
            </Text>
            <View className="flex-row gap-2">
                <View className="flex-1 bg-[#F8FAFC] rounded-2xl p-3 flex-row items-center">
                    <View className="w-10 h-10 rounded-xl bg-blue-50 items-center justify-center mr-3">
                        <Ionicons
                            name="person-outline"
                            size={19}
                            color="#2563EB"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-[#1E293B] text-sm font-bold">
                            {contact.name}
                        </Text>
                        <Text className="text-[#64748B] text-xs font-semibold mt-0.5">
                            {contact.relationship}
                        </Text>
                    </View>
                </View>
                <View className="flex-1 bg-[#F8FAFC] rounded-2xl p-3 flex-row items-center">
                    <Ionicons name="call-outline" size={18} color="#64748B" />
                    <Text className="text-[#1E293B] text-xs font-bold ml-2 flex-1">
                        {contact.phone}
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                activeOpacity={0.75}
                onPress={() =>
                    toast.info('Mock call', {
                        description: `Calling ${contact.name} at ${contact.phone}`,
                    })
                }
                className="bg-[#2563EB] rounded-2xl py-3 items-center mt-3"
            >
                <Text className="text-white text-sm font-bold">Call Now</Text>
            </TouchableOpacity>
        </View>
    );
}
