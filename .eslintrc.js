const eslintrc = {
  extends: ['eslint-config-pipenet-base/react', 'eslint-config-pipenet-base/typescript'],
  env: {
    browser: true,
    jasmine: true,
    jest: true,
    es6: true,
  },
  plugins: ['markdown', 'react', 'babel'],
};

module.exports = eslintrc;
