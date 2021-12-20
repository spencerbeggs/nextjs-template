module.exports = {
	content: ["./src/components/**/*.{js,ts,jsx,tsx}", "./src/pages/**/*.{js,ts,jsx,tsx}"],
	theme: {
		container: {
			center: true
		},
		fontFamily: {
			sans: [
				"Neue Haas Grotesk Text Pro",
				"ui-sans-serif",
				"system-ui",
				"-apple-system",
				"BlinkMacSystemFont",
				"Segoe UI",
				"Roboto",
				"Helvetica Neue",
				"Arial",
				"Noto Sans",
				"sans-serif",
				"Apple Color Emoji",
				"Segoe UI Emoji",
				"Segoe UI Symbol",
				"Noto Color Emoji"
			],
			serif: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
			mono: [
				"ui-monospace",
				"SFMono-Regular",
				"Menlo",
				"Monaco",
				"Consolas",
				"Liberation Mono",
				"Courier New",
				"monospace"
			],
			// eslint-disable-next-line quotes
			body: ["Neue Haas Grotesk Text Pro"],
			headline: ["Roslindale"]
		},
		extend: {
			colors: {
				black: "#000000",
				cornflower: {
					default: "#8ec6eb",
					medium: "#b1d7f1",
					light: "#e5f2fa"
				},
				"steel-blue": {
					default: "#4b89b3",
					dark: "#162a39"
				},
				white: {
					default: "#ffffff",
					"transparent-10": "rgba(255 255 255 / 10%)"
				},
				coolGray: {
					default: "#757575"
				}
			},
			transitionProperty: {
				maxHeight: "max-height",
				left: "left"
			},
			fontFamily: {
				// eslint-disable-next-line quotes
				primary: ["Neue Haas Grotesk Text Pro", "serif"],
				secondary: ["Quattrocento Sans", "sans-serif"]
			}
		}
	},
	plugins: ["@tailwindcss/typography", "@tailwindcss/forms", "@tailwindcss/aspect-ratio", "@tailwindcss/line-clamp"]
};
