"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Minus,
  Search,
  HelpCircle,
  DollarSign,
  Activity,
  ArrowDown,
  Info,
  LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/common";
import { useTranslations } from "next-intl";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

type FAQCategory = "general" | "treatments" | "costs";

const FAQSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<FAQCategory>("general");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const t = useTranslations("faq");

  const categories: { id: FAQCategory; name: string; icon: LucideIcon }[] = [
    { id: "general", name: t("categories.general"), icon: Info },
    { id: "treatments", name: t("categories.treatments"), icon: Activity },
    { id: "costs", name: t("categories.costs"), icon: DollarSign },
  ];

  const faqData: Record<FAQCategory, FAQ[]> = {
    general: [
      { id: 1, question: t("questions.general.1.question"), answer: t("questions.general.1.answer") },
      { id: 2, question: t("questions.general.2.question"), answer: t("questions.general.2.answer") },
      { id: 3, question: t("questions.general.3.question"), answer: t("questions.general.3.answer") },
    ],
    treatments: [
      { id: 4, question: t("questions.treatments.1.question"), answer: t("questions.treatments.1.answer") },
      { id: 5, question: t("questions.treatments.2.question"), answer: t("questions.treatments.2.answer") },
      { id: 6, question: t("questions.treatments.3.question"), answer: t("questions.treatments.3.answer") },
    ],
    costs: [
      { id: 7, question: t("questions.costs.1.question"), answer: t("questions.costs.1.answer") },
      { id: 8, question: t("questions.costs.2.question"), answer: t("questions.costs.2.answer") },
      { id: 9, question: t("questions.costs.3.question"), answer: t("questions.costs.3.answer") },
    ],
  };

  const currentFAQs = searchTerm
    ? Object.values(faqData)
        .flat()
        .filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : faqData[activeCategory];

  const toggleFAQ = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="faq" className="relative py-20 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          badge={{ icon: HelpCircle, text: t("badge"), color: "gold" }}
          title={t("title")}
          description={t("description")}
        />

        <div className="max-w-3xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm text-gray-500">
                {t("resultsFor", { count: currentFAQs.length, term: searchTerm })}
              </p>
            )}
          </div>

          {/* Category Tabs */}
          {!searchTerm && (
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium ${
                      activeCategory === category.id
                        ? "bg-gold-600 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {currentFAQs.length > 0 ? (
              currentFAQs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isExpanded={expandedId === faq.id}
                  onToggle={() => toggleFAQ(faq.id)}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="mx-auto text-gray-300 mb-4 w-12 h-12" />
                <p className="text-gray-500">{t("noResults")}</p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 text-gold-600 hover:text-gold-700 font-medium"
                >
                  {t("resetSearch")}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CTA - Points to Contact section below */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gold-50 to-teal-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">
              {t("notFoundTitle")}
            </h3>
            <p className="text-gray-600 mb-6">{t("notFoundDescription")}</p>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold-600 text-white rounded-xl font-semibold hover:bg-gold-700 transition-colors"
            >
              <ArrowDown size={20} />
              <span>{t("contactUs")}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

interface FAQItemProps {
  faq: FAQ;
  isExpanded: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ faq, isExpanded, onToggle }) => {
  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all ${
        isExpanded
          ? "border-gold-400 shadow-md bg-white"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left"
      >
        <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
        <span
          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            isExpanded
              ? "bg-gold-500 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-48" : "max-h-0"
        }`}
      >
        <div className="px-5 pb-4">
          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
