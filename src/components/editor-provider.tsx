"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface EditorContextType {
  content: string;
  setContent: (content: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

interface EditorProviderProps {
  children: ReactNode;
  initialContent?: string;
  initialLanguage?: string;
  initialTheme?: string;
}

export function EditorProvider({
  children,
  initialContent = "",
  initialLanguage = "typescript",
  initialTheme = "catppuccin-mocha",
}: EditorProviderProps) {
  const [content, setContent] = useState<string>(initialContent);
  const [language, setLanguage] = useState<string>(initialLanguage);
  const [theme, setTheme] = useState<string>(initialTheme);

  const value = {
    content,
    setContent,
    language,
    setLanguage,
    theme,
    setTheme,
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined)
    throw new Error("useEditor must be used within an EditorProvider");

  return context;
}
