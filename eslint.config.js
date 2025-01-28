import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: globals.browser // Add browser-specific globals
    },
    plugins: ["prettier"], // Add Prettier as a plugin
    rules: {
      "prettier/prettier": "error" // Treat Prettier formatting issues as ESLint errors
    },
    extends: ["eslint:recommended", "plugin:prettier/recommended"] // Use recommended Prettier settings
  },
  pluginJs.configs.recommended
];
