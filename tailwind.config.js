import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
        './resources/views/**/*.blade.php',
        './resources/js/**/*.{ts,tsx,js,jsx}',
    ],
    theme: {
        extend: {
            opacity: Object.fromEntries(
                Array.from({ length: 101 }, (_, i) => [i, `${i / 100}`]),
            ),
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            colors: {
                arena: {
                    bg: '#0B0F17',
                    card: '#151B26',
                    border: '#232D3F',
                    cyan: '#00F0FF',
                    purple: '#7000FF',
                    text: '#F0F4F8',
                    muted: '#8A99AD',
                    success: '#00E676',
                    warning: '#FFB300',
                    danger: '#FF5252',
                },
                background: '#0B0F17',
                foreground: '#F0F4F8',
                border: '#232D3F',
                input: '#232D3F',
                ring: '#00F0FF',
                primary: {
                    DEFAULT: '#00F0FF',
                    foreground: '#0B0F17',
                },
            },
            fontFamily: {
                heading: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                display: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
    plugins: [tailwindcssAnimate],
};
