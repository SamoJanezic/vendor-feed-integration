// eslint.config.js
export default [
  {
    files: ["*.js", "*.mjs"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    rules: {
      "no-console": "off",
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
    },
  },
];