import { type LanguageName } from "./languages";

export const LANGUAGE_EXTENSIONS = {
  text: "txt",
  abap: "abap",
  ada: "ada",
  apl: "apl",
  asm: "s",
  astro: "astro",
  bat: "bat",
  bibtex: "bib",
  blade: "blade.php",
  c: "c",
  clojure: "clj",
  cobol: "cob",
  coffeescript: "coffee",
  "common-lisp": "lisp",
  "c++": "cpp",
  crystal: "cr",
  "c#": "cs",
  css: "css",
  d: "d",
  dart: "dart",
  dax: "dax",
  diff: "diff",
  elixir: "ex",
  elm: "elm",
  erlang: "erl",
  "f#": "fs",
  gleam: "gleam",
  go: "go",
  graphql: "graphql",
  groovy: "groovy",
  hack: "hack",
  haskell: "hs",
  haxe: "hx",
  html: "html",
  java: "java",
  javascript: "js",
  jinja: "jinja",
  json: "json",
  json5: "json5",
  jsx: "jsx",
  julia: "jl",
  kotlin: "kt",
  latex: "tex",
  log: "log",
  lua: "lua",
  markdown: "md",
  matlab: "m",
  mdx: "mdx",
  mermaid: "mmd",
  mojo: "mojo",
  nim: "nim",
  nix: "nix",
  ocaml: "ml",
  pascal: "pas",
  perl: "pl",
  php: "php",
  powershell: "ps1",
  prisma: "prisma",
  purescript: "purs",
  python: "py",
  r: "r",
  razor: "cshtml",
  ruby: "rb",
  rust: "rs",
  scala: "scala",
  scheme: "scm",
  scss: "scss",
  shellscript: "sh",
  solidity: "sol",
  sql: "sql",
  svelte: "svelte",
  swift: "swift",
  toml: "toml",
  tsx: "tsx",
  typescript: "ts",
  typst: "typ",
  v: "v",
  vb: "vb",
  vue: "vue",
  wasm: "wat",
  wolfram: "wl",
  xml: "xml",
  yaml: "yml",
  zig: "zig",
  sfm: "sfm",
} as const satisfies Record<LanguageName, string>;

const EXTENSION_LANGUAGES = Object.fromEntries(
  Object.entries(LANGUAGE_EXTENSIONS).map(([language, extension]) => [
    extension,
    language,
  ]),
) as Record<string, LanguageName>;

const COMPOUND_EXTENSIONS = (
  Object.entries(LANGUAGE_EXTENSIONS) as [LanguageName, string][]
)
  .filter(([, ext]) => ext.includes("."))
  .sort((a, b) => b[1].length - a[1].length);

/** Maps a filename to a spongebin language, or `null` when there is no extension. */
export const inferLanguage = (filename: string): LanguageName | null => {
  const trimmed = filename.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();

  for (const [language, ext] of COMPOUND_EXTENSIONS) {
    if (lower.endsWith(`.${ext}`)) return language;
  }

  const extension = lower.split(".").pop();
  if (!extension || extension === lower) return null;

  return EXTENSION_LANGUAGES[extension] ?? "text";
};

export const replaceFilenameExtension = (
  filename: string,
  language: LanguageName,
) => {
  const trimmedFilename = filename.trim();
  if (!trimmedFilename) return `file.${LANGUAGE_EXTENSIONS[language]}`;

  const newExt = LANGUAGE_EXTENSIONS[language];
  const lower = trimmedFilename.toLowerCase();

  for (const [, ext] of COMPOUND_EXTENSIONS) {
    if (lower.endsWith(`.${ext}`)) {
      const cut = trimmedFilename.length - (ext.length + 1);
      return `${trimmedFilename.slice(0, cut)}.${newExt}`;
    }
  }

  const lastDotIndex = trimmedFilename.lastIndexOf(".");
  if (lastDotIndex <= 0) return trimmedFilename;

  return `${trimmedFilename.slice(0, lastDotIndex)}.${newExt}`;
};
