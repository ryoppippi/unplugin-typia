import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import UnpluginTypia from "../../packages/unplugin-typia/src/vite";

export default defineConfig({
  clearScreen: false,
  plugins: [
    UnpluginTypia({
      verbose: true,
      cache: {
        enable: true,
      }
    }),
    sveltekit(),
  ],
});
