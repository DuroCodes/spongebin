"use server";

import { eq } from "drizzle-orm";
import { db } from "~/db/drizzle";
import { paste } from "~/db/schema";

export const getPasteById = async (id: string) => {
  const pasteData = await db
    .select()
    .from(paste)
    .where(eq(paste.id, id))
    .limit(1);

  return pasteData[0];
};

export const addPaste = async (
  content: string,
  language: string,
  theme: string,
) => {
  const pasteData = await db
    .insert(paste)
    .values({
      content,
      language,
      theme,
    })
    .returning({ id: paste.id });

  return pasteData[0];
};
