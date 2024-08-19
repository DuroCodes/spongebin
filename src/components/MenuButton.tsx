import { useEffect, useRef, useState } from "preact/hooks";
import type { PreinitializedWritableAtom } from "nanostores";
import { $themeColorsStore } from "../utils/theme";
import { useStore } from "@nanostores/preact";

export interface MenuButtonProps {
  label: string;
  ids: string[];
  minWidth?: string;
  $store: PreinitializedWritableAtom<string>;
}

export default function MenuButton({
  label,
  ids,
  minWidth,
  $store,
}: MenuButtonProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const colors = useStore($themeColorsStore);

  useEffect(() => {
    const listener = () => setOpen(false);
    window.addEventListener("click", listener);
    return () => window.removeEventListener("click", listener);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  function toggleOpen(e: MouseEvent) {
    e.stopPropagation();
    setOpen(!open);
  }

  function select(e: MouseEvent | KeyboardEvent, id: string) {
    e.stopPropagation();
    setOpen(false);
    $store.set(id);
  }

  function handleInputClick(e: MouseEvent) {
    e.stopPropagation();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredIds.length > 0) {
        select(e, filteredIds[0]);
      }
    }
  }

  const filteredIds = ids.filter((id) =>
    id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div class="relative inline-block">
      <button
        class="rounded focus:outline-none"
        style={{ color: colors.primary }}
        onClick={toggleOpen}
      >
        <span class="hidden md:inline">
          [{label}: {$store.get()}]
        </span>
        <span class="hidden sm:inline md:hidden">[{$store.get()}]</span>
        <span class="sm:hidden">[{label}]</span>
      </button>
      {open && (
        <div
          class="absolute right-0 z-10 mt-4 rounded-xl max-h-60 overflow-auto w-full"
          style={{
            backgroundColor: colors.navbar,
            minWidth: minWidth ?? "13rem",
          }}
        >
          <input
            type="text"
            class="w-full px-4 py-2 border-b focus:outline-none"
            style={{
              backgroundColor: colors.navbar,
              borderColor: `${colors.primary}aa`,
              color: colors.primary,
            }}
            placeholder="type to search..."
            value={searchTerm}
            onInput={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
            onClick={handleInputClick}
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
          <ul>
            {filteredIds.length > 0 ? (
              filteredIds.map((id) => (
                <li
                  key={id}
                  class={`px-4 py-2 cursor-pointer ${id === $store.get() ? "font-bold" : ""}`}
                  style={{
                    backgroundColor:
                      id === $store.get()
                        ? `${colors.background}77`
                        : `${colors.navbar}`,
                  }}
                  onClick={(e) => select(e, id)}
                >
                  {id === $store.get() ? `*${id}` : id}
                </li>
              ))
            ) : (
              <li class="px-4 py-2" style={{ color: colors.primary }}>
                No results
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
