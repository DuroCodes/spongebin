import { useStore } from "@nanostores/preact";
import {
  $codeStore,
  $langStore,
  $themeStore,
  highlighter,
} from "../utils/theme";

export default function CodeBlock() {
  const lang = useStore($langStore);
  const theme = useStore($themeStore);
  const code = useStore($codeStore);

  const handleCodeChange = (event: Event) => {
    const newCode = (event.target as HTMLTextAreaElement).value;
    $codeStore.set(newCode);
  };

  const __html = highlighter.codeToHtml($codeStore.get(), {
    lang,
    theme,
  });

  return (
    <div class="relative">
      <textarea
        class="ml-[3.25rem] w-[calc(100%-3.5rem)] z-0 rounded absolute top-0 left-0 bg-transparent text-transparent resize-none break-normal overflow-x-scroll"
        value={code}
        onInput={handleCodeChange}
        rows={$codeStore.get().split("\n").length}
        spellCheck={false}
      />
      <div
        class="ml-4 overflow-x-hidden shiki pointer-events-none"
        dangerouslySetInnerHTML={{ __html }}
      />
    </div>
  );
}
