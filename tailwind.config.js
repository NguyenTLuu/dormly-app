/** @type {import('tailwindcss').Config} */
module.exports = {
  // Đã cập nhật lại đường dẫn trỏ thẳng vào thư mục src
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}