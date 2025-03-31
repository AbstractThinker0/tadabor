module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "eslint-plugin-react-compiler",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["react-refresh"],
  rules: {
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
  },
};
