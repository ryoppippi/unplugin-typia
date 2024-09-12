import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import UnpluginTypia from "@ryoppippi/unplugin-typia/vite";
import Inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Inspect(),
    UnpluginTypia({}),
    react(),
  ],
});
