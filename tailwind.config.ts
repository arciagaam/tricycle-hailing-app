/* eslint-disable @typescript-eslint/no-require-imports */

import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				'red-hat': ['var(--font-red-hat)'],
			},
			keyframes: {
				'building-movement': {
					'0%': { transform: 'translateX(0px)', opacity: '0' },
					'50%': { opacity: '1' },
					'90%': { transform: 'translateX(-100px)' },
					'100%': { opacity: '0', transition: 'ease-in-out' },
				},
				moveRight: {
					'0%': { transform: 'translateX(20px)', opacity: '0' },
					'50%': { opacity: '1' },
					'90%': { transform: 'translateX(140px)', opacity: '0' },
					'100%': { opacity: '0', transition: 'ease-in-out' }, // Reset instantly
				},
				'fade-in-out': {
					'0%': { opacity: '0.1' },
					'50%': { opacity: '1' },
					'100%': { opacity: '0.1', transition: 'ease-in-out' }
				}
			},
			animation: {
				moveRight: 'moveRight 5s infinite',
				'building-movement': 'building-movement 6s infinite',
				'fade-in-out': 'fade-in-out 2s infinite'
			},

			colors: {
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
				inactive: {
					DEFAULT: 'hsl(var(--inactive))'
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
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
