import { bundledThemes } from "shiki";
import MenuButton from "./MenuButton";
import { $themeStore } from "../utils/theme";

export default function ThemeSelect() {
  return (
    <MenuButton
      label="theme"
      ids={Object.keys(bundledThemes)}
      $store={$themeStore}
    />
  );
}
