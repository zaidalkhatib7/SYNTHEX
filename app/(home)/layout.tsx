import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "SYNTHEX Holding",
  description:
    "SYNTHEX Holding website foundation with English and Arabic experiences.",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
