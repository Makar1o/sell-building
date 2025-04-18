import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        categories: resolve(__dirname, "categories.html"),
        contact: resolve(__dirname, "contact.html"),
      },
      output: {
        assetFileNames: "assets/[name].[hash].[ext]",
      },
    },
  },
});
