import { builtinModules } from 'node:module';

import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginJest from 'eslint-plugin-jest';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

export default [
  // 1. Global Ignores
  {
    ignores: ['dist', 'node_modules', '.output', 'coverage', './*.js'],
  },

  // 2. Base JavaScript & TypeScript Configuration
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
  eslintPluginUnicorn.configs.recommended,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      // Optional: Type-checked rules often flag code in JS files incorrectly;
      // you might want to disable type-checking for plain JS files if you have them.
      'unicorn/no-null': 'off',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Node.js builtins.
            [
              `^(${builtinModules.map((moduleName) => `node:${moduleName}`).join('|')})(/|$)`,
            ],
            // libs.
            [String.raw`^@?(\w|.)[^./]`],
            // Internal libs.
            // Same scope imports
            [
              String.raw`^\.\.(?!/?$)`, // Parent imports. Put `..` last.
              String.raw`^\.\./?$`,
            ],
            // Other relative imports. Put same-folder imports and `.` last.
            [
              String.raw`^\./(?=.*/)(?!/?$)`,
              String.raw`^\.(?!/?$)`,
              String.raw`^\./?$`,
            ],
            // Style imports.
            [String.raw`^.+\.s?css$`],
            // Image imports.
            [String.raw`^.+\.svg|png|jpg$`],
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        // These two lines enable type-aware linting
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {},
  },

  // 3. React Configuration
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
          },
        },
      ],
    },
  },

  // 5. Vitest Configuration
  {
    files: ['**/*.test.{ts,tsx,js}', '**/*.spec.{ts,tsx,js}', 'css-stub.js'],
    plugins: {
      jest: pluginJest,
    },
    languageOptions: {
      globals: { ...globals.node, ...pluginJest.environments.globals.globals },
    },
    rules: {
      ...pluginJest.configs.recommended.rules,
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      'unicorn/prefer-module': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
          },
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  eslintConfigPrettier, // align prettier rules with eslint rules
];
