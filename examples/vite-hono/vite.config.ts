import devServer from '@hono/vite-dev-server'
import { defineConfig } from "vite";
import UnpluginTypia from "unplugin-typia";

export default defineConfig({
  build: {
    minify: false,
  },
  plugins: [
    UnpluginTypia.vite(),
    devServer({
      entry: "src/index.ts",
    }),
  ],
});
