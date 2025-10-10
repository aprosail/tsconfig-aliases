import { builtinModules } from "node:module"
import { defineConfig } from "rolldown"
import { dts } from "rolldown-plugin-dts"
import { dependencies } from "./package.json"

export default defineConfig({
  plugins: [dts({ sourcemap: true })],
  external: [/^node:/g, ...Object.keys(dependencies), ...builtinModules],
  input: "src/index.ts",
  output: { dir: "out", format: "esm", minify: true, sourcemap: true },
})
