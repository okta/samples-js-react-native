module.exports = {
  ignorePatterns: [
    'node_modules/', 
    'dist/', 
    'metro.config.js', 
    '.eslintrc.js',
    '*.e2e.js',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  rules: {
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'semi': ['error', 'always'],
    'indent': ['error', 2],
    'no-var': 0,
    'prefer-rest-params': 0,
    'prefer-spread': 0,
    'prefer-const': 0,
    'node/no-unpublished-require': 0,
    'node/no-unpublished-import': 0,
    'camelcase': 2,
    'complexity': [2, 7],
    'curly': 2,
    'dot-notation': 0,
    'guard-for-in': 2,
    'new-cap': [2, {properties: false}],
    'no-caller': 2,
    'no-empty': 2,
    'no-eval': 2,
    'no-implied-eval': 2,
    'no-multi-str': 0,
    'no-new': 2,
    'no-plusplus': 0,
    'no-undef': 2,
    'no-unused-expressions': [2, {allowShortCircuit: true, allowTernary: true}],
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'max-depth': [2, 3],
    'max-len': [2, 150],
    'max-params': [2, 5],
    'max-statements': [2, 25],
    'quotes': [2, 'single', {allowTemplateLiterals: true}],
    'strict': 0,
    'wrap-iife': [2, 'any'],
    'no-console': 'off',
  },
  globals: { 
    fetch: false 
  },
  overrides: [
    {
      // ES6 processed by Babel
      files: ['*.js'],
      plugins: ['jest', 'react'],
      parser: '@babel/eslint-parser',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      env: {
        es6: true,
        node: true,
      },
      rules: {
        'node/no-unsupported-features/es-syntax': 0,
        'node/no-unsupported-features/node-builtins': 0,
      },
    },
    {
      // Jest specs
      files: ['*.test.js'],
      plugins: ['node', 'jest'],
      env: {
        jest: true,
      },
    },
  ],
};

