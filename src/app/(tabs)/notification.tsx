import React from 'react';
import { View, Text, StatusBar } from 'react-native';
// 1. Import hook lấy kích thước vùng an toàn
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EdgeToEdgeScreen() {
    // Lấy ra các chỉ số top (tai thỏ) và bottom (thanh điều hướng) của thiết bị hiện tại
    const insets = useSafeAreaInsets();

    return (
        <>
            {/* 2. Cấu hình StatusBar trong suốt để nền chui được xuống dưới thanh trạng thái Android */}
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />

            {/* 3. THẺ NGOÀI CÙNG: Không có safe area, chứa màu nền (hoặc ảnh nền), tự động tràn toàn màn hình */}
            <View className="flex-1 bg-[#208AEF]">
                {/* 4. THẺ CHỨA NỘI DUNG: Dùng inline style để đẩy padding-top và padding-bottom */}
                <View
                    className="flex-1 items-center justify-center"
                    style={{
                        paddingTop: insets.top, // Đẩy nội dung xuống dưới tai thỏ
                        paddingBottom: insets.bottom, // Đẩy nội dung lên trên vạch kẻ ngang đáy màn hình
                        paddingLeft: insets.left, // Dùng khi xoay ngang màn hình (tùy chọn)
                        paddingRight: insets.right, // Dùng khi xoay ngang màn hình (tùy chọn)
                    }}
                >
                    <Text className="text-white text-2xl font-bold">
                        Phần nền đã tràn lên tai thỏ!
                    </Text>
                    <Text className="text-white mt-4">
                        Nhưng chữ này vẫn ở vị trí an toàn, không bị che khuất.
                    </Text>
                </View>
            </View>
        </>
    );
}
