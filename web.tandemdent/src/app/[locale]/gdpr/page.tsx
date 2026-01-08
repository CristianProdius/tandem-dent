import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { LegalPageLayout } from "@/components/legal";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legalPages.gdpr" });

  return {
    title: `${t("title")} | Tandem Dent`,
    description: t("description"),
  };
}

export default async function GDPRPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "legalPages.gdpr.sections" });

  const sections = {
    dataController: {
      title: t("dataController.title"),
      content: t("dataController.content"),
      details: t.raw("dataController.details") as string[],
    },
    legalBasis: {
      title: t("legalBasis.title"),
      content: t("legalBasis.content"),
      items: t.raw("legalBasis.items") as string[],
    },
    rights: {
      title: t("rights.title"),
      content: t("rights.content"),
      items: t.raw("rights.items") as string[],
    },
    retention: {
      title: t("retention.title"),
      content: t("retention.content"),
      items: t.raw("retention.items") as string[],
    },
    security: {
      title: t("security.title"),
      content: t("security.content"),
    },
    complaint: {
      title: t("complaint.title"),
      content: t("complaint.content"),
    },
    contact: {
      title: t("contact.title"),
      content: t("contact.content"),
    },
  };

  return <LegalPageLayout pageKey="gdpr" sections={sections} />;
}
