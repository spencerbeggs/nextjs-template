const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	content: ["./src/components/**/*.{js,ts,jsx,tsx}", "./src/pages/**/*.{js,ts,jsx,tsx}"],
	theme: {
		container: {
			center: true
		},
			fontFamily: {
				sans: ["Inter var", ...defaultTheme.fontFamily.sans]
			
		}
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/forms"),
		require("@tailwindcss/aspect-ratio"),
		require("@tailwindcss/line-clamp")
	]
};
