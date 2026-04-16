import * as path from "path";
import * as vscode from "vscode";
import {
  inferLanguageFromFilename,
  type LanguageName,
  SPONGEBIN_LANGUAGE_IDS,
} from "./languageFromFilename";

type CreatePasteResponse =
  | { success: true; id: string; url: string }
  | { error: string };

const getConfig = () => {
  const cfg = vscode.workspace.getConfiguration("spongebin");
  const baseUrl = String(cfg.get("baseUrl", "https://spongebin.dev")).replace(
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
}: {
  content: string;
  language: string;
}) => {
  const { baseUrl, theme } = getConfig();

  const res = await fetch(`${baseUrl}/api/paste`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      content,
      language,
      theme,
    }),
  });

  const data = (await res.json()) as CreatePasteResponse;
  if (!res.ok) {
    const msg = "error" in data ? data.error : `Request failed (${res.status})`;
    throw new Error(msg);
  }
  if (!("success" in data) || !data.success)
    throw new Error("Unexpected response");
  return data;
};

/** VS Code language IDs that differ from spongebin's `language` strings. */
const VSCODE_LANGUAGE_ID_MAP: Record<string, LanguageName> = {
  typescriptreact: "tsx",
  javascriptreact: "jsx",
  csharp: "c#",
  cpp: "c++",
  fsharp: "f#",
};

const languageForDocument = (document: vscode.TextDocument) => {
  const { defaultLanguage } = getConfig();
  const filePath = document.uri.fsPath;
  const name = filePath ? path.basename(filePath) : "";
  const fromName = inferLanguageFromFilename(name);
  if (fromName !== "text") return fromName;

  const id = document.languageId;
  const mapped = VSCODE_LANGUAGE_ID_MAP[id];
  if (mapped) return mapped;
  if (SPONGEBIN_LANGUAGE_IDS.has(id as LanguageName)) return id as LanguageName;

  return defaultLanguage;
};

const uploadFromSelection = async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) throw new Error("No active editor");

  const selection = editor.selection;
  const text = editor.document.getText(selection).trimEnd();
  if (!text) throw new Error("Selection is empty");

  const language = languageForDocument(editor.document);
  const resp = await createPaste({ content: text, language });

  await vscode.env.clipboard.writeText(resp.url);
  await vscode.env.openExternal(vscode.Uri.parse(resp.url));

  vscode.window.showInformationMessage("spongebin URL copied to clipboard.");
};

const uploadEntireFile = async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) throw new Error("No active editor");

  const text = editor.document.getText();
  if (!text) throw new Error("File is empty");

  const language = languageForDocument(editor.document);
  const resp = await createPaste({ content: text, language });

  await vscode.env.clipboard.writeText(resp.url);
  await vscode.env.openExternal(vscode.Uri.parse(resp.url));

  vscode.window.showInformationMessage("spongebin URL copied to clipboard.");
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
    vscode.commands.registerCommand(
      "spongebin.uploadFromSelection",
      wrap(uploadFromSelection),
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "spongebin.uploadEntireFile",
      wrap(uploadEntireFile),
    ),
  );
};

export const deactivate = () => {};
