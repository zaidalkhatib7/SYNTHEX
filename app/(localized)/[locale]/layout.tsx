import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../globals.css";
import { isLocale, locales, type Locale } from "@/lib/i18n";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Pick<LocaleLayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const isArabic = locale === "ar";

  return {
    title: isArabic ? "SYNTHEX Holding | الموقع المؤسسي" : "SYNTHEX Holding",
    description: isArabic
      ? "الهيكل الأساسي للموقع المؤسسي لشركة SYNTHEX Holding وشركاتها التشغيلية."
      : "The corporate foundation for SYNTHEX Holding and its four operating companies.",
    alternates: {
      languages: {
        en: "/en/",
        ar: "/ar/",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
