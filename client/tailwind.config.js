/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		clipPath: {
  			squircle: `path('M0.5,16C0.5,7.16,7.16,0.5,16,0.5H96C104.84,0.5,111.5,7.16,111.5,16V96C111.5,104.84,104.84,111.5,96,111.5H16C7.16,111.5,0.5,104.84,0.5,96Z')`
  		},
  		colors: {
  			primaryText: '#1A4384',
  			'admin-bg-primary': '#0D0F10',
  			'admin-bg-secondary': '#131619',
  			'admin-bg-box': '#1C2023',
  			'admin-gb-box-active': '#5B6166',
  			'admin-extra-light': '#2D353C',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		keyframes: {
  			'glow-ring': {
  				'0%': {
  					boxShadow: '0 0 0 0 #05bada66'
  				},
  				'70%': {
  					boxShadow: '0 0 0 10px rgba(218,103,68,0)'
  				},
  				'100%': {
  					boxShadow: '0 0 0 0 rgba(218,103,68,0)'
  				}
  			},
  			bellRing: {
  				'0%, 100%': {
  					transform: 'rotate(0deg)',
  					'transform-origin': 'top'
  				},
  				'15%': {
  					transform: 'rotate(10deg)'
  				},
  				'30%': {
  					transform: 'rotate(-10deg)'
  				},
  				'45%': {
  					transform: 'rotate(5deg)'
  				},
  				'60%': {
  					transform: 'rotate(-5deg)'
  				},
  				'75%': {
  					transform: 'rotate(2deg)'
  				}
  			}
  		},
  		animation: {
  			'glow-ring': 'glow-ring 1.5s infinite',
  			bellRing: 'bellRing 0.9s both'
  		},
  		backgroundImage: {
  			auth: "url(/images/auth_bg.jpg)",
  			login: "url(/images/login_bg.svg)",
  			hero: 'url(/images/hero_banner.jpg)'
  		},
  		fontFamily: {
  			jakarta: [
  				'Plus Jakarta Sans"',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}