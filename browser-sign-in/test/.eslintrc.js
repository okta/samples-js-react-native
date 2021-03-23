module.exports = {
  ignorePatterns: [
    'node_modules/', 
    'dist/', 
    'metro.config.js',
    '*.e2e.js',
  ],
  plugins: ['jest', 'react'],
  parser: '@babel/eslint-parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jest/recommended',
  ],
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
};
  
  