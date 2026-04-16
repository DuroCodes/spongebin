// Keep in sync with `src/utils/paste-tabs.ts` (`LANGUAGE_EXTENSIONS` — invert language → ext to ext → language).
export const EXTENSION_TO_LANGUAGE = {
  txt: "text",
  abap: "abap",
  ada: "ada",
  apl: "apl",
  s: "asm",
  astro: "astro",
  bat: "bat",
  bib: "bibtex",
  "blade.php": "blade",
  c: "c",
  clj: "clojure",
  cob: "cobol",
  coffee: "coffeescript",
  lisp: "common-lisp",
  cpp: "c++",
  cr: "crystal",
  cs: "c#",
  css: "css",
  d: "d",
  dart: "dart",
  dax: "dax",
  diff: "diff",
  ex: "elixir",
  elm: "elm",
  erl: "erlang",
  fs: "f#",
  gleam: "gleam",
  go: "go",
  graphql: "graphql",
  groovy: "groovy",
  hack: "hack",
  hs: "haskell",
  hx: "haxe",
  html: "html",
  java: "java",
  js: "javascript",
  jinja: "jinja",
  json: "json",
  json5: "json5",
  jsx: "jsx",
  jl: "julia",
  kt: "kotlin",
  tex: "latex",
  log: "log",
  lua: "lua",
  md: "markdown",
  m: "matlab",
  mdx: "mdx",
  mmd: "mermaid",
  mojo: "mojo",
  nim: "nim",
  nix: "nix",
  ml: "ocaml",
  pas: "pascal",
  pl: "perl",
  php: "php",
  ps1: "powershell",
  prisma: "prisma",
  purs: "purescript",
  py: "python",
  r: "r",
  cshtml: "razor",
  rb: "ruby",
  rs: "rust",
  scala: "scala",
  scm: "scheme",
  scss: "scss",
  sh: "shellscript",
  sol: "solidity",
  sql: "sql",
  svelte: "svelte",
  swift: "swift",
  toml: "toml",
  tsx: "tsx",
  ts: "typescript",
  typ: "typst",
  v: "v",
  vb: "vb",
  vue: "vue",
  wat: "wasm",
  wl: "wolfram",
  xml: "xml",
  yml: "yaml",
  zig: "zig",
  sfm: "sfm",
} as const;

export type LanguageName =
  (typeof EXTENSION_TO_LANGUAGE)[keyof typeof EXTENSION_TO_LANGUAGE];

export const SPONGEBIN_LANGUAGE_IDS = new Set<string>(
  Object.values(EXTENSION_TO_LANGUAGE),
);

const COMPOUND_EXTENSION_KEYS = (
  Object.keys(EXTENSION_TO_LANGUAGE) as (keyof typeof EXTENSION_TO_LANGUAGE)[]
)
  .filter((k) => String(k).includes("."))
  .sort((a, b) => String(b).length - String(a).length);

/** Maps a file path to spongebin's `language` field (e.g. `.ts` → `typescript`). */
export const inferLanguageFromFilename = (filename: string): LanguageName => {
  const trimmed = filename.trim();
  if (!trimmed) return "text";
  const lower = trimmed.toLowerCase();

  for (const ext of COMPOUND_EXTENSION_KEYS) {
    const key = String(ext);
    if (lower.endsWith(`.${key}`)) return EXTENSION_TO_LANGUAGE[ext];
  }

  const extension = lower.split(".").pop();
  if (!extension || extension === lower) return "text";

  const lang =
    EXTENSION_TO_LANGUAGE[extension as keyof typeof EXTENSION_TO_LANGUAGE];
  return lang ?? "text";
};
