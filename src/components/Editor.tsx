import LanguageSelect from "./LanguageSelect";
import SaveButton from "./SaveButton";
import { $themeColorsStore } from "../utils/theme";
import ThemeSelect from "./ThemeSelect";
import { useStore } from "@nanostores/preact";
import CodeBlock from "./CodeBlock";

export default function Editor() {
  const colors = useStore($themeColorsStore);

  return (
    <div style={{ backgroundColor: colors.background }} class="h-screen">
      <div
        class="mb-4 p-2 text-sm md:text-base"
        style={{ backgroundColor: colors.navbar }}
      >
        <nav
          class="flex justify-between mx-4"
          style={{ color: colors.primary }}
        >
          <div class="flex justify-between">
            <SaveButton />
          </div>
          <div class="flex gap-2">
            <LanguageSelect />
            <ThemeSelect />
            <a href="https://github.com/durocodes/spongebin">[source]</a>
          </div>
        </nav>
      </div>
      <CodeBlock />
    </div>
  );
}
