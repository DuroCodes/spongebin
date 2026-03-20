"use client";

import { WrapText } from "lucide-react";
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

function LanguageThemeControls() {
  const { activeTab, theme, updateActiveTabLanguage, setTheme } = useEditor();

  const setLanguage = (language: string) => {
    if (LANGUAGES_SET.has(language)) updateActiveTabLanguage(language);
  };

  return (
    <>
      <SearchableSelect
        options={LANGUAGES.map((language) => ({
          value: language,
          label: language,
        }))}
        placeholder="language"
        value={activeTab.language}
        onValueChange={setLanguage}
        onPreview={setLanguage}
        className="w-full min-w-0 sm:w-40"
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
        className="w-full min-w-0 sm:w-52"
      />
    </>
  );
}

export function Header() {
  const { tabs, theme, wordWrap, setWordWrap } = useEditor();

  return (
    <>
      <header className="border-border/70 bg-background shrink-0 border-b">
        <div className="flex flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center sm:py-3">
          <div className="grid w-full grid-cols-6 gap-2 sm:flex sm:w-auto sm:shrink-0">
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
              type="button"
              variant="outline"
              onClick={() => setWordWrap(!wordWrap)}
              className={cn(
                "col-span-1 p-2 sm:w-auto",
                wordWrap &&
                  "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
              )}
              aria-pressed={wordWrap}
              aria-label={wordWrap ? "Disable word wrap" : "Enable word wrap"}
              title="Word wrap"
            >
              <WrapText className="mx-auto h-4 w-4" />
            </Button>

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

          <div className="w-full min-w-0 sm:flex-1">
            <EditorTabs />
          </div>

          <div className="hidden sm:ml-2 sm:flex sm:w-auto sm:shrink-0 sm:gap-2">
            <LanguageThemeControls />
          </div>
        </div>
      </header>

      <div
        className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 gap-2 border-t border-border/70 bg-background/95 px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:hidden"
        role="region"
        aria-label="Language and theme"
      >
        <LanguageThemeControls />
      </div>
    </>
  );
}
