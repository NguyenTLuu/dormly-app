const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname)

// Đã thêm chữ "src" vào đường dẫn
module.exports = withNativeWind(config, { input: './src/global.css' })