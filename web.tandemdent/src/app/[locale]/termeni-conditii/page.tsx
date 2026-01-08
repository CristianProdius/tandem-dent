import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { LegalPageLayout } from "@/components/legal";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legalPages.terms" });

  return {
    title: `${t("title")} | Tandem Dent`,
    description: t("description"),
  };
}

export default async function TermsConditionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "legalPages.terms.sections" });

  const sections = {
    general: {
      title: t("general.title"),
      content: t("general.content"),
    },
    services: {
      title: t("services.title"),
      content: t("services.content"),
    },
    appointments: {
      title: t("appointments.title"),
      content: t("appointments.content"),
    },
    intellectualProperty: {
      title: t("intellectualProperty.title"),
      content: t("intellectualProperty.content"),
    },
    liability: {
      title: t("liability.title"),
      content: t("liability.content"),
    },
    modifications: {
      title: t("modifications.title"),
      content: t("modifications.content"),
    },
    law: {
      title: t("law.title"),
      content: t("law.content"),
    },
  };

  return <LegalPageLayout pageKey="terms" sections={sections} />;
}
