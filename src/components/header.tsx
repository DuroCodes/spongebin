"use client";

import Link from "next/link";
import { useEditor } from "./editor-provider";
import { EditorTabs } from "./editor-tabs";
import { Button, buttonVariants } from "~/components/ui/button";
import { SearchableSelect } from "./searchable-select";
import { LANGUAGES, LANGUAGES_SET } from "~/utils/languages";
import { THEME_MAP } from "~/utils/themes";
import { SaveButton } from "./save-button";
import { Icons } from "./icons";
import { cn } from "~/utils/cn";

export function Header() {
  const { tabs, activeTab, theme, updateActiveTabLanguage, setTheme } =
    useEditor();

  const setLanguage = (language: string) => {
    if (LANGUAGES_SET.has(language)) updateActiveTabLanguage(language);
  };

  return (
    <header className="border-border/70 bg-background shrink-0 border-b">
      <div className="flex flex-col gap-2 px-4 py-3 xl:flex-row xl:items-center">
        <div className="grid w-full grid-cols-5 gap-2 sm:flex sm:w-auto xl:shrink-0">
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "col-span-1 p-2 sm:w-auto",
            )}
            href="https://github.com/durocodes/spongebin"
          >
            <Icons.GitHub className="mx-auto h-4 w-4" />
          </Link>

          <Button
            variant="outline"
            onClick={() => (location.href = "/")}
            className="col-span-2 sm:w-auto"
          >
            new
          </Button>

          <SaveButton
            tabs={tabs}
            theme={theme}
            className="col-span-2 sm:w-auto"
          />
        </div>

        <div className="w-full xl:min-w-0 xl:flex-1">
          <EditorTabs />
        </div>

        <div className="grid w-full grid-cols-2 gap-2 xl:ml-2 xl:flex xl:w-auto xl:shrink-0">
          <SearchableSelect
            options={LANGUAGES.map((language) => ({
              value: language,
              label: language,
            }))}
            placeholder="language"
            value={activeTab.language}
            onValueChange={setLanguage}
            onPreview={setLanguage}
            className="w-full xl:w-40"
          />

          <SearchableSelect
            options={Object.keys(THEME_MAP).map((currentTheme) => ({
              value: currentTheme,
              label: currentTheme,
            }))}
            placeholder="theme"
            value={theme}
            onValueChange={setTheme}
            onPreview={setTheme}
            className="w-full xl:w-52"
          />
        </div>
      </div>
    </header>
  );
}
