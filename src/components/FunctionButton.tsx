import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface FunctionButtonProps extends TouchableOpacityProps {
    children: React.ReactNode;
    label: string;
}

export default function FunctionButton({
    children,
    label,
    className,
    style,
    ...props
}: FunctionButtonProps) {
    return (
        <TouchableOpacity
            className={`rounded-xl bg-gray-50 items-center justify-center py-4 ${className}`}
            style={style}
        >
            {children}
            <Text className="font-medium text-sm mt-2">{label}</Text>
        </TouchableOpacity>
    );
}
