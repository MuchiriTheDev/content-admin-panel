/*@type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        brown: "#4F391A",
        fadeBrown: '#aa783256',
        yellowGreen: "#AAC624",
        appleGreen: '#7BBF2A' // Adjusted for better distinction
      }
    },
  },
  plugins: [],
}