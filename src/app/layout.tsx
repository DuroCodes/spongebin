import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "spongebin",
  description: "a pastebin made with sponge",
  openGraph: { images: "/sponge.png" },
  twitter: { card: "summary" },
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
