// ESLint flat config for v9+
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

export default tseslint.config(js.configs.recommended, ...tseslint.configs.recommended, {
  files: ['**/*.ts'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: './tsconfig.json', // enables type-aware linting
    },
    globals: {
      ...globals.node, // This adds Node.js globals like 'process', 'Buffer', etc.
      ...globals.es2021, // Modern JavaScript globals
    },
  },
  plugins: {
    '@typescript-eslint': tseslint.plugin,
    prettier,
  },
  rules: {
    /* ----- Core TypeScript Rules ----- */
    'no-unused-vars': 'off', // handled by TS
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',

    /* ----- Node.js Specific Rules ----- */
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-process-exit': 'error',

    /* ----- Style / Misc ----- */
    semi: ['error', 'always'],
    quotes: ['error', 'double'],
    eqeqeq: ['error', 'always'],
  },
});
