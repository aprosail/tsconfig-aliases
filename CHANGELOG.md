## 1.1.0

Support commonjs module in APIs.

But as the original APIs are designed with default export, you may need to use
`const { default: tsconfigAliases } = require("tsconfig-aliases")`
to access the default export in CommonJS mode.

## 1.0.1

1. fix: externalize dependencies, import `package.json` in `rolldown.config.ts`.
2. docs: add changelog file.
3. chore: add missing recommended extensions.

## 1.0.0

Setup package development environment:

1. `prettier` and `oxlint` for code style.
2. `vitest` for testing.
3. `rolldown` for bundling.
4. Recommended VSCode settings and extensions.

Implement basic functionalities:

1. Parse aliases from `tsconfig.json` for bundler configurations.
2. Support both file path and parsed object.
3. Support detect `tsconfig.json` in current directory by default.
4. Resolve Json with comments.

Documentation:

1. Readme in both English and Chinese languages.
2. Comment documentation for all public functions.
3. Use the Apache 2.0 license.
