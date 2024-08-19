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
        class="ml-4 w-full p-2 z-0 rounded absolute top-0 left-0 bg-transparent caret-transparent text-transparent resize-none"
        value={code}
        onInput={handleCodeChange}
        rows={10}
        spellCheck={false}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
      <div
        class="ml-4 shiki pointer-events-none"
        dangerouslySetInnerHTML={{ __html }}
        style={{
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
        }}
      />
    </div>
  );
}
