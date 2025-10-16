import { Glob, build } from "bun";

const entry = Array.from(new Glob("./src/*.ts").scanSync());

await build({
  entrypoints: entry,
  format: "esm",
  outdir: "dist/src",
});
