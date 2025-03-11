module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jest/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'jest',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/prop-types': 'warn', // Warn about missing prop types
    'no-unused-vars': 'warn', // Warn about unused variables
    'jest/no-disabled-tests': 'warn', // Warn about disabled tests
    'jest/no-focused-tests': 'error', // Error on focused tests
    'jest/no-identical-title': 'error', // Error on identical test titles
    'jest/prefer-to-have-length': 'warn', // Prefer toHaveLength over checking .length
    'jest/valid-expect': 'error', // Enforce valid expect() usage
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect React version
    },
  },
}; 