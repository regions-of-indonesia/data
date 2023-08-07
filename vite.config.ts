import { defineConfig } from "vite";

import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts()],
  build: {
    target: "esnext",
    minify: true,
    lib: {
      entry: ["src/province.ts", "src/district.ts", "src/subdistrict.ts", "src/village.ts"],
      formats: ["cjs", "es"],
    },
    rollupOptions: {
      external: [],
    },
  },
});
