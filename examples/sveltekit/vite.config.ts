import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import UnpluginTypia from "unplugin-typia/vite";

export default defineConfig({
  clearScreen: false,
  plugins: [
    UnpluginTypia(),
    sveltekit(),
  ],
});
