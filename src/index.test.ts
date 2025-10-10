import { readFileSync } from "node:fs"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import parseTsconfigAliases, { loadTsconfig, parsePaths } from "."

const mockRoot = "/example/project"

vi.mock("node:fs", () => ({
  readFileSync: vi.fn(),
}))

vi.mock("node:path", () => ({
  resolve: vi.fn((...args) => {
    const path = args.join("/").replace(/\.\//g, "")
    if (path.startsWith(mockRoot)) return path
    return `${mockRoot}/${path}`
  }),
}))

vi.mock("node:process", () => ({
  cwd: vi.fn(() => mockRoot),
}))

describe("parseTsconfigAliases", () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => vi.resetAllMocks())

  test("no paths configured", () => {
    const mockConfig = { compilerOptions: { baseUrl: ".", paths: {} } }
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify(mockConfig))
    expect(parseTsconfigAliases()).toEqual({})
  })

  test("from tsconfig object", () => {
    const mockConfig = {
      compilerOptions: {
        baseUrl: ".",
        paths: {
          "@/*": ["./src/*"],
          "~/*": ["./lib/*"],
        },
      },
    }

    expect(parseTsconfigAliases(mockConfig)).toEqual({
      "@": `${mockRoot}/src`,
      "~": `${mockRoot}/lib`,
    })
  })

  test("from tsconfig file", () => {
    const mockConfig = {
      compilerOptions: {
        baseUrl: "./project",
        paths: {
          "@/*": ["./src/*"],
          "components/*": ["./src/components/*"],
        },
      },
    }

    vi.mocked(readFileSync).mockReturnValue(JSON.stringify(mockConfig))
    const result = parseTsconfigAliases("./custom-tsconfig.json")

    expect(readFileSync).toHaveBeenCalledWith(
      expect.stringContaining("custom-tsconfig.json"),
      "utf-8",
    )

    expect(result).toEqual({
      "@": `${mockRoot}/project/src`,
      components: `${mockRoot}/project/src/components`,
    })
  })

  test("with baseUrl", () => {
    const mockConfig = {
      compilerOptions: {
        baseUrl: "./base",
        paths: {
          "@/*": ["./src/*"],
          "utils/*": ["./utils/*"],
        },
      },
    }

    expect(parseTsconfigAliases(mockConfig)).toEqual({
      "@": `${mockRoot}/base/src`,
      utils: `${mockRoot}/base/utils`,
    })
  })

  test("without baseUrl", () => {
    const mockConfig = { compilerOptions: { paths: { "@/*": ["./src/*"] } } }
    const result = parseTsconfigAliases(mockConfig)
    expect(result).toEqual({ "@": `${mockRoot}/src` })
  })

  test("multiple path mappings", () => {
    const mockConfig = {
      compilerOptions: {
        baseUrl: ".",
        paths: { "@/*": ["./src/*", "./lib/*", "./dist/*"] },
      },
    }
    expect(parseTsconfigAliases(mockConfig)).toEqual({ "@": `${mockRoot}/src` })
  })

  test("aliases without wildcards", () => {
    const mockConfig = {
      compilerOptions: {
        baseUrl: ".",
        paths: {
          "@": ["./src"],
          utils: ["./src/utils"],
        },
      },
    }

    expect(parseTsconfigAliases(mockConfig)).toEqual({
      "@": `${mockRoot}/src`,
      utils: `${mockRoot}/src/utils`,
    })
  })

  test("auto-detection fails", () => {
    vi.mocked(readFileSync).mockImplementation(() => {
      throw new Error("File not found")
    })

    expect(() => parseTsconfigAliases()).toThrow("File not found")
  })

  test("empty paths array", () => {
    const mockConfig = {
      compilerOptions: {
        baseUrl: ".",
        paths: {
          "@/*": [],
          "valid/*": ["./src/*"],
        },
      },
    }

    expect(parseTsconfigAliases(mockConfig)).toEqual({
      valid: `${mockRoot}/src`,
    })
  })

  test("complex path patterns", () => {
    const mockConfig = {
      compilerOptions: {
        baseUrl: "./project",
        paths: {
          "@components/*": ["./src/components/*"],
          "@utils/*": ["./src/utils/*"],
          "#config/*": ["./config/*"],
        },
      },
    }

    expect(parseTsconfigAliases(mockConfig)).toEqual({
      "@components": `${mockRoot}/project/src/components`,
      "@utils": `${mockRoot}/project/src/utils`,
      "#config": `${mockRoot}/project/config`,
    })
  })
})

describe("loadTsconfig", () => {
  test("from file path", () => {
    const mockConfig = { compilerOptions: { paths: {} } }
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify(mockConfig))

    expect(loadTsconfig("./tsconfig.json")).toEqual(mockConfig)
    expect(readFileSync).toHaveBeenCalledWith(
      expect.stringContaining("tsconfig.json"),
      "utf-8",
    )
  })

  test("from config object", () => {
    const mockConfig = { compilerOptions: { paths: {} } }
    expect(loadTsconfig(mockConfig)).toEqual(mockConfig)
  })

  test("auto-detects tsconfig", () => {
    const mockConfig = { compilerOptions: { paths: {} } }
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify(mockConfig))

    expect(loadTsconfig()).toEqual(mockConfig)
    expect(readFileSync).toHaveBeenCalledWith(
      expect.stringContaining("tsconfig.json"),
      "utf-8",
    )
  })
})

describe("parsePathMappings", () => {
  test("empty paths", () => {
    expect(parsePaths({ paths: {} })).toEqual({})
  })

  test("with baseUrl", () => {
    const compilerOptions = {
      baseUrl: "./base",
      paths: { "@/*": ["./src/*"] },
    }

    expect(parsePaths(compilerOptions)).toEqual({
      "@": `${mockRoot}/base/src`,
    })
  })

  test("undefined compilerOptions", () => {
    expect(parsePaths()).toEqual({})
  })
})
