"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { addPaste } from "~/actions/paste";

interface SaveButtonProps {
  content: string;
  language: string;
  theme: string;
  className?: string;
}

export function SaveButton({
  content,
  language,
  theme,
  className,
}: SaveButtonProps) {
  const router = useRouter();

  const handleSave = async () => {
    try {
      if (!content) return;
      const result = await addPaste(content, language, theme);
      if (!result.id) return;

      const url = `${window.location.origin}/${result.id}`;
      await navigator.clipboard.writeText(url);
      router.push(`/${result.id}`);

      toast("saved and copied to clipboard");
    } catch (error) {
      console.error("Failed to save paste:", error);
      toast("failed to save paste");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "s" || !(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      handleSave();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [content, language, theme]);

  return (
    <Button variant="outline" onClick={handleSave} className={className}>
      save
    </Button>
  );
}
