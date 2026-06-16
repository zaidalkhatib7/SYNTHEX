import type { Metadata } from "next";
import { ExtensionHydrationGuard } from "@/components/ExtensionHydrationGuard";
import "../globals.css";

export const metadata: Metadata = {
  title: "SYNTHEX Holding | Corporate Website",
  description:
    "Choose the English or Arabic corporate experience for SYNTHEX Holding and its four operating companies.",
  alternates: {
    canonical: "/",
    languages: {
      en: "/en/",
      ar: "/ar/",
    },
  },
  openGraph: {
    title: "SYNTHEX Holding",
    description:
      "Corporate experience for SYNTHEX Holding and its four operating companies.",
    type: "website",
  },
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ExtensionHydrationGuard />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
