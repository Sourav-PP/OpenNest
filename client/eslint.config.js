import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import prettier from "eslint-config-prettier";
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      prettier,
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // --- Code style ---
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      indent: ['error', 2],
      
      // --- Best practices ---
      'no-unused-vars': 'off', // use TS rule
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      eqeqeq: ['error', 'always'],
      'no-console': 'off',
      'prefer-const': 'error',
    },
  },
])
