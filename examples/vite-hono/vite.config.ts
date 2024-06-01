import devServer from '@hono/vite-dev-server'
import pages from '@hono/vite-cloudflare-pages'
import { defineConfig } from "vite";
import UnpluginTypia from "unplugin-typia/vite";

const entry = "main.ts";
export default defineConfig({
  plugins: [
    UnpluginTypia(),
    pages({ entry }),
    devServer({ entry }),
  ],
});
