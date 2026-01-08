import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import NavigationHeader from "@/components/layout/NavigationHeader";
import Footer from "@/components/layout/Footer";
import { locales, type Locale } from "@/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const meta = messages.meta as Record<string, string>;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: "Tandem Dent" }],
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: "https://tandemdent.md",
      siteName: "Tandem Dent",
      locale: locale === "ro" ? "ro_MD" : locale === "ru" ? "ru_MD" : "en_US",
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Tandem Dent - Premium Dental Clinic",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/og-image.jpg"],
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png" }],
    },
    manifest: "/site.webmanifest",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `https://tandemdent.md/${locale}`,
      languages: {
        ro: "https://tandemdent.md/ro",
        ru: "https://tandemdent.md/ru",
        en: "https://tandemdent.md/en",
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {/* Navigation Header */}
      <NavigationHeader />

      {/* Main Content */}
      <main id="main-content" className="min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </NextIntlClientProvider>
  );
}
