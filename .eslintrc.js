module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [
      resolve(__dirname, './tsconfig.json'),
      resolve(__dirname, './tsconfig.eslint.json'),
    ],
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },

};