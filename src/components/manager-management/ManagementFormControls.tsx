import type { PropsWithChildren } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import type { TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export function ManagementSheet({
    title,
    onClose,
    busy,
    children,
}: PropsWithChildren<{ title: string; onClose: () => void; busy?: boolean }>) {
    return (
        <Modal
            visible
            transparent
            animationType="slide"
            onRequestClose={() => {
                if (!busy) onClose();
            }}
        >
            <KeyboardAvoidingView
                className="flex-1 justify-end bg-slate-900/40"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View className="max-h-[90%] rounded-t-3xl bg-white px-5 pt-5 pb-8">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-xl font-bold text-slate-800 flex-1">
                            {title}
                        </Text>
                        <TouchableOpacity
                            disabled={busy}
                            onPress={onClose}
                            accessibilityLabel="Close"
                            className="p-2"
                        >
                            <Ionicons name="close" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ gap: 14, paddingBottom: 32 }}
                    >
                        {children}
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

export function ManagementInput({
    label,
    ...props
}: TextInputProps & { label: string }) {
    return (
        <View>
            <Text className="text-slate-700 font-semibold mb-2">{label}</Text>
            <TextInput
                placeholderTextColor="#94A3B8"
                {...props}
                className="rounded-xl border border-slate-200 p-3 text-slate-800"
            />
        </View>
    );
}

export function ManagementChoice({
    label,
    value,
    options,
    onChange,
    disabled = false,
}: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
    disabled?: boolean;
}) {
    const [search, setSearch] = useState('');
    const visible = options.filter((option) =>
        option.label.toLowerCase().includes(search.trim().toLowerCase())
    );
    return (
        <View>
            <Text className="text-slate-700 font-semibold mb-2">{label}</Text>
            {options.length > 6 ? (
                <TextInput
                    value={search}
                    editable={!disabled}
                    onChangeText={setSearch}
                    placeholder="Search options"
                    className="border border-slate-200 rounded-xl p-3 mb-2 text-slate-800"
                />
            ) : null}
            <ScrollView
                nestedScrollEnabled
                style={{ maxHeight: 190 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="gap-2">
                    {visible.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            disabled={disabled}
                            onPress={() => onChange(option.value)}
                            accessibilityRole="radio"
                            accessibilityState={{
                                selected: value === option.value,
                            }}
                            className={`rounded-xl border p-3 ${value === option.value ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}
                        >
                            <Text
                                className={
                                    value === option.value
                                        ? 'text-blue-700 font-bold'
                                        : 'text-slate-700'
                                }
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    {visible.length === 0 ? (
                        <Text className="text-slate-500 p-2">
                            No options available.
                        </Text>
                    ) : null}
                </View>
            </ScrollView>
        </View>
    );
}

export function ManagementButton({
    label,
    onPress,
    disabled,
    destructive,
}: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
    destructive?: boolean;
}) {
    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            className={`rounded-xl py-3 px-4 items-center ${disabled ? 'bg-slate-300' : destructive ? 'bg-red-600' : 'bg-blue-600'}`}
        >
            <Text className="text-white font-bold">{label}</Text>
        </TouchableOpacity>
    );
}

export function ManagementConfirm({
    title,
    message,
    onConfirm,
    onCancel,
    busy,
    destructive,
}: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    busy: boolean;
    destructive?: boolean;
}) {
    return (
        <ManagementSheet title={title} onClose={onCancel} busy={busy}>
            <Text className="text-slate-600 leading-6">{message}</Text>
            <ManagementButton
                label={busy ? 'Saving...' : 'Confirm'}
                onPress={onConfirm}
                disabled={busy}
                destructive={destructive}
            />
            <TouchableOpacity
                disabled={busy}
                onPress={onCancel}
                className="items-center p-3"
            >
                <Text className="text-slate-600 font-semibold">Cancel</Text>
            </TouchableOpacity>
        </ManagementSheet>
    );
}

export function ManagementQueryState({
    loading,
    error,
    retry,
}: {
    loading: boolean;
    error: boolean;
    retry: () => void;
}) {
    if (loading) return <ActivityIndicator color="#2563EB" className="my-6" />;
    if (error)
        return (
            <TouchableOpacity
                onPress={retry}
                className="bg-red-50 rounded-2xl p-4 my-3"
            >
                <Text className="text-red-700 font-semibold">
                    Could not load room management data. Tap to retry.
                </Text>
            </TouchableOpacity>
        );
    return null;
}
