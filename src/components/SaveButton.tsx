import { useStore } from "@nanostores/preact";
import { useEffect, useState } from "preact/hooks";
import { unwrapOr } from "../utils/result";
import { encode } from "../utils/encode";
import { $codeStore, $langStore, $themeStore } from "../utils/theme";

export default function SaveButton() {
  const code = useStore($codeStore);
  const [saving, setSaving] = useState(false);
  const [buttonText, setButtonText] = useState("[save]");

  const save = async () => {
    setSaving(true);

    console.log({ code });

    const result = await unwrapOr(encode(code), "");
    const url = `${window.location.origin}/?l=${$langStore.get()}&t=${$themeStore.get()}&c=${result}`;

    navigator.clipboard.writeText(url);

    setButtonText("[link copied!]");

    setTimeout(() => {
      setButtonText("[save]");
      setSaving(false);
    }, 5000);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        save();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [code, saving]);

  return (
    <button class="rounded focus:outline-none" disabled={saving} onClick={save}>
      {buttonText}
    </button>
  );
}
