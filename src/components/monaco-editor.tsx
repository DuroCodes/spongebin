"use client";

import { useEditor } from "./editor-provider";
import { THEME_MAP } from "~/utils/themes";
import { useEffect, useState } from "react";
import { Editor, type Monaco } from "@monaco-editor/react";
import { createHighlighter } from "shiki";
import { shikiToMonaco } from "@shikijs/monaco";
import { LANGUAGES } from "~/utils/languages";

export function MonacoEditor() {
  const { language, theme, content, setContent } = useEditor();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const colors = THEME_MAP[theme].ui;
    if (!colors) return;

    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }, [theme]);

  const handleEditorDidMount = async (monaco: Monaco) => {
    try {
      const currentTheme = THEME_MAP[theme].theme ?? theme;
      const restThemes = Object.entries(THEME_MAP)
        .filter(([key]) => key !== theme)
        .map(([key, value]) => value.theme ?? key);

      const highlighter = await createHighlighter({
        themes: [currentTheme, ...restThemes],
        langs: LANGUAGES,
      });

      shikiToMonaco(highlighter, monaco);

      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        tsx: "react",
      });

      // TODO: find a better way to do this
      setTimeout(() => setIsLoading(false), 100);
    } catch (error) {
      console.error("Failed to initialize editor:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-100vh">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-foreground">loading...</p>
          </div>
        </div>
      )}

      <Editor
        height="100vh"
        theme={theme}
        language={language}
        value={content}
        onChange={(val) => setContent(val || "")}
        onMount={(_, m) => {
          handleEditorDidMount(m).catch(console.error);
        }}
        options={{
          fontSize: 14,
          wordWrap: "off",
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
