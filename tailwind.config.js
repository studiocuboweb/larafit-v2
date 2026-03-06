/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./assets/**/*.{css,js}", 
    "./error.vue",
  ],
  theme: {
    extend: {
        fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
        heading: ['Roboto', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
    },
  },
  plugins: [],
  },
}