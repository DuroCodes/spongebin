"use client";

import Link from "next/link";
import { useEditor } from "./editor-provider";
import { Button, buttonVariants } from "~/components/ui/button";
import { SearchableSelect } from "./searchable-select";
import { LANGUAGE_NAMES } from "~/utils/languages";
import { THEME_MAP } from "~/utils/themes";
import { SaveButton } from "./save-button";
import { Icons } from "./icons";
import { cn } from "~/utils/cn";

export function Header() {
  const { language, theme, content, setLanguage, setTheme } = useEditor();

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-4 py-2">
      <div className="grid grid-cols-5 gap-2 w-full sm:flex sm:w-auto">
        <Link
          className={cn(
            buttonVariants({ variant: "outline" }),
            "col-span-1 sm:w-auto p-2",
          )}
          href="https://github.com/durocodes/spongebin"
        >
          <Icons.GitHub className="h-4 w-4 mx-auto" />
        </Link>

        <Button
          variant="outline"
          onClick={() => (location.href = "/")}
          className="col-span-2 sm:w-auto"
        >
          new
        </Button>

        <SaveButton
          content={content}
          language={language}
          theme={theme}
          className="col-span-2 sm:w-auto"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:flex-row sm:w-auto">
        <SearchableSelect
          options={LANGUAGE_NAMES.map((l) => ({ value: l, label: l }))}
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
