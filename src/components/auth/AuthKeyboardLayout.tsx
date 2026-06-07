import { ScreenWrapper } from '@/components/ScreenWrapper';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Keyboard,
    Platform,
    ScrollView,
    StyleProp,
    ViewStyle,
} from 'react-native';

type AuthKeyboardLayoutProps = {
    children: React.ReactNode;
    contentContainerStyle?: StyleProp<ViewStyle>;
};

export default function AuthKeyboardLayout({
    children,
    contentContainerStyle,
}: AuthKeyboardLayoutProps) {
    const keyboardLift = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const showSub = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (event) => {
                const offset = Platform.OS === 'android' ? 10 : 0;

                Animated.timing(keyboardLift, {
                    toValue: event.endCoordinates.height + offset,
                    duration: Platform.OS === 'ios' ? event.duration : 150,
                    useNativeDriver: false,
                }).start();
            }
        );

        const hideSub = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            (event) => {
                Animated.timing(keyboardLift, {
                    toValue: 0,
                    duration: Platform.OS === 'ios' ? event.duration : 150,
                    useNativeDriver: false,
                }).start();
            }
        );

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, [keyboardLift]);

    return (
        <ScreenWrapper className="bg-[#F4FAFD]">
            <Animated.View
                className="flex-1"
                style={{ paddingBottom: keyboardLift }}
            >
                <ScrollView
                    className="flex-1"
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    automaticallyAdjustKeyboardInsets
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        { flexGrow: 1, paddingBottom: 72 },
                        contentContainerStyle,
                    ]}
                >
                    {children}
                </ScrollView>
            </Animated.View>
        </ScreenWrapper>
    );
}
