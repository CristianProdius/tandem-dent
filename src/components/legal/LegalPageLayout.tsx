"use client";

import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface Section {
  title: string;
  content: string;
  items?: string[];
  details?: string[];
}

interface LegalPageLayoutProps {
  pageKey: "privacy" | "terms" | "cookies" | "gdpr";
  sections: Record<string, Section>;
}

export default function LegalPageLayout({ pageKey, sections }: LegalPageLayoutProps) {
  const t = useTranslations("legalPages");
  const title = t(`${pageKey}.title`);
  const intro = t(`${pageKey}.intro`);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gold-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>{t("backToHome")}</span>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            {intro}
          </p>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              {t("lastUpdated")}: {new Date().toLocaleDateString("ro-RO", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {Object.entries(sections).map(([key, section]) => (
            <div
              key={key}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {section.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {section.content}
              </p>
              {section.items && section.items.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {section.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.details && section.details.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  {section.details.map((detail, index) => (
                    <p key={index} className="text-gray-700">
                      {detail}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Contact Info Card */}
          <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-xl border border-gold-200 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {sections.contact?.title || "Contact"}
            </h2>
            <p className="text-gray-600 mb-6">
              {sections.contact?.content}
            </p>
            <div className="space-y-3">
              <a
                href="mailto:tandemdent22@gmail.com"
                className="flex items-center gap-3 text-gray-700 hover:text-gold-600 transition-colors"
              >
                <Mail size={18} className="text-gold-600" />
                <span>tandemdent22@gmail.com</span>
              </a>
              <a
                href="tel:+37361234555"
                className="flex items-center gap-3 text-gray-700 hover:text-gold-600 transition-colors"
              >
                <Phone size={18} className="text-gold-600" />
                <span>+373 61 234 555</span>
              </a>
              <div className="flex items-start gap-3 text-gray-700">
                <MapPin size={18} className="text-gold-600 mt-0.5" />
                <span>Strada Nicolae Zelinski 5/8, MD-2032, Chișinău</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
