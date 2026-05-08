const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

fs.mkdirSync("assets/dist/js", { recursive: true });
fs.mkdirSync("assets/dist/css", { recursive: true });

const jsFiles = fs
  .readdirSync("assets/js")
  .filter((f) => f.endsWith(".js"))
  .map((f) => path.join("assets/js", f));

Promise.all([
  esbuild.build({
    entryPoints: jsFiles,
    outdir: "assets/dist/js",
    minify: true,
    bundle: false,
    target: ["es2017"],
  }),
  esbuild.build({
    entryPoints: ["assets/css/style.css"],
    outdir: "assets/dist/css",
    minify: true,
  }),
]).then(() => {
  console.log("Build OK");
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
