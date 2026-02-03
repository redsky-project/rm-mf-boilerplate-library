import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
	globalIgnores(['dist']),
	{
		files: ['**/*.{ts,tsx}'],
		plugins: {
			react: react,
		},
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'jsx-quotes': ['error', 'prefer-double'],
			semi: ['error', 'always'],
			'@typescript-eslint/no-empty-object-type': 'off',
			'react/jsx-max-props-per-line': ['error', { maximum: 1 }],
			'react-hooks/exhaustive-deps': 'off',
			'react-hooks/incompatible-library': 'off',
			// "no-unused-vars": "warn", 옵션은 사용되지 않는 변수에 대해 eslint가 경고를 표시하도록 설정합니다.
			// TypeScript를 사용할 때는 "@typescript-eslint/no-unused-vars"를 대신 사용하는 것이 더 좋습니다.
			//"no-unused-vars": "warn",
			'@typescript-eslint/no-unused-vars': 'warn',
			'react-hooks/set-state-in-effect': 'off',
			'react/no-unescaped-entities': 'off',
			'import/no-anonymous-default-export': [
				'warn',
				{
					// export default 할 때 익명 사용 금지 (new 함수만 허용함)
					allowArray: false,
					allowArrowFunction: false,
					allowAnonymousClass: false,
					allowAnonymousFunction: false,
					allowCallExpression: true, // The true value here is for backward compatibility
					allowNew: true,
					allowLiteral: false,
					allowObject: false,
				},
			],
			//'no-restricted-imports': ['error', {
			//	patterns: [
			//		'@/app/(domains)/*/_*', // 다른 도메인의 private 폴더 접근 금지
			//	],
			//}],
		},
	},
]);
