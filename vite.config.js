import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const pages = [
  "index",
  "shop",
  "store",
  "company",
  "mission",
  "origin",
  "work",
  "column",
  "privacy",
];

const input = Object.fromEntries(
  pages.map((name) => [name, resolve(__dirname, `${name}.html`)]),
);

export default defineConfig({
  build: {
    rollupOptions: {
      input,
    },
  },
});
