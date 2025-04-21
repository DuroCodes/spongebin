import { EditorProvider } from "~/components/editor-provider";
import { Header } from "~/components/header";
import { MonacoEditor } from "~/components/monaco-editor";

export default function Home() {
  return (
    <EditorProvider>
      <Header />
      <MonacoEditor />
    </EditorProvider>
  );
}
