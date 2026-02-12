/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                outfit: ['Outfit', 'sans-serif'],
            },
            colors: {
                // Add any custom colors if needed, looking at reference usage
            },
            animation: {
                'fake-pulse': 'pulse 8s infinite', // Example derived from App.tsx inline styles
            }
        },
    },
    plugins: [],
}
