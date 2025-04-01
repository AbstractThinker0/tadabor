import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

const ReactCompilerConfig = {};

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
    tsconfigPaths(),
  ],
  build: {
    outDir: "build",
  },
  server: {
    open: false,
    port: 3000,
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
});
