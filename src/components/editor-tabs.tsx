"use client";

import { Plus, X } from "lucide-react";
import { useEditor } from "~/components/editor-provider";
import { SearchableSelect } from "~/components/searchable-select";
import { cn } from "~/utils/cn";

const iconBtnClass =
  "border-input dark:bg-input/30 text-muted-foreground hover:text-foreground inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background shadow-xs transition-colors";

export function EditorTabs() {
  const {
    tabs,
    activeTab,
    activeTabId,
    setActiveTabId,
    updateActiveTabFilename,
    addTab,
    closeTab,
  } = useEditor();
  const hasMultipleTabs = tabs.length > 1;

  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:hidden">
        {hasMultipleTabs ? (
          <SearchableSelect
            options={tabs.map((tab) => ({
              value: tab.id,
              label: tab.filename,
            }))}
            placeholder="files"
            value={activeTabId}
            onValueChange={setActiveTabId}
            onPreview={setActiveTabId}
            className="min-w-0 flex-1"
          />
        ) : (
          <span className="text-muted-foreground block min-w-0 flex-1 truncate px-2 text-sm font-medium">
            {activeTab.filename}
          </span>
        )}

        {hasMultipleTabs && (
          <button
            type="button"
            onClick={() => closeTab(activeTabId)}
            className={iconBtnClass}
            aria-label={`Close ${activeTab.filename}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          onClick={addTab}
          className={iconBtnClass}
          aria-label="Add tab"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="hidden min-w-0 flex-1 overflow-x-auto sm:block">
        <div className="flex min-w-max items-center gap-2">
          {hasMultipleTabs &&
            tabs.map((tab) => {
              const isActive = tab.id === activeTabId;

              return (
                <div
                  key={tab.id}
                  className={cn(
                    "border-input dark:bg-input/30 bg-background text-foreground flex h-9 items-center gap-1 rounded-md border pr-0.5 text-sm shadow-xs transition-colors",
                    isActive &&
                      "bg-primary text-primary-foreground border-transparent",
                  )}
                >
                  {isActive ? (
                    <input
                      value={activeTab.filename}
                      onChange={(event) =>
                        updateActiveTabFilename(event.target.value)
                      }
                      onClick={(event) => event.stopPropagation()}
                      className="placeholder:text-primary-foreground/70 bg-transparent px-3 text-sm font-medium outline-none"
                      style={{
                        width: `${Math.min(
                          24,
                          Math.max(10, activeTab.filename.length + 3),
                        )}ch`,
                      }}
                      placeholder="file.ts"
                      aria-label="Filename"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveTabId(tab.id)}
                      className="h-full px-3 text-sm font-medium"
                    >
                      <span className="text-muted-foreground block max-w-40 truncate">
                        {tab.filename}
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      closeTab(tab.id);
                    }}
                    className={cn(
                      "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                      isActive
                        ? "text-primary-foreground/80 hover:text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    aria-label={`Close ${tab.filename}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}

          <button
            type="button"
            onClick={addTab}
            className={iconBtnClass}
            aria-label="Add tab"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
