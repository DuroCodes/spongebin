import { getPasteById } from "~/actions/paste-action";
import { redirect } from "next/navigation";
import { MonacoEditor } from "~/components/monaco-editor";
import { EditorProvider } from "~/components/editor-provider";
import { Header } from "~/components/header";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
