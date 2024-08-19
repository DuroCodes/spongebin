import { atom, computed, task } from "nanostores";
import {
  bundledLanguages,
  type BundledLanguage,
  type BundledTheme,
  createHighlighter,
  bundledThemes,
} from "shiki";

export const highlighter = await createHighlighter({
  themes: Object.keys(bundledThemes),
  langs: Object.keys(bundledLanguages),
});

export const $langStore = atom<BundledLanguage | "txt">("txt");
export const $codeStore = atom<string>("");
export const $themeStore = atom<BundledTheme>("github-dark-default");
export const $themeColorsStore = computed($themeStore, (theme) =>
  themeColors(theme),
);

export const parseLang = (lang: string | null = "txt") =>
  Object.keys(bundledLanguages).includes(lang ?? "txt")
    ? (lang as BundledLanguage)
    : "txt";

const navbarColor = (backgroundColor: string): string => {
  const expandHex = (hex: string) =>
    hex.length === 4 ? `#${[...hex.slice(1)].map((c) => c + c).join("")}` : hex;

  const isLight = (hex: string) => parseInt(hex.slice(1), 16) > 0xffffff / 2;

  const adjustColor = (hex: string, amt: number) => {
    const hexCode = (parseInt(hex.slice(1), 16) + amt * 0x010101)
      .toString(16)
      .padStart(6, "0");

    return `#${hexCode}`;
  };

  const expandedColor = expandHex(backgroundColor);
  return adjustColor(expandedColor, isLight(expandedColor) ? -10 : 10);
};

export const themeColors = (theme: BundledTheme) => {
  const shikiTheme = highlighter.getTheme(theme);

  return {
    background: shikiTheme.bg,
    primary: shikiTheme.fg,
    navbar: navbarColor(shikiTheme.bg),
  };
};
