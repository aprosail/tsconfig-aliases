import { readFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { cwd } from "node:process"
import stripJsonComments from "strip-json-comments"

/**
 * Loads tsconfig from file path or uses provided config object.
 *
 * 1. When a string path is provided, it reads and parses from the path.
 * 2. When a configuration object is provided, it returns itself.
 * 3. When no parameter is provided, it detect tsconfig.json at cwd.
 *
 * @param tsconfig optional tsconfig.json path or configuration object.
 * @returns parsed tsconfig object.
 */
export function loadTsconfig(tsconfig?: string | Record<string, unknown>) {
  if (!tsconfig || typeof tsconfig === "string") {
    const path = resolve(tsconfig ? tsconfig : join(cwd(), "tsconfig.json"))
    return JSON.parse(stripJsonComments(readFileSync(path, "utf-8")))
  }
  return tsconfig
}

type PathOptions = {
  baseUrl?: string
  paths?: Record<string, string[]>
}

/**
 * Parses path mappings from tsconfig options into absolute path aliases.
 *
 * 1. Processes the `paths` and `baseUrl` compiler options.
 * 2. Creates a mapping of alias patterns to absolute file system paths.
 * 3. Handles wildcard pattern removal from both alias and target paths.
 * 4. Resolves base URL to absolute paths.
 * 5. Filters empty path arrays.
 * 6. When many paths configured for a single alias, only use the first one.
 *
 * @param options tsconfig options containing baseUrl and paths.
 * @returns object mapping alias patterns to absolute file system paths.
 */
export function parsePaths(options: PathOptions = {}) {
  if (!options.paths) return {}

  const baseUrl = options.baseUrl ? resolve(cwd(), options.baseUrl) : cwd()
  const aliases: Record<string, string> = {}

  for (const [alias, paths] of Object.entries(options.paths)) {
    if (paths.length === 0) continue

    const aliasPattern = alias.replace(/\/\*$/, "")
    const targetPath = paths[0].replace(/\/\*$/, "")
    const absolutePath = resolve(baseUrl, targetPath)
    aliases[aliasPattern] = absolutePath
  }

  return aliases
}

/**
 * Parses path aliases from tsconfig.json for bundler configurations
 * into a map from alias pattern to absolute path.
 *
 * @param tsconfig optional tsconfig.json path or configuration object.
 * @returns object mapping alias patterns to absolute file system paths.
 * @example
 * ```ts
 * // Return example: { '@components': '/absolute/path/to/src/components' }
 * const aliases = parseTsconfigAliases()
 * ```
 */
export default function (tsconfig?: string | Record<string, unknown>) {
  return parsePaths(loadTsconfig(tsconfig).compilerOptions as PathOptions)
}
