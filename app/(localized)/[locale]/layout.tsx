import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../globals.css";
import { ExtensionHydrationGuard } from "@/components/ExtensionHydrationGuard";
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
    title: isArabic
      ? "SYNTHEX Holding | الشركة القابضة وشركاتها التشغيلية"
      : "SYNTHEX Holding | Supply, Trade, Industry, and Distribution",
    description: isArabic
      ? "تجمع SYNTHEX Holding أربع شركات تشغيلية تعمل في التوريد والتجارة المؤسسية والمواد والتصنيع والتوزيع."
      : "SYNTHEX Holding connects four operating companies across strategic supply, institutional trade, materials and manufacturing, and distribution.",
    alternates: {
      canonical: `/${locale}/`,
      languages: {
        en: "/en/",
        ar: "/ar/",
      },
    },
    openGraph: {
      title: isArabic
        ? "SYNTHEX Holding | الشركة القابضة"
        : "SYNTHEX Holding",
      description: isArabic
        ? "منظومة قابضة للتوريد والتجارة والصناعة والتوزيع."
        : "A holding system spanning supply, trade, industry, and distribution.",
      locale: isArabic ? "ar_SY" : "en_US",
      alternateLocale: isArabic ? ["en_US"] : ["ar_SY"],
      type: "website",
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
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SYNTHEX Holding",
    subOrganization: [
      { "@type": "Organization", name: "JOLLAQ" },
      { "@type": "Organization", name: "Al Maria" },
      { "@type": "Organization", name: "SYNTHEX Industrial" },
      { "@type": "Organization", name: "SHAMCO LLC" },
    ],
  };

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <ExtensionHydrationGuard />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
