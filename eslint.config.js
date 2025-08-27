// ESLint flat config for v9+
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node, // This adds Node.js globals like 'process', 'Buffer', etc.
        ...globals.es2021, // Modern JavaScript globals
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier,
    },
    rules: {
      // 'prettier/prettier': 'error',
      // '@typescript-eslint/explicit-function-return-type': 'warn',
      // '@typescript-eslint/no-explicit-any': 'warn',
      // '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // 'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];
