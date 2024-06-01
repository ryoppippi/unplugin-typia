import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import UnpluginTypia from "unplugin-typia";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UnpluginTypia.vite({}),
    react(),
  ],
});
