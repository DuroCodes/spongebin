import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  inferLanguage,
  LANGUAGES_SET,
  type LanguageName,
} from "@spongebin/shared";

const DEFAULT_BASE_URL = "https://spongebin.dev";
const DEFAULT_LANGUAGE = "text";
const DEFAULT_THEME = "catppuccin-mocha";

type CreatePasteResponse =
  | { success: true; id: string; url: string }
  | { error: string };

const envOr = (key: string, fallback: string) => {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : fallback;
};

const baseUrl = () =>
  envOr("SPONGEBIN_BASE_URL", DEFAULT_BASE_URL).replace(/\/+$/, "");

const resolveLanguage = ({
  language,
  filename,
}: {
  language?: string;
  filename?: string;
}): string => {
  if (language && LANGUAGES_SET.has(language as LanguageName)) return language;

  if (filename) {
    const inferred = inferLanguage(filename);
    if (inferred) return inferred;
  }

  return envOr("SPONGEBIN_DEFAULT_LANGUAGE", DEFAULT_LANGUAGE);
};

const createPaste = async ({
  content,
  language,
  theme,
  filename,
}: {
  content: string;
  language?: string;
  theme?: string;
  filename?: string;
}) => {
  const resolvedLanguage = resolveLanguage({ language, filename });
  const resolvedTheme = theme?.trim() || envOr("SPONGEBIN_THEME", DEFAULT_THEME);
  const url = `${baseUrl()}/api/paste`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      content,
      language: resolvedLanguage,
      theme: resolvedTheme,
    }),
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

  return {
    id: data.id,
    url: data.url,
    language: resolvedLanguage,
    theme: resolvedTheme,
  };
};

const server = new McpServer({
  name: "spongebin",
  version: "0.0.1",
});

server.registerTool(
  "create_paste",
  {
    title: "Create spongebin paste",
    description:
      "Upload code or text to spongebin and return a shareable URL. Prefer the active selection when available, otherwise the whole file.",
    inputSchema: {
      content: z.string().describe("Text or code to upload."),
      language: z
        .string()
        .optional()
        .describe(
          "spongebin language id (e.g. typescript, rust). Inferred from filename when omitted.",
        ),
      filename: z
        .string()
        .optional()
        .describe("Optional filename used to infer language."),
      theme: z
        .string()
        .optional()
        .describe("Theme name sent with the paste (default: catppuccin-mocha)."),
    },
  },
  async ({ content, language, filename, theme }) => {
    if (!content.trim()) {
      return {
        isError: true,
        content: [{ type: "text" as const, text: "Content is empty." }],
      };
    }

    try {
      const paste = await createPaste({ content, language, filename, theme });
      const text = `Created spongebin paste: ${paste.url}`;
      return {
        content: [{ type: "text" as const, text }],
        structuredContent: paste,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        isError: true,
        content: [{ type: "text" as const, text: `spongebin: ${msg}` }],
      };
    }
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
