import { readdirSync, rmSync } from "node:fs"
import { builtinModules } from "node:module"
import { join } from "node:path"
import { defineConfig } from "rolldown"
import { dts } from "rolldown-plugin-dts"
import { dependencies } from "./package.json"

const root = import.meta.dirname
const out = join(root, "out")
const lib = defineConfig({
  external: [/^node:/g, ...Object.keys(dependencies), ...builtinModules],
  input: ["index"].map((n) => join(root, `src/${n}.ts`)),
  output: { dir: out, format: "esm", minify: true, sourcemap: true },
})

const esModule = defineConfig({ plugins: [dts({ sourcemap: true })], ...lib })
const commonJS = defineConfig({
  ...lib,
  output: {
    ...lib.output,
    dir: join(out, "commonjs"),
    format: "commonjs",
    exports: "named",
  },
})

for (const n of readdirSync(out)) rmSync(join(out, n), { recursive: true })
export default defineConfig([esModule, commonJS])
