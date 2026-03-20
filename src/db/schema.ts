import { jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";
import type { PasteTab } from "~/utils/paste-tabs";

const nanoid = customAlphabet(
  "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  10,
);

export const paste = pgTable("paste", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  content: text("content").notNull(),
  language: text("language").notNull(),
  theme: text("theme").notNull(),
  tabs: jsonb("tabs").$type<PasteTab[]>(),
});
