import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import unusedImports from 'eslint-plugin-unused-imports';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        ignores: ["eslint.config.mjs"], 
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
                sourceType: 'module',
            },
            globals: globals.node,
        },
        plugins: {
            js,
            '@typescript-eslint': tseslint.plugin,
            'unused-imports': unusedImports,
        },
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            prettier,
        ],
        rules: {
            // --- Formatting & Style ---
            indent: ['error', 4],
            quotes: ['error', 'single', { avoidEscape: true }],
            semi: ['error', 'always'],
            'comma-dangle': ['error', 'always-multiline'],
            'object-curly-spacing': ['error', 'always'],
            'array-bracket-spacing': ['error', 'never'],
            'space-before-function-paren': ['error', 'never'],
            'keyword-spacing': ['error', { before: true, after: true }],

            // --- Best Practices ---
            'no-unused-vars': 'off', // turn off base rule for TS
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                { vars: 'all', varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
            ],
            
            'no-console': 'off',
            eqeqeq: ['error', 'always'],
            'no-var': 'error',
            'prefer-const': 'error',
            'no-duplicate-imports': 'error',
            'no-shadow': 'error',

            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'property',
                    modifiers: ['private'],
                    format: ['camelCase'],
                    leadingUnderscore: 'require',
                },
                {
                    selector: 'function',
                    format: ['camelCase'],
                },
                {
                    selector: 'parameter',
                    format: ['camelCase'], // cannot enforce private here
                },
            ],

            // --- TypeScript-specific ---
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-non-null-assertion': 'warn',
        },
    },
]);
