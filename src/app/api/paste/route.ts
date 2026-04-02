import { NextRequest, NextResponse } from "next/server";
import { LANGUAGES_SET, type LanguageName } from "~/utils/languages";
import { addPaste, getPasteById } from "~/actions/paste";
import { THEME_MAP } from "~/utils/themes";
import { normalizeTabs } from "~/utils/paste-tabs";

const isLanguageName = (value: unknown): value is LanguageName =>
  typeof value === "string" && LANGUAGES_SET.has(value as LanguageName);

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const paste = await getPasteById(id);

    if (!paste)
      return NextResponse.json({ error: "Paste not found" }, { status: 404 });

    return NextResponse.json({ success: true, paste }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tabs = normalizeTabs(body.tabs);

    if (!tabs.length && !body.content)
      return NextResponse.json(
        { error: "At least one file is required" },
        { status: 400 },
      );

    const theme = body.theme || "catppuccin-mocha";
    const normalizedTabs =
      tabs.length > 0
        ? tabs
        : [
            {
              id: crypto.randomUUID(),
              filename: "paste.txt",
              language:
                typeof body.language === "string" &&
                isLanguageName(body.language)
                  ? body.language
                  : "text",
              content: body.content,
            },
          ];

    for (const tab of normalizedTabs) {
      if (!isLanguageName(tab.language))
        return NextResponse.json(
          { error: `Invalid language: ${tab.language}` },
          { status: 400 },
        );
    }

    if (!(theme in THEME_MAP))
      return NextResponse.json(
        { error: `Invalid theme: ${theme}` },
        { status: 400 },
      );

    const paste = await addPaste({
      tabs: normalizedTabs,
      theme,
    });

    if (!paste.id)
      return NextResponse.json(
        { error: "Failed to create paste" },
        { status: 500 },
      );

    return NextResponse.json(
      {
        success: true,
        id: paste.id,
        url: `${request.nextUrl.origin}/${paste.id}`,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
