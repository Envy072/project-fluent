const base = require('./base');
const reactHooks = require('eslint-plugin-react-hooks');
const reactPlugin = require('eslint-plugin-react');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  ...base,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
];
