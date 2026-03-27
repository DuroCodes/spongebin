"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { addPaste } from "~/actions/paste";
import type { PasteTab } from "~/utils/paste-tabs";

interface SaveButtonProps {
  tabs: PasteTab[];
  theme: string;
  className?: string;
}

export function SaveButton({ tabs, theme, className }: SaveButtonProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);

  const handleSave = useCallback(async () => {
    if (isSavingRef.current) return;

    try {
      if (!tabs.some((tab) => tab.content.trim())) return;

      isSavingRef.current = true;
      setIsSaving(true);
      const result = await addPaste({ tabs, theme });
      if (!result.id) return;

      const url = `${window.location.origin}/${result.id}`;
      await navigator.clipboard.writeText(url);
      router.push(`/${result.id}`);

      toast("saved and copied to clipboard");
    } catch (error) {
      console.error("Failed to save paste:", error);
      toast("failed to save paste");
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  }, [tabs, theme, router]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "s" || !(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      void handleSave();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSave]);

  return (
    <Button
      variant="outline"
      onClick={handleSave}
      disabled={isSaving}
      className={className}
    >
      {isSaving ? <Loader2 className="animate-spin" /> : null}
      {isSaving ? "saving..." : "save"}
    </Button>
  );
}
