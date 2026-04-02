import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: '#0A0A0A',
				foreground: '#FFFFFF',
				primary: {
					DEFAULT: '#3B82F6',
					foreground: '#FFFFFF',
				},
				secondary: {
					DEFAULT: '#111111',
					foreground: '#FFFFFF'
				},
				destructive: {
					DEFAULT: '#EF4444',
					foreground: '#FFFFFF'
				},
				success: {
					DEFAULT: '#10B981',
					foreground: '#FFFFFF'
				},
				warning: {
					DEFAULT: '#F59E0B',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#1A1A1A',
					foreground: '#A1A1AA'
				},
				accent: {
					DEFAULT: '#3B82F6',
					foreground: '#FFFFFF'
				},
				ai: {
					DEFAULT: '#8B5CF6',
					foreground: '#FFFFFF'
				},
				popover: {
					DEFAULT: '#111111',
					foreground: '#FFFFFF'
				},
				card: {
					DEFAULT: '#111111',
					foreground: '#FFFFFF',
					border: '#1F1F1F'
				}
			},
			borderRadius: {
				lg: '12px',
				md: '10px',
				sm: '8px'
			},
			fontFamily: {
				sans: ["Inter", "sans-serif"],
				heading: ["Cal Sans", "Syne", "sans-serif"],
			},
			boxShadow: {
				'premium': '0 0 40px rgba(59,130,246,0.08)',
				'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
