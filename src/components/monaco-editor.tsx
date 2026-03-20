"use client";

import {
  AutoTypings,
  LocalStorageCache,
} from "monaco-editor-auto-typings/custom-editor";
import { useEffect, useRef, useState } from "react";
import { Editor, type Monaco } from "@monaco-editor/react";
import { shikiToMonaco } from "@shikijs/monaco";
import { createHighlighter } from "shiki";
import { LANGUAGES, MONACO_LANGUAGES } from "~/utils/languages";
import { useEditor } from "./editor-provider";
import { THEME_MAP } from "~/utils/themes";

export function MonacoEditor() {
  const {
    activeTab,
    activeTabId,
    closeTab,
    theme,
    wordWrap,
    updateActiveTabContent,
  } = useEditor();
  const [isLoading, setIsLoading] = useState(true);
  const activeTabIdRef = useRef(activeTabId);
  activeTabIdRef.current = activeTabId;
  const closeTabRef = useRef(closeTab);
  closeTabRef.current = closeTab;

  useEffect(() => {
    const colors = THEME_MAP[theme]?.ui;
    if (!colors) return;

    for (const [key, value] of Object.entries(colors)) {
      document.documentElement.style.setProperty(`--${key}`, value);
    }
  }, [theme]);

  const handleEditorDidMount = async (monaco: Monaco) => {
    try {
      const currentTheme = THEME_MAP[theme].theme ?? theme;
      const restThemes = Object.entries(THEME_MAP)
        .filter(([key]) => key !== theme)
        .map(([key, value]) => value.theme ?? key);

      LANGUAGES.forEach((l) => monaco.languages.register({ id: l }));

      const highlighter = await createHighlighter({
        themes: [currentTheme, ...restThemes],
        langs: [...MONACO_LANGUAGES],
      });

      shikiToMonaco(highlighter, monaco);

      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        enableSchemaRequest: true,
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Failed to initialize editor:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-full min-h-0 w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-foreground">loading...</p>
          </div>
        </div>
      )}

      <Editor
        path={`${activeTab.id}/${activeTab.filename}`}
        saveViewState
        className="h-full"
        theme={theme}
        language={activeTab.language}
        value={activeTab.content}
        onChange={(val) => updateActiveTabContent(val || "")}
        onMount={async (editor, monaco) => {
          try {
            await handleEditorDidMount(monaco);
            if (!editor.getModel()) return;

            await AutoTypings.create(editor, {
              sourceCache: new LocalStorageCache(),
              monaco,
            });
          } catch (error) {
            console.warn("AutoTypings init failed (ignored):", error);
          }
        }}
        options={{
          fontSize: 14,
          wordWrap: wordWrap ? "on" : "off",
          minimap: { enabled: false },
          automaticLayout: true,
          bracketPairColorization: {
            enabled: true,
          },
          formatOnPaste: true,
          formatOnType: true,
          fontFamily: "var(--font-jetbrains-mono)",
        }}
      />
    </div>
  );
}
