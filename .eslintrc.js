module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module"
    },
    plugins: [
      'simple-import-sort'
    ],
    extends: [
      "plugin:@typescript-eslint/recommended" ,
      "prettier/@typescript-eslint", 
      "plugin:prettier/recommended",
      "plugin:import/errors",
      "plugin:import/warnings",
      "plugin:import/typescript"
    ],
    rules: {
      "prefer-const": "error",
      'no-console': "error",
      "simple-import-sort/sort": "error"
    }
  };