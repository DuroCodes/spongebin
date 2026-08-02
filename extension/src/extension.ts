import * as path from "path";
import * as vscode from "vscode";
import {
  inferLanguage,
  LANGUAGES_SET,
  type LanguageName,
} from "@spongebin/shared";

type CreatePasteResponse =
  | { success: true; id: string; url: string }
  | { error: string };

const DEFAULT_BASE_URL = "http://127.0.0.1:3000";

const getConfig = () => {
  const cfg = vscode.workspace.getConfiguration("spongebin");
  const baseUrl = String(cfg.get("baseUrl", DEFAULT_BASE_URL)).replace(
    /\/+$/,
    "",
  );
  const defaultLanguage = String(cfg.get("defaultLanguage", "text"));
  const theme = String(cfg.get("theme", "catppuccin-mocha"));
  return { baseUrl, defaultLanguage, theme };
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

// vscode language ids are different from spongebin's `language` values.
const VSCODE_LANGUAGE_ID_MAP: Record<string, LanguageName> = {
  typescriptreact: "tsx",
  javascriptreact: "jsx",
  csharp: "c#",
  cpp: "c++",
  fsharp: "f#",
};

const languageForDocument = (
  document: vscode.TextDocument,
  defaultLanguage: string,
) => {
  const filePath = document.uri.fsPath;
  const name = filePath ? path.basename(filePath) : "";
  const fromName = inferLanguage(name);
  if (fromName && fromName !== "text") return fromName;

  const id = document.languageId;
  const mapped = VSCODE_LANGUAGE_ID_MAP[id];
  if (mapped) return mapped;
  if (LANGUAGES_SET.has(id)) return id as LanguageName;

  return defaultLanguage;
};

const uploadText = async (document: vscode.TextDocument, text: string) => {
  const { baseUrl, defaultLanguage, theme } = getConfig();
  const language = languageForDocument(document, defaultLanguage);
  const resp = await createPaste({ content: text, language, theme, baseUrl });

  await vscode.env.clipboard.writeText(resp.url);
  await vscode.env.openExternal(vscode.Uri.parse(resp.url));
  vscode.window.showInformationMessage("spongebin URL copied to clipboard.");
};

const upload = async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) throw new Error("No active editor");

  const { document, selection } = editor;
  const text = selection.isEmpty
    ? document.getText()
    : document.getText(selection).trimEnd();

  if (!text)
    throw new Error(selection.isEmpty ? "File is empty" : "Selection is empty");

  await uploadText(document, text);
};

const wrap = (fn: () => Promise<void>) => async () => {
  try {
    await fn();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    vscode.window.showErrorMessage(`spongebin: ${msg}`);
  }
};

export const activate = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand("spongebin.upload", wrap(upload)),
  );
};
