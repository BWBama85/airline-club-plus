import type { Config } from "tailwindcss"

export default {
  content: ["./src/popup/*.{ts,tsx}"],
  theme: {
    extend: {}
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false,
    darkTheme: "dark",
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    logs: true // Shows info about daisyUI version and used config in the console when building your CSS
  }
} satisfies Config
