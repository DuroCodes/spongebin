import { redirect } from "next/navigation";
import { EditorProvider } from "~/components/editor-provider";
import { MonacoEditor } from "~/components/monaco-editor";
import { getPasteById } from "~/actions/paste";
import { Header } from "~/components/header";
import { SITE_URL } from "~/constants/site";
import { LANGUAGES_SET, type LanguageName } from "~/utils/languages";
import { createEmptyTab, normalizeTabs } from "~/utils/paste-tabs";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PastePage({ params }: Props) {
  const { id } = await params;
  const paste = await getPasteById(id);

  if (!paste) redirect("/");

  const tabs = normalizeTabs(paste.tabs);
  const safePasteLanguage: LanguageName = LANGUAGES_SET.has(
    paste.language as LanguageName,
  )
    ? (paste.language as LanguageName)
    : "text";
  const initialTabs =
    tabs.length > 0
      ? tabs
      : [
          {
            ...createEmptyTab(1, safePasteLanguage),
            content: paste.content,
          },
        ];

  return (
    <EditorProvider
      initialTabs={initialTabs}
      initialActiveTabId={initialTabs[0]?.id ?? ""}
      initialTheme={paste.theme}
    >
      <main className="flex h-[100dvh] flex-col overflow-hidden">
        <Header />
        <div className="min-h-0 flex-1">
          <MonacoEditor />
        </div>
      </main>
    </EditorProvider>
  );
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const paste = await getPasteById(id);
  const ogImage = { url: "/sponge.png", alt: "spongebin" };

  if (!paste)
    return {
      title: "spongebin",
      description: "a pastebin made with sponge",
      openGraph: {
        type: "website",
        locale: "en_US",
        url: SITE_URL,
        siteName: "spongebin",
        title: "spongebin",
        description: "a pastebin made with sponge",
        images: [ogImage],
      },
      twitter: {
        card: "summary",
        title: "spongebin",
        description: "a pastebin made with sponge",
        images: ["/sponge.png"],
      },
    };

  const tabs = normalizeTabs(paste.tabs);
  const totalTabs = tabs.length || 1;
  const totalLines = tabs.length
    ? tabs.reduce((sum, tab) => sum + tab.content.split("\n").length, 0)
    : paste.content.split("\n").length;

  const title = `spongebin • ${paste.id}`;
  const description = `a paste containing ${totalTabs} file${totalTabs === 1 ? "" : "s"} and ${totalLines} lines`;
  const canonical = `${SITE_URL}/${paste.id}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonical,
      siteName: "spongebin",
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: ["/sponge.png"],
    },
  };
}
