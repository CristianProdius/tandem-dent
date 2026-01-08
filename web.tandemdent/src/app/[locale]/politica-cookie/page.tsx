import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { LegalPageLayout } from "@/components/legal";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legalPages.cookies" });

  return {
    title: `${t("title")} | Tandem Dent`,
    description: t("description"),
  };
}

export default async function CookiePolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "legalPages.cookies.sections" });

  const sections = {
    whatAreCookies: {
      title: t("whatAreCookies.title"),
      content: t("whatAreCookies.content"),
    },
    cookiesWeUse: {
      title: t("cookiesWeUse.title"),
      content: t("cookiesWeUse.content"),
      items: t.raw("cookiesWeUse.items") as string[],
    },
    noCookies: {
      title: t("noCookies.title"),
      content: t("noCookies.content"),
      items: t.raw("noCookies.items") as string[],
    },
    manageCookies: {
      title: t("manageCookies.title"),
      content: t("manageCookies.content"),
    },
    contact: {
      title: t("contact.title"),
      content: t("contact.content"),
    },
  };

  return <LegalPageLayout pageKey="cookies" sections={sections} />;
}
