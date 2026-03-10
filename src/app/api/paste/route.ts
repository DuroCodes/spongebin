import { NextRequest, NextResponse } from "next/server";
import { LANGUAGES } from "~/utils/languages";
import { addPaste } from "~/actions/paste";
import { THEME_MAP } from "~/utils/themes";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.content)
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 },
      );

    const language = body.language || "text";
    const theme = body.theme || "catppuccin-mocha";

    if (!LANGUAGES.includes(language))
      return NextResponse.json(
        { error: `Invalid language: ${language}` },
        { status: 400 },
      );

    if (!Object.keys(THEME_MAP).includes(theme))
      return NextResponse.json(
        { error: `Invalid theme: ${theme}` },
        { status: 400 },
      );

    const paste = await addPaste(body.content, language, theme);

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
