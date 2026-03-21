import { LANGUAGES_SET, type LanguageName } from "~/utils/languages";

export interface PasteTab {
  id: string;
  filename: string;
  language: LanguageName;
  content: string;
}

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

export const LANGUAGE_TO_EXTENSION: Record<LanguageName, string> =
  LANGUAGE_EXTENSIONS;

const EXTENSION_TO_LANGUAGE = Object.fromEntries(
  Object.entries(LANGUAGE_TO_EXTENSION).map(([language, extension]) => [
    extension,
    language,
  ]),
) as Record<string, LanguageName>;

const createTabId = () => crypto.randomUUID();

export const inferLanguage = (filename: string) => {
  const extension = filename.trim().split(".").pop()?.toLowerCase();
  if (!extension || extension === filename.trim().toLowerCase()) return null;

  return EXTENSION_TO_LANGUAGE[extension] ?? "text";
};

export const replaceFilenameExtension = (
  filename: string,
  language: LanguageName,
) => {
  const trimmedFilename = filename.trim();
  if (!trimmedFilename) return `file.${LANGUAGE_TO_EXTENSION[language]}`;

  const lastDotIndex = trimmedFilename.lastIndexOf(".");
  if (lastDotIndex <= 0) return trimmedFilename;

  return `${trimmedFilename.slice(0, lastDotIndex)}.${LANGUAGE_TO_EXTENSION[language]}`;
};

export const createEmptyTab = (
  index: number,
  language: LanguageName = "typescript",
) => ({
  id: createTabId(),
  filename: `file${index}.${LANGUAGE_TO_EXTENSION[language]}`,
  language,
  content: "",
});

export const normalizeTabs = (tabs: unknown) =>
  !Array.isArray(tabs)
    ? []
    : tabs.flatMap((tab, index) => {
        if (!tab || typeof tab !== "object") return [];

        const candidate = tab as Partial<PasteTab> & { language?: string };
        const fallbackTab = createEmptyTab(index + 1);

        const filename = candidate.filename?.trim() ?? fallbackTab.filename;
        const rawLanguage = candidate.language ?? "";
        const language: LanguageName =
          rawLanguage !== "" && LANGUAGES_SET.has(rawLanguage as LanguageName)
            ? (rawLanguage as LanguageName)
            : (inferLanguage(filename) ?? "text");

        return [
          {
            id: candidate.id ?? createTabId(),
            filename,
            language,
            content: candidate.content ?? "",
          },
        ];
      });
