import { Glob } from "bun";
import { defineConfig } from "bunup";

const entry = Array.from(new Glob("./src/*.ts").scanSync());

export default defineConfig({
  entry,
  format: ["esm"],
  dts: {
    splitting: false,
  },
});
