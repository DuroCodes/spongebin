import { inferLanguage } from "./extensions";
import { LANGUAGES_SET, type LanguageName } from "./languages";

export const DEFAULT_BASE_URL = "https://spongebin.dev";
export const DEFAULT_LANGUAGE = "text";
export const DEFAULT_THEME = "catppuccin-mocha";

export type CreatePasteSuccess = {
  success: true;
  id: string;
  url: string;
};

export type CreatePasteError = {
  error: string;
};

export type CreatePasteResponse = CreatePasteSuccess | CreatePasteError;

/** editor language ids that don't match spongebin language names 1:1. */
export const EDITOR_LANGUAGE_ID_MAP: Record<string, LanguageName> = {
  typescriptreact: "tsx",
  javascriptreact: "jsx",
  csharp: "c#",
  cpp: "c++",
  fsharp: "f#",
};

export const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, "");

const basename = (filePath: string) => {
  const normalized = filePath.replace(/\\/g, "/");
  const parts = normalized.split("/");
  return parts[parts.length - 1] || filePath;
};

export const resolvePasteLanguage = ({
  language,
  filename,
  editorLanguageId,
  defaultLanguage = DEFAULT_LANGUAGE,
}: {
  language?: string | null;
  filename?: string | null;
  editorLanguageId?: string | null;
  defaultLanguage?: string;
}): string => {
  if (language && LANGUAGES_SET.has(language as LanguageName)) return language;

  if (filename) {
    const fromName = inferLanguage(basename(filename));
    if (fromName && fromName !== "text") return fromName;
  }

  if (editorLanguageId) {
    const mapped = EDITOR_LANGUAGE_ID_MAP[editorLanguageId];
    if (mapped) return mapped;
    if (LANGUAGES_SET.has(editorLanguageId)) return editorLanguageId as LanguageName;
  }

  if (filename) {
    const fromName = inferLanguage(basename(filename));
    if (fromName) return fromName;
  }

  return defaultLanguage;
};

export const createPaste = async ({
  content,
  language,
  theme = DEFAULT_THEME,
  baseUrl = DEFAULT_BASE_URL,
}: {
  content: string;
  language: string;
  theme?: string;
  baseUrl?: string;
}): Promise<CreatePasteSuccess> => {
  const url = `${normalizeBaseUrl(baseUrl)}/api/paste`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ content, language, theme }),
  });

  let data: CreatePasteResponse;
  try {
    data = (await res.json()) as CreatePasteResponse;
  } catch {
    throw new Error(`Request failed (${res.status})`);
  }

  if (!res.ok) {
    const msg = "error" in data ? data.error : `Request failed (${res.status})`;
    throw new Error(msg);
  }
  if (!("success" in data) || !data.success)
    throw new Error("Unexpected response");

  return data;
};
