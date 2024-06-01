import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import UnpluginTypia from "unplugin-typia/vite";

export default defineConfig({
  clearScreen: false,
  build: {
    minify: false,
  },
  plugins: [
    Inspect(),
    UnpluginTypia({}),
  ],
});
