import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: resolve(__dirname, "src/html"),
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/html/home.html"),
        categories: resolve(__dirname, "src/html/categories.html"),
        contact: resolve(__dirname, "src/html/contact.html"),
      },
    },
  },
  server: {
    port: 3000,
  },
});
