import React from 'react';
import { View, ViewProps } from 'react-native';

interface SectionCardProps extends ViewProps {
    children: React.ReactNode;
}

export default function SectionCard({
    children,
    className,
    style,
    ...props
}: SectionCardProps) {
    return (
        <View
            className={`bg-white rounded-2xl p-4 border-gray-900 shadow-xl ${className || ''}`}
            style={style}
            {...props}
        >
            {children}
        </View>
    );
}
