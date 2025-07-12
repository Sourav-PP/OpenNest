/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryText: "#1A4384",
        'admin-bg-primary': '#0D0F10',
        'admin-bg-secondary': "#131619",
        'admin-bg-box': "#1C2023",
        'admin-gb-box-active': "#5B6166",
        'admin-extra-light' : "#2D353C"
      },
      keyframes: {
        'glow-ring': {
          '0%': { boxShadow: '0 0 0 0 #05bada66' },
          '70%': { boxShadow: '0 0 0 10px rgba(218,103,68,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(218,103,68,0)' },
        },
        bellRing: {
          "0%, 100%": { transform: "rotate(0deg)", "transform-origin": "top" },
          "15%": { transform: "rotate(10deg)" },
          "30%": { transform: "rotate(-10deg)" },
          "45%": { transform: "rotate(5deg)" },
          "60%": { transform: "rotate(-5deg)" },
          "75%": { transform: "rotate(2deg)" },
        },
      },
      animation: {
        'glow-ring': 'glow-ring 1.5s infinite',
        bellRing: "bellRing 0.9s both",
      },
      backgroundImage: {
        'auth': "url('/images/auth_bg.jpg')",
        'login': "url('/images/login_bg.svg')",
        'hero': "url(/images/hero_banner.jpg)"
      },
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}