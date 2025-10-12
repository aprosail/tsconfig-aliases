# TSConfig 别名解析工具

[en(English)](./README.md) |
[zh(中文)](./README_zh.md)

从 `tsconfig.json`（或其他 tsconfig 文件）解析别名用于打包器配置。

这个包设计用于与 Rolldown 等打包器配合使用，用于从
`tsconfig.json` 文件或解析后的对象中以 `Record<string, string>`
格式解析别名。您可以在任何支持这种配置格式的打包器中使用它。

## 使用方法

### 1. 从 `tsconfig.json` 解析别名

您可以这样配置 `tsconfig.json`：

```json
{
  // 本库支持解析包含注释的 tsconfig.json 文件。
  "compilerOptions": {
    // ... (其他编译器选项)
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    // ... (自定义包含路径)
  ]
}
```

然后在您的打包器中这样使用：

```ts
// 以 Rolldown 为例。
import { builtinModules } from "node:module"
import { defineConfig } from "rolldown"
import { dts } from "rolldown-plugin-dts"
import tsconfigAliases from "tsconfig-aliases"

export default defineConfig({
  // 这样配置，默认会在当前工作目录检测 tsconfig.json
  resolve: { alias: tsconfigAliases() },

  // 其他选项示例。
  plugins: [dts({ sourcemap: true })],
  external: [/^node:/g, ...builtinModules],
  input: "xxx.ts",
  output: { dir: "xxx", format: "esm", minify: true, sourcemap: true },
})
```

### 2. 自定义 TSConfig 路径

您也可以指定自定义的 `tsconfig.json` 路径：

```ts
// 以 Rolldown 为例。
import { builtinModules } from "node:module"
import { defineConfig } from "rolldown"
import { dts } from "rolldown-plugin-dts"
import tsconfigAliases from "tsconfig-aliases"

export default defineConfig({
  // 指定自定义 tsconfig.json 路径。
  resolve: { alias: tsconfigAliases("./tsconfig.build.json") },

  // 其他选项示例。
  plugins: [dts({ sourcemap: true })],
  external: [/^node:/g, ...builtinModules],
  input: "xxx.ts",
  output: { dir: "xxx", format: "esm", minify: true, sourcemap: true },
})
```

### 3. 自定义 TSConfig 对象

```ts
// 以 Rolldown 为例。
import { readFileSync } from "node:fs"
import { builtinModules } from "node:module"
import { defineConfig } from "rolldown"
import { dts } from "rolldown-plugin-dts"
import tsconfigAliases from "tsconfig-aliases"

const tsconfig = readFileSync("./tsconfig.xxx.json", "utf-8")

export default defineConfig({
  // 指定自定义 tsconfig.json 对象。
  resolve: { alias: tsconfigAliases(tsconfig) },

  // 其他选项示例。
  plugins: [dts({ sourcemap: true })],
  external: [/^node:/g, ...builtinModules],
  input: "xxx.ts",
  output: { dir: "xxx", format: "esm", minify: true, sourcemap: true },
})
```

## 兼容性

当使用 CommonJS 模式时，您需要使用 `default`
来访问默认导出的函数，如下所示：

```js
const tsconfigAliases = require("tsconfig-aliases").default
```

或：

```js
const { default: tsconfigAliases } = require("tsconfig-aliases")
```

## 开源许可证

本包基于 [Apache 2.0 许可证](./LICENSE) 发布。
