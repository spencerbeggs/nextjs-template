module.exports = {
	"useTabs": true,
	"tabWidth": 4,
	"trailingComma": "none",
	"printWidth": 125,
	"plugins": [require("prettier-plugin-tailwindcss"), require("stylelint-prettier")],
	"overrides": [{
			"files": [".eslintrc", "public/site.manifest"],
			"options": {
				"parser": "json"
			}
		}
	]
};
