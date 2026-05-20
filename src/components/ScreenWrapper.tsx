import {
    SafeAreaView,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { View, StatusBar, ViewProps } from 'react-native';

interface ScreenWrapperProps extends ViewProps {
    children: React.ReactNode;
}
// @ts-ignore
export function ScreenWrapper({
    children,
    style,
    className,
    ...props
}: ScreenWrapperProps) {
    const insets = useSafeAreaInsets();
    return (
        <View
            className={`flex-1 ${className || 'bg-[#F4FAFD]'}`}
            style={[
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                },
                style,
            ]}
            {...props}
        >
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            {children}
        </View>
    );
}
