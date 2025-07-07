/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'glow-ring': {
          '0%': { boxShadow: '0 0 0 0 #05bada66' },
          '70%': { boxShadow: '0 0 0 10px rgba(218,103,68,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(218,103,68,0)' },
        },
      },
      animation: {
        'glow-ring': 'glow-ring 1.5s infinite',
      },
      backgroundImage: {
        'auth': "url('/images/auth_bg.jpg')",
        'login': "url('/images/login_bg.svg')"
      },
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}