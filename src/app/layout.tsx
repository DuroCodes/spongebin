import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "~/components/ui/sonner";
import { SITE_URL } from "~/constants/site";

const site = new URL(SITE_URL);

export const metadata: Metadata = {
  metadataBase: site,
  alternates: { canonical: SITE_URL },
  title: "spongebin",
  description: "a pastebin made with sponge",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "spongebin",
    title: "spongebin",
    description: "a pastebin made with sponge",
    images: [{ url: "/sponge.png", alt: "spongebin" }],
  },
  twitter: {
    card: "summary",
    title: "spongebin",
    description: "a pastebin made with sponge",
    images: ["/sponge.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFCC4D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
