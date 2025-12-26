import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // Add specific globals if needed
      },
      sourceType: "module",
    },
  },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-undef": "error",
    },
  },
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
