"use server";

import { eq } from "drizzle-orm";
import { db } from "~/db/drizzle";
import { paste } from "~/db/schema";
import type { PasteTab } from "~/utils/paste-tabs";

export const getPasteById = async (id: string) => {
  const pasteData = await db
    .select()
    .from(paste)
    .where(eq(paste.id, id))
    .limit(1);

  return pasteData[0];
};

export const addPaste = async ({
  tabs,
  theme,
}: {
  tabs: PasteTab[];
  theme: string;
}) => {
  const primaryTab = tabs[0];

  const pasteData = await db
    .insert(paste)
    .values({
      content: primaryTab?.content ?? "",
      language: primaryTab?.language ?? "text",
      theme,
      tabs,
    })
    .returning({ id: paste.id });

  return pasteData[0];
};
