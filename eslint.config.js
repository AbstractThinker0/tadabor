import js from "@eslint/js";
import globals from "globals";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import reactCompiler from "eslint-plugin-react-compiler";
import importPlugin from "eslint-plugin-import";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        React: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      "react-hooks": reactHooks,
      "react-compiler": reactCompiler,
      import: importPlugin,
      "react-refresh": reactRefresh,
      react,
    },
    rules: {
      // Disable error for unused parameters
      "no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "none",
          caughtErrors: "none",
          ignoreRestSiblings: false,
          reportUsedIgnorePattern: false,
        },
      ],
      "react/react-in-jsx-scope": "off",
      "react-compiler/react-compiler": "error",
      "react-refresh/only-export-components": "warn",
      "import/no-unresolved": [
        "error",
        {
          ignore: ["^/"],
        },
      ],
    },
    settings: {
      "import/resolver": {
        alias: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          map: [["@", "./src"]],
        },
      },
      react: {
        version: "detect", // Auto-detect React version
      },
    },
  },
];
