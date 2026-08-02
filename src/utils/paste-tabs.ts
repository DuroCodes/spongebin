import {
  LANGUAGE_EXTENSIONS,
  LANGUAGES_SET,
  inferLanguage,
  type LanguageName,
} from "@spongebin/shared";

export {
  LANGUAGE_EXTENSIONS,
  inferLanguage,
  replaceFilenameExtension,
} from "@spongebin/shared";

export interface PasteTab {
  id: string;
  filename: string;
  language: LanguageName;
  content: string;
}

const createTabId = () => crypto.randomUUID();

export const createEmptyTab = (
  index: number,
  language: LanguageName = "typescript",
) => ({
  id: createTabId(),
  filename: `file${index}.${LANGUAGE_EXTENSIONS[language]}`,
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
          rawLanguage !== "" && LANGUAGES_SET.has(rawLanguage)
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
