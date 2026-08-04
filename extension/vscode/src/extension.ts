import * as path from "path";
import * as vscode from "vscode";
import {
  DEFAULT_BASE_URL,
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,
  createPaste,
  normalizeBaseUrl,
  resolvePasteLanguage,
} from "@spongebin/shared";

const getConfig = () => {
  const cfg = vscode.workspace.getConfiguration("spongebin");
  const baseUrl = normalizeBaseUrl(
    String(cfg.get("baseUrl", DEFAULT_BASE_URL)),
  );
  const defaultLanguage = String(cfg.get("defaultLanguage", DEFAULT_LANGUAGE));
  const theme = String(cfg.get("theme", DEFAULT_THEME));
  return { baseUrl, defaultLanguage, theme };
};

const languageForDocument = (
  document: vscode.TextDocument,
  defaultLanguage: string,
) => {
  const filePath = document.uri.fsPath;
  const filename = filePath ? path.basename(filePath) : "";

  return resolvePasteLanguage({
    filename,
    editorLanguageId: document.languageId,
    defaultLanguage,
  });
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
