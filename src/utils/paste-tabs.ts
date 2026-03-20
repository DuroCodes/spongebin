import { LANGUAGES, LANGUAGES_SET, type LanguageName } from "~/utils/languages";

export interface PasteTab {
  id: string;
  filename: string;
  language: LanguageName;
  content: string;
}

export const LANGUAGE_EXTENSIONS: Record<LanguageName, string> = {
  text: "txt",
  asm: "s",
  bat: "bat",
  c: "c",
  "c#": "cs",
  "c++": "cpp",
  coffeescript: "coffee",
  "common-lisp": "lisp",
  css: "css",
  dax: "dax",
  diff: "diff",
  "f#": "fs",
  graphql: "graphql",
  html: "html",
  javascript: "js",
  json: "json",
  json5: "json5",
  jsx: "jsx",
  latex: "tex",
  log: "log",
  markdown: "md",
  mdx: "mdx",
  mermaid: "mmd",
  powershell: "ps1",
  python: "py",
  r: "r",
  razor: "cshtml",
  ruby: "rb",
  rust: "rs",
  scheme: "scm",
  scss: "scss",
  shellscript: "sh",
  solidity: "sol",
  sql: "sql",
  toml: "toml",
  tsx: "tsx",
  typescript: "ts",
  vb: "vb",
  vue: "vue",
  wasm: "wat",
  wolfram: "wl",
  xml: "xml",
  yaml: "yml",
  sfm: "sfm",
};

const toSafeExtension = (language: LanguageName) =>
  language.toLowerCase().replace(/[^a-z0-9]+/g, "");

export const LANGUAGE_TO_EXTENSION = Object.fromEntries(
  LANGUAGES.map((language) => [
    language,
    LANGUAGE_EXTENSIONS[language] ?? toSafeExtension(language),
  ]),
) as Record<LanguageName, string>;

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

  return EXTENSION_TO_LANGUAGE[extension] ?? null;
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
        const language = LANGUAGES_SET.has(candidate.language ?? "")
          ? (candidate.language ?? "")
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
