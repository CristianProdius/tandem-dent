import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { LegalPageLayout } from "@/components/legal";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legalPages.privacy" });

  return {
    title: `${t("title")} | Tandem Dent`,
    description: t("description"),
  };
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "legalPages.privacy.sections" });

  const sections = {
    dataCollected: {
      title: t("dataCollected.title"),
      content: t("dataCollected.content"),
      items: t.raw("dataCollected.items") as string[],
    },
    dataUsage: {
      title: t("dataUsage.title"),
      content: t("dataUsage.content"),
      items: t.raw("dataUsage.items") as string[],
    },
    dataStorage: {
      title: t("dataStorage.title"),
      content: t("dataStorage.content"),
    },
    dataSharing: {
      title: t("dataSharing.title"),
      content: t("dataSharing.content"),
    },
    rights: {
      title: t("rights.title"),
      content: t("rights.content"),
      items: t.raw("rights.items") as string[],
    },
    contact: {
      title: t("contact.title"),
      content: t("contact.content"),
    },
  };

  return <LegalPageLayout pageKey="privacy" sections={sections} />;
}
