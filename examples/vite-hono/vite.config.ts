import devServer from '@hono/vite-dev-server'
import { defineConfig } from "vite";
import UnpluginTypia from "unplugin-typia/vite";

export default defineConfig({
  build: {
    minify: false,
  },
  plugins: [
    UnpluginTypia(),
    devServer({
      entry: "src/index.ts",
    }),
  ],
});
