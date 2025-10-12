# TSConfig Aliases

[en(English)](./README.md) |
[zh(中文)](./README_zh.md)

Parse aliases from `tsconfig.json` (or other tsconfig files)
for bundler configurations.

This package is designed to work with bundlers like Rolldown.
It is exactly a tool for parsing aliases in `Record<string, string>` format
from a `tsconfig.json` file or parsed object,
you can use it in any bundler that support configuration format like this.

## Usages

### 1. Parse Aliases from `tsconfig.json`

You may configure `tsconfig.json` like this:

```json
{
  // Definitely, this package supports parse from json with comments.
  "compilerOptions": {
    // ... (other compiler options)
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    // ... (custom include paths)
  ]
}
```

And then you can use it in your bundler like this:

```ts
// Rolldown for example.
import { builtinModules } from "node:module"
import { defineConfig } from "rolldown"
import { dts } from "rolldown-plugin-dts"
import tsconfigAliases from "tsconfig-aliases"

export default defineConfig({
  // Configure like this and it will detect tsconfig.json in cwd by default.
  resolve: { alias: tsconfigAliases() },

  // Other options for example.
  plugins: [dts({ sourcemap: true })],
  external: [/^node:/g, ...builtinModules],
  input: "xxx.ts",
  output: { dir: "xxx", format: "esm", minify: true, sourcemap: true },
})
```

### 2. Custom TSConfig Path

You can also specify a custom path to `tsconfig.json` like this:

```ts
// Rolldown for example.
import { builtinModules } from "node:module"
import { defineConfig } from "rolldown"
import { dts } from "rolldown-plugin-dts"
import tsconfigAliases from "tsconfig-aliases"

export default defineConfig({
  // Specify custom tsconfig.json path.
  resolve: { alias: tsconfigAliases("./tsconfig.build.json") },

  // Other options for example.
  plugins: [dts({ sourcemap: true })],
  external: [/^node:/g, ...builtinModules],
  input: "xxx.ts",
  output: { dir: "xxx", format: "esm", minify: true, sourcemap: true },
})
```

### 3. Custom TSConfig Object

```ts
// Rolldown for example.
import { readFileSync } from "node:fs"
import { builtinModules } from "node:module"
import { defineConfig } from "rolldown"
import { dts } from "rolldown-plugin-dts"
import tsconfigAliases from "tsconfig-aliases"

const tsconfig = readFileSync("./tsconfig.xxx.json", "utf-8")

export default defineConfig({
  // Specify custom tsconfig.json object.
  resolve: { alias: tsconfigAliases(tsconfig) },

  // Other options for example.
  plugins: [dts({ sourcemap: true })],
  external: [/^node:/g, ...builtinModules],
  input: "xxx.ts",
  output: { dir: "xxx", format: "esm", minify: true, sourcemap: true },
})
```

## Compatibilities

When using commonjs mode, you need to use `default`
to access the default exported function like this:

```js
const tsconfigAliases = require("tsconfig-aliases").default
```

or:

```js
const { default: tsconfigAliases } = require("tsconfig-aliases")
```

## Open Source License

This package is released under the [Apache 2.0 License](./LICENSE).
