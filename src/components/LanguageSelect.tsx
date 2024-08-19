import { bundledLanguages } from "shiki";
import MenuButton from "./MenuButton";
import { $langStore } from "../utils/theme";

export default function LanguageSelect() {
  return (
    <MenuButton
      label="language"
      ids={Object.keys(bundledLanguages)}
      $store={$langStore}
    />
  );
}
