"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { addPaste } from "~/actions/paste-action";

interface SaveButtonProps {
  content: string;
  language: string;
  theme: string;
}

export function SaveButton({ content, language, theme }: SaveButtonProps) {
  const router = useRouter();

  const handleSave = async () => {
    try {
      if (!content) return;
      const result = await addPaste(content, language, theme);
      if (result && result.id) {
        const url = `${window.location.origin}/${result.id}`;
        await navigator.clipboard.writeText(url);

        router.push(`/${result.id}`);

        toast("saved and copied to clipboard");
      }
    } catch (error) {
      console.error("Failed to save paste:", error);
      toast("failed to save paste");
    }
  };

  return (
    <Button variant="outline" onClick={handleSave}>
      save
    </Button>
  );
}
