import { EditorProvider } from "~/components/editor-provider";
import { MonacoEditor } from "~/components/monaco-editor";
import { Header } from "~/components/header";

export default function Home() {
  return (
    <EditorProvider>
      <main className="flex h-[100dvh] flex-col overflow-hidden">
        <Header />
        <div className="min-h-0 flex-1">
          <MonacoEditor />
        </div>
      </main>
    </EditorProvider>
  );
}
