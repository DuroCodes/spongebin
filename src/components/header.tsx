"use client";

import { useEditor } from "./editor-provider";
import { Button } from "~/components/ui/button";
import { THEME_MAP } from "~/utils/themes";
import { LANGUAGES } from "~/utils/languages";
import { SaveButton } from "./save-button";
import { SearchableSelect } from "./searchable-select";

export function Header() {
  const { language, theme, content, setLanguage, setTheme } = useEditor();

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-4 py-2">
      <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto">
        <Button
          variant="outline"
          onClick={() => (location.href = "/")}
          className="w-full sm:w-auto"
        >
          new
        </Button>
        <SaveButton
          content={content}
          language={language}
          theme={theme}
          className="w-full sm:w-auto"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:flex-row sm:w-auto">
        <SearchableSelect
          options={LANGUAGES.map((l) => ({ value: l, label: l }))}
          placeholder="language"
          value={language}
          onValueChange={setLanguage}
          onPreview={setLanguage}
          className="w-full sm:w-40"
        />
        <SearchableSelect
          options={Object.keys(THEME_MAP).map((t) => ({
            value: t,
            label: t,
          }))}
          placeholder="theme"
          value={theme}
          onValueChange={setTheme}
          onPreview={setTheme}
          className="w-full sm:w-52"
        />
      </div>
    </div>
  );
}
