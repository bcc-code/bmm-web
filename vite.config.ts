/* eslint-disable import/no-extraneous-dependencies */
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint2";
import stylelint from "vite-plugin-stylelint";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [eslint({}), stylelint({}), vue()],
  server: {
    port: 9001,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
