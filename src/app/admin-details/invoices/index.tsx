import InvoiceManagementScreen from '@/components/admin/InvoiceManagementScreen';
import { useRouter } from 'expo-router';

export default function StaffInvoicesScreen() {
    const router = useRouter();
    return <InvoiceManagementScreen onBack={() => router.back()} />;
}
