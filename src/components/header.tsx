"use client";

import { useEditor } from "./editor-provider";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { THEME_MAP } from "~/utils/themes";
import { LANGUAGES } from "~/utils/languages";
import { SaveButton } from "./save-button";
import { SearchableSelect } from "./searchable-select";

export function Header() {
  const { language, theme, content, setLanguage, setTheme } = useEditor();

  return (
    <div className="flex justify-between items-center px-4 py-2">
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => (location.href = "/")}>
          new
        </Button>
        <SaveButton content={content} language={language} theme={theme} />
      </div>
      <div className="flex gap-2">
        <SearchableSelect
          options={LANGUAGES.map((l) => ({ value: l, label: l }))}
          placeholder="language"
          value={language}
          onValueChange={setLanguage}
          className="w-40"
        />
        <SearchableSelect
          options={Object.keys(THEME_MAP).map((t) => ({
            value: t,
            label: t,
          }))}
          placeholder="theme"
          value={theme}
          onValueChange={setTheme}
          className="w-53"
        />
      </div>
    </div>
  );
}
