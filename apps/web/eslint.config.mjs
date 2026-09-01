import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  js.configs.recommended,
  ...nextVitals,
  ...nextTs,
  {
    ignores: [".next/**", "node_modules/**", "coverage/**"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn"
    }
  }
];

export default eslintConfig;
