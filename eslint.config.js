import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";

export default defineConfig(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        React: "readonly",
        APP_VERSION: "readonly",
        APP_BUILD_DATE: "readonly",
        APP_MODE: "readonly",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      import: importPlugin,
      "react-refresh": reactRefresh,
      react,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
    settings: {
      "import/resolver": {
        alias: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          map: [
            ["@", "./src"],
            [
              "virtual:pwa-register/react",
              "./node_modules/vite-plugin-pwa/client.d.ts",
            ],
          ],
        },
      },
      react: {
        version: "detect", // Auto-detect React version
      },
    },
  }
);
