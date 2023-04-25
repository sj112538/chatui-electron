module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'standard-with-typescript'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
  rules: {
    indent: [
      'error'
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    quotes: [
      'error'
    ],
    semi: [
      'error',
      'always'
    ]
  }
};
