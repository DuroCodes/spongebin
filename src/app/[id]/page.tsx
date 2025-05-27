import { getPasteById } from "~/actions/paste";
import { redirect } from "next/navigation";
import { MonacoEditor } from "~/components/monaco-editor";
import { EditorProvider } from "~/components/editor-provider";
import { Header } from "~/components/header";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PastePage({ params }: Props) {
  const { id } = await params;
  const paste = await getPasteById(id);

  if (!paste) redirect("/");

  return (
    <EditorProvider
      initialContent={paste.content}
      initialLanguage={paste.language}
      initialTheme={paste.theme}
    >
      <Header />
      <MonacoEditor />
    </EditorProvider>
  );
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const paste = await getPasteById(id);

  if (!paste)
    return {
      title: "spongebin",
      description: "a pastebin made with sponge",
      openGraph: { images: "/sponge.png" },
      twitter: { card: "summary" },
    };

  const numLines = paste.content.split("\n").length;
  const codeblockPreview = paste.content
    .split("\n")
    .slice(0, 3)
    .join("\n")
    .replace(/`/g, "\\`")
    .replace(/^\s*```(\w+)?/, "```" + paste.language)
    .replace(/^\s*```/, "```");

  return {
    title: `spongebin • ${paste.id}`,
    description: `a paste containing ${numLines} lines of ${paste.language}\ncode:\n${codeblockPreview}`,
    openGraph: { images: "/sponge.png" },
    twitter: { card: "summary" },
  };
}
