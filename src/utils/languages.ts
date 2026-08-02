import sfm from "./languages/sfm.json";
import {
  BUILTIN_LANGUAGE_NAMES,
  LANGUAGES,
  LANGUAGES_SET,
  type LanguageName,
} from "@spongebin/shared";

export { LANGUAGES, LANGUAGES_SET, type LanguageName };

export const MONACO_LANGUAGES = [...BUILTIN_LANGUAGE_NAMES, sfm] as const;
