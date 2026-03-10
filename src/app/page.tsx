import { EditorProvider } from "~/components/editor-provider";
import { MonacoEditor } from "~/components/monaco-editor";
import { Header } from "~/components/header";

export default function Home() {
  return (
    <EditorProvider>
      <Header />
      <MonacoEditor />
    </EditorProvider>
  );
}
