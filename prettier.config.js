module.exports = {
	"useTabs": true,
	"tabWidth": 4,
	"trailingComma": "none",
	"printWidth": 125,
	"plugins": [require("plugin-prettier-tailwindcss"), require("stylelint-prettier")],
	"overrides": [{
			"files": [".prettierrc", ".eslintrc"],
			"options": {
				"parser": "json"
			}
		}
	]
}
