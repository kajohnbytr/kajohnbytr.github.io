
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'neon-blue': '#00f7ff',
                'neon-cyan': '#00ffff',
                'neon-teal': '#00ffea',
                'dark-bg': '#0a0f1f',
                'glass': 'rgba(255, 255, 255, 0.1)'
            },
            fontFamily: {
                'poppins': ['Poppins', 'sans-serif']
            },
            boxShadow: {
                'neon': '0 0 15px rgba(0, 247, 255, 0.5)',
                'neon-hover': '0 0 20px rgba(0, 247, 255, 0.8)',
                'glass': '0 8px 32px rgba(0, 0, 0, 0.2)'
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' }
                }
            }
        }
    }
}
