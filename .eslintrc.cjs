module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'simple-import-sort'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	globals: {
		NodeJS: true
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		'simple-import-sort/imports': [
			'warn',
			{
				groups: [
					// Side effect imports.
					['^\\u0000'],
					// Things that start with a letter (or digit or underscore), or `@` followed by a letter.
					['^@?\\w'],
					// Things that start with r `$` followed by a letter.
					['^\\$\\w'],
					// Things that start with a  `~` followed by a letter.
					['^~\\w'],
					// Anything not matched in another group.
					['^'],
					// Relative imports.
					// Anything that starts with a dot.
					['^\\.']
				]
			}
		],
		'simple-import-sort/exports': 'warn',
		'svelte/sort-attributes': 'warn'
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	]
};
