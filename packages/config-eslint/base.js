const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');
const globals = require('globals');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/test-results/**',
      '**/.turbo/**',
    ],
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // Shared CommonJS config files (e.g. eslint.config.js) and the shared
    // config packages themselves (packages/config-*), all of which use
    // require()/module.exports rather than ES modules.
    files: ['**/*.config.js', '**/*.config.cjs', 'packages/config-*/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
