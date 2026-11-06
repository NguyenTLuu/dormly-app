import type { ResidentProfileData } from '@/types/residentProfile';
import type { ResidentDocument } from '@/types/managerResident';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

export default function ResidentProfileSections({
    profile,
    onViewDocument,
}: {
    profile: ResidentProfileData;
    onViewDocument: (document: ResidentDocument) => void;
}) {
    const academic = profile.academic;
    return (
        <View className="gap-4">
            <View className="bg-white border border-slate-100 rounded-2xl p-5 gap-3">
                <Text className="text-slate-800 text-lg font-bold">
                    Academic profile
                </Text>
                {academic ? (
                    <>
                        <Field
                            label="Student code"
                            value={academic.studentCode}
                        />
                        <Field label="Major" value={academic.major} />
                        <Field
                            label="Identity number"
                            value={academic.identityNumber}
                        />
                        <Field
                            label="Study period"
                            value={
                                academic.startYear || academic.endYear
                                    ? `${academic.startYear ?? '—'} – ${academic.endYear ?? '—'}`
                                    : null
                            }
                        />
                        <Field
                            label="Sleep / wake"
                            value={
                                academic.sleepTime || academic.wakeUpTime
                                    ? `${academic.sleepTime || '—'} / ${academic.wakeUpTime || '—'}`
                                    : null
                            }
                        />
                        <Field
                            label="Roommate preference"
                            value={academic.roommatePreference}
                        />
                        {academic.traits?.length ? (
                            <Field
                                label="Profile traits"
                                value={academic.traits.join(', ')}
                            />
                        ) : null}
                    </>
                ) : (
                    <Text className="text-slate-500">
                        This resident has not completed an academic profile.
                    </Text>
                )}
                <Text className="text-slate-400 text-xs">
                    Academic information is maintained by the resident.
                </Text>
            </View>
            <View className="bg-white border border-slate-100 rounded-2xl p-5 gap-3">
                <Text className="text-slate-800 text-lg font-bold">
                    Personal documents
                </Text>
                {profile.documents.map((document) => (
                    <View
                        key={document.id}
                        className="border-t border-slate-100 pt-3 gap-1"
                    >
                        <Text className="text-slate-800 font-semibold">
                            {label(document.documentType)}
                        </Text>
                        <Text
                            className={
                                document.status === 'APPROVED'
                                    ? 'text-emerald-700 font-semibold'
                                    : document.status === 'REJECTED'
                                      ? 'text-red-700 font-semibold'
                                      : 'text-amber-700 font-semibold'
                            }
                        >
                            {label(document.status)}
                        </Text>
                        {document.rejectReason ? (
                            <Text className="text-red-700 text-sm">
                                Reason: {document.rejectReason}
                            </Text>
                        ) : null}
                        {document.createdAt ? (
                            <Text className="text-slate-500 text-xs">
                                Submitted {formatDate(document.createdAt)}
                            </Text>
                        ) : null}
                        <TouchableOpacity
                            onPress={() => onViewDocument(document)}
                            accessibilityRole="button"
                            accessibilityLabel={`View ${label(document.documentType)} file`}
                            className="mt-2 flex-row items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5"
                        >
                            <Ionicons
                                name="eye-outline"
                                size={17}
                                color="#1D4ED8"
                            />
                            <Text className="text-blue-700 font-bold">
                                View file
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
                {!profile.documents.length ? (
                    <Text className="text-slate-500">
                        No personal documents uploaded.
                    </Text>
                ) : null}
                <Text className="text-slate-400 text-xs">
                    Document review actions are available in the Resident tab.
                </Text>
            </View>
        </View>
    );
}

function Field({
    label: fieldLabel,
    value,
}: {
    label: string;
    value?: string | null;
}) {
    return (
        <View className="flex-row justify-between gap-4 border-t border-slate-50 pt-2">
            <Text className="text-slate-500 flex-1">{fieldLabel}</Text>
            <Text className="text-slate-800 font-medium flex-1 text-right">
                {value || 'Not provided'}
            </Text>
        </View>
    );
}

function label(value: string) {
    return value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string) {
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date.toLocaleDateString() : value;
}
