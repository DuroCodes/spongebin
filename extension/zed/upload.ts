#!/usr/bin/env bun
import * as fs from "node:fs";
import * as path from "node:path";
import {
  inferLanguage,
  LANGUAGES_SET,
  type LanguageName,
} from "../../shared/src/index.ts";

type CreatePasteResponse =
  | { success: true; id: string; url: string }
  | { error: string };

const DEFAULT_BASE_URL = "https://spongebin.dev";
const DEFAULT_LANGUAGE = "text";
const DEFAULT_THEME = "catppuccin-mocha";

const usage = () => {
  console.error(`usage:
  spongebin-upload [--file <path>] [--filename <name>] [--language <id>] [--theme <name>] [--base-url <url>]

reads content from --file, else stdin (or $ZED_SELECTED_TEXT / $SPONGEBIN_CONTENT).
`);
  process.exit(2);
};

const argValue = (argv: string[], flag: string) => {
  const i = argv.indexOf(flag);
  if (i === -1) return undefined;
  const value = argv[i + 1];
  if (!value || value.startsWith("-")) usage();
  return value;
};

const envOr = (key: string, fallback: string) => {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : fallback;
};

const readStdin = async () => {
  if (process.stdin.isTTY) return "";
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
};

const resolveLanguage = ({
  language,
  filename,
  defaultLanguage,
}: {
  language?: string;
  filename?: string;
  defaultLanguage: string;
}) => {
  if (language && LANGUAGES_SET.has(language as LanguageName)) return language;
  if (filename) {
    const inferred = inferLanguage(path.basename(filename));
    if (inferred) return inferred;
  }
  return defaultLanguage;
};

const createPaste = async ({
  content,
  language,
  theme,
  baseUrl,
}: {
  content: string;
  language: string;
  theme: string;
  baseUrl: string;
}) => {
  const res = await fetch(`${baseUrl}/api/paste`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ content, language, theme }),
  });

  let data: CreatePasteResponse;
  try {
    data = (await res.json()) as CreatePasteResponse;
  } catch {
    throw new Error(`Request failed (${res.status})`);
  }

  if (!res.ok) {
    const msg = "error" in data ? data.error : `Request failed (${res.status})`;
    throw new Error(msg);
  }
  if (!("success" in data) || !data.success)
    throw new Error("Unexpected response");
  return data;
};

const copyToClipboard = async (text: string) => {
  if (process.platform === "darwin") {
    const proc = Bun.spawn(["pbcopy"], { stdin: "pipe" });
    proc.stdin.write(text);
    proc.stdin.end();
    await proc.exited;
    return;
  }
  if (process.platform === "linux") {
    const proc = Bun.spawn(["xclip", "-selection", "clipboard"], {
      stdin: "pipe",
    });
    proc.stdin.write(text);
    proc.stdin.end();
    await proc.exited;
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
  const theme = argValue(argv, "--theme") || envOr("SPONGEBIN_THEME", DEFAULT_THEME);
  const baseUrl = (
    argValue(argv, "--base-url") || envOr("SPONGEBIN_BASE_URL", DEFAULT_BASE_URL)
  ).replace(/\/+$/, "");
  const defaultLanguage = envOr(
    "SPONGEBIN_DEFAULT_LANGUAGE",
    DEFAULT_LANGUAGE,
  );

  let content = "";
  const selection =
    process.env.ZED_SELECTED_TEXT?.trim() ||
    process.env.SPONGEBIN_CONTENT?.trim() ||
    "";

  if (selection) {
    content = selection;
  } else if (file) {
    content = fs.readFileSync(file, "utf8");
  } else {
    content = await readStdin();
  }

  // If no selection/stdin, fall back to the open file.
  if (!content.trim() && process.env.ZED_FILE) {
    content = fs.readFileSync(process.env.ZED_FILE, "utf8");
  }

  if (!content.trim()) throw new Error("Nothing to upload");

  const resolvedLanguage = resolveLanguage({
    language,
    filename,
    defaultLanguage,
  });
  const paste = await createPaste({
    content,
    language: resolvedLanguage,
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
