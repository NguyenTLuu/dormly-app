import { Keyboard, Platform } from 'react-native';
import { useEffect, useState } from 'react';

export function useKeyboardBottomPadding(
    closedPadding = 40,
    openPadding = 160
) {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => setIsKeyboardVisible(true)
        );
        const hideSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setIsKeyboardVisible(false)
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return isKeyboardVisible ? openPadding : closedPadding;
}
