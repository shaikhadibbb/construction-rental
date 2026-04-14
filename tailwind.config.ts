import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        slate: '#0F172A',
        titanium: '#64748B',
        coral: '#FF6B4A',
        gold: '#FFD700',
        'surface-glass': 'rgba(255,255,255,0.05)',
      },
      fontFamily: {
        'inter-tight': ['var(--font-inter-tight)', 'Inter', 'sans-serif'],
        'space-grotesk': ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
      },
      animation: {
        'mesh-gradient': 'mesh-gradient 15s ease infinite',
        'glow-pulse': 'glow-pulse 2.4s ease-in-out infinite',
        'blur-in': 'blur-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.4)',
        'glow-coral': '0 0 40px rgba(255,107,74,0.3)',
      },
      keyframes: {
        'mesh-gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 rgba(255,107,74,0)' },
          '50%': { boxShadow: '0 0 40px rgba(255,107,74,0.35)' },
        },
        'blur-in': {
          '0%': { opacity: '0', filter: 'blur(10px)', transform: 'translateY(40px)' },
          '100%': { opacity: '1', filter: 'blur(0px)', transform: 'translateY(0px)' },
        },
      },
    },
  },
}

export default config
