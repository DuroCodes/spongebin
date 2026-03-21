"use client";

import { Plus, X } from "lucide-react";
import { useEditor } from "~/components/editor-provider";
import { SearchableSelect } from "~/components/searchable-select";
import { Button } from "~/components/ui/button";
import { cn } from "~/utils/cn";

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

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="relative z-10 shrink-0"
          onClick={addTab}
          aria-label="Add tab"
        >
          <Plus />
        </Button>

        {hasMultipleTabs && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => closeTab(activeTabId)}
            aria-label={`Close ${activeTab.filename}`}
          >
            <X />
          </Button>
        )}
      </div>

      <div className="scrollbar-none hidden min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-hidden sm:block">
        <div className="inline-flex min-w-max items-center gap-2">
          {hasMultipleTabs &&
            tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              const nameForWidth = isActive ? activeTab.filename : tab.filename;
              const labelWidthCh = Math.min(
                24,
                Math.max(10, nameForWidth.length + 3),
              );
              const labelWidthStyle = {
                width: `${labelWidthCh}ch`,
                minWidth: `${labelWidthCh}ch`,
              } as const;

              return (
                <div
                  key={tab.id}
                  className={cn(
                    "border-input dark:bg-input/30 bg-background text-foreground box-border inline-flex h-9 shrink-0 items-center gap-1 rounded-md border pr-0.5 text-sm transition-colors",
                    isActive &&
                      "border-primary bg-primary text-primary-foreground",
                  )}
                >
                  {isActive ? (
                    <input
                      value={activeTab.filename}
                      spellCheck={false}
                      onChange={(event) =>
                        updateActiveTabFilename(event.target.value)
                      }
                      onClick={(event) => event.stopPropagation()}
                      className="placeholder:text-primary-foreground/70 min-w-0 bg-transparent px-3 py-0 text-sm font-medium leading-none outline-none focus-visible:ring-0"
                      style={labelWidthStyle}
                      placeholder="file.ts"
                      aria-label="Filename"
                    />
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      className={cn(
                        "text-foreground h-full min-h-0 min-w-0 justify-start rounded-none px-3 py-0 text-left text-sm font-medium leading-none shadow-none",
                        "hover:bg-transparent hover:text-foreground",
                        "focus-visible:ring-0 focus-visible:ring-offset-0",
                      )}
                      style={labelWidthStyle}
                      onClick={() => setActiveTabId(tab.id)}
                    >
                      <span className="block min-w-0 truncate">
                        {tab.filename}
                      </span>
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 min-h-8 min-w-8 shrink-0 transition-colors hover:bg-transparent dark:hover:bg-transparent",
                      isActive
                        ? "text-primary-foreground hover:text-primary-foreground/90"
                        : "text-muted-foreground hover:text-primary",
                    )}
                    onClick={(event) => {
                      event.stopPropagation();
                      closeTab(tab.id);
                    }}
                    aria-label={`Close ${tab.filename}`}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              );
            })}

          <div className="bg-background sticky right-0 z-10 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="bg-background"
              onClick={addTab}
              aria-label="Add tab"
            >
              <Plus />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
