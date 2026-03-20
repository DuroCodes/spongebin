"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type LanguageName } from "~/utils/languages";
import {
  createEmptyTab,
  inferLanguage,
  LANGUAGE_TO_EXTENSION,
  replaceFilenameExtension,
  type PasteTab,
} from "~/utils/paste-tabs";

interface EditorContextType {
  tabs: PasteTab[];
  activeTab: PasteTab;
  activeTabId: string;
  setActiveTabId: (tabId: string) => void;
  updateActiveTabContent: (content: string) => void;
  updateActiveTabLanguage: (language: LanguageName) => void;
  updateActiveTabFilename: (filename: string) => void;
  addTab: () => void;
  closeTab: (tabId: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

interface EditorProviderProps {
  children: ReactNode;
  initialTabs?: PasteTab[];
  initialActiveTabId?: string | null;
  initialTheme?: string;
}

export function EditorProvider({
  children,
  initialTabs,
  initialActiveTabId,
  initialTheme = "catppuccin-mocha",
}: EditorProviderProps) {
  const [tabs, setTabs] = useState(() =>
    initialTabs?.length ? initialTabs : [createEmptyTab(1)],
  );
  const [activeTabId, setActiveTabId] = useState(
    initialActiveTabId ?? initialTabs?.[0]?.id ?? "",
  );
  const [theme, setTheme] = useState(initialTheme);

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0]!;

  useEffect(() => {
    if (!tabs.some((tab) => tab.id === activeTabId)) {
      setActiveTabId(tabs[0]!.id);
    }
  }, [activeTabId, tabs]);

  const updateTab = (tabId: string, updater: (tab: PasteTab) => PasteTab) => {
    setTabs((currentTabs) =>
      currentTabs.map((tab) => (tab.id === tabId ? updater(tab) : tab)),
    );
  };

  const updateActiveTabContent = (content: string) => {
    updateTab(activeTab.id, (tab) => ({ ...tab, content }));
  };

  const updateActiveTabLanguage = (language: LanguageName) => {
    updateTab(activeTab.id, (tab) => {
      const currentExtension = tab.filename.split(".").pop()?.toLowerCase();
      const currentLanguageExtension = LANGUAGE_TO_EXTENSION[tab.language];

      return {
        ...tab,
        language,
        filename:
          currentExtension === currentLanguageExtension
            ? replaceFilenameExtension(tab.filename, language)
            : tab.filename,
      };
    });
  };

  const updateActiveTabFilename = (filename: string) => {
    updateTab(activeTab.id, (tab) => ({
      ...tab,
      filename,
      language: inferLanguage(filename) ?? tab.language,
    }));
  };

  const addTab = () => {
    const nextTab = createEmptyTab(tabs.length + 1, activeTab.language);
    setTabs((currentTabs) => [...currentTabs, nextTab]);
    setActiveTabId(nextTab.id);
  };

  const closeTab = (tabId: string) => {
    setTabs((currentTabs) => {
      if (currentTabs.length === 1) return currentTabs;

      const tabIndex = currentTabs.findIndex((tab) => tab.id === tabId);
      const nextTabs = currentTabs.filter((tab) => tab.id !== tabId);

      if (tabId === activeTabId) {
        const nextActiveTab =
          nextTabs[Math.max(0, tabIndex - 1)] ?? nextTabs[0];

        if (nextActiveTab) setActiveTabId(nextActiveTab.id);
      }

      return nextTabs;
    });
  };

  return (
    <EditorContext.Provider
      value={{
        tabs,
        activeTab,
        activeTabId,
        setActiveTabId,
        updateActiveTabContent,
        updateActiveTabLanguage,
        updateActiveTabFilename,
        addTab,
        closeTab,
        theme,
        setTheme,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined)
    throw new Error("useEditor must be used within an EditorProvider");

  return context;
}
