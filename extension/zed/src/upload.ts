#!/usr/bin/env bun
import * as fs from "node:fs";
import {
  DEFAULT_BASE_URL,
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,
  createPaste,
  normalizeBaseUrl,
  resolvePasteLanguage,
} from "@spongebin/shared";

const usage = () => {
  console.error(
    [
      "usage: [--file <path>] [--filename <name>] [--language <id>] [--theme <name>] [--base-url <url>]",
      "reads content from --file, or stdin (or $ZED_SELECTED_TEXT / $SPONGEBIN_CONTENT).",
    ].join("\n"),
  );
  process.exit(2);
};

const argValue = (argv: string[], flag: string) => {
  const index = argv.indexOf(flag);
  if (index === -1) return undefined;

  const value = argv[index + 1];
  if (!value?.trim() || value.startsWith("-")) return undefined;

  return value;
};

const envOr = (key: string, fallback: string) => {
  const value = process.env[key]?.trim();
  return value || fallback;
};

const readStdin = async () => {
  if (process.stdin.isTTY) return "";

  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
};

const writeToClipboardCommand = async (
  command: string,
  args: string[],
  text: string,
) => {
  const proc = Bun.spawn([command, ...args], { stdin: "pipe" });
  proc.stdin.write(text);
  proc.stdin.end();
  await proc.exited;
};

const copyToClipboard = async (text: string) => {
  if (process.platform === "darwin") {
    await writeToClipboardCommand("pbcopy", [], text);
    return;
  }

  if (process.platform === "linux") {
    await writeToClipboardCommand("xclip", ["-selection", "clipboard"], text);
    return;
  }

  if (process.platform === "win32") {
    await writeToClipboardCommand("clip", [], text);
  }
};

const main = async () => {
  const argv = process.argv.slice(2);
  if (argv.includes("-h") || argv.includes("--help")) usage();

  const file = argValue(argv, "--file");
  const filename =
    argValue(argv, "--filename") ||
    file ||
    process.env.ZED_FILENAME ||
    process.env.ZED_FILE;

  const language = argValue(argv, "--language");
  const theme =
    argValue(argv, "--theme") || envOr("SPONGEBIN_THEME", DEFAULT_THEME);

  const baseUrl = normalizeBaseUrl(
    argValue(argv, "--base-url") ||
      envOr("SPONGEBIN_BASE_URL", DEFAULT_BASE_URL),
  );
  const defaultLanguage = envOr("SPONGEBIN_DEFAULT_LANGUAGE", DEFAULT_LANGUAGE);

  const content =
    process.env.ZED_SELECTED_TEXT?.trim() ||
    process.env.SPONGEBIN_CONTENT?.trim() ||
    (file ? fs.readFileSync(file, "utf8") : await readStdin()) ||
    (process.env.ZED_FILE ? fs.readFileSync(process.env.ZED_FILE, "utf8") : "");

  if (!content.trim()) throw new Error("Nothing to upload");

  const paste = await createPaste({
    content,
    language: resolvePasteLanguage({ language, filename, defaultLanguage }),
    theme,
    baseUrl,
  });

  try {
    await copyToClipboard(paste.url);
  } catch {
    // clipboard is best-effort
  }

  console.log(paste.url);
};

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
