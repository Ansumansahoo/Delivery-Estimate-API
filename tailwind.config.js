/** @type {import('tailwindcss').Config} */
export default {
  content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
      ],
      theme: {
    extend: {
      colors: {
        // SwiftETA brand tokens
        brand: {
          DEFAULT: '#6366f1', // indigo-500
                      dark:    '#4338ca', // indigo-700
                      light:   '#a5b4fc', // indigo-300
            },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
                  mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
          },
          },
          },
            plugins: [],
              };
