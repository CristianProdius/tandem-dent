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

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

type FAQCategory = "general" | "treatments" | "costs";

const categories: { id: FAQCategory; name: string; icon: LucideIcon }[] = [
  { id: "general", name: "Generale", icon: Info },
  { id: "treatments", name: "Tratamente", icon: Activity },
  { id: "costs", name: "Costuri și Plăți", icon: DollarSign },
];

const faqData: Record<FAQCategory, FAQ[]> = {
  general: [
    {
      id: 1,
      question: "Cât de des trebuie să merg la control?",
      answer:
        "Recomandăm control la fiecare 6 luni. Aceasta ajută la depistarea timpurie a problemelor, când tratamentul este mai simplu și mai ieftin.",
    },
    {
      id: 2,
      question: "De la ce vârstă pot aduce copilul?",
      answer:
        "Recomandăm prima vizită la 2-3 ani sau când apar toți dinții de lapte. Facem vizita distractivă pentru cei mici!",
    },
    {
      id: 3,
      question: "Cât timp durează vindecarea după extracție?",
      answer:
        "Vindecarea inițială durează 1-2 săptămâni. Vindecarea completă a osului durează 3-6 luni.",
    },
  ],
  treatments: [
    {
      id: 4,
      question: "Tratamentele dor?",
      answer:
        "Folosim cele mai moderne metode de anestezie. Majoritatea pacienților nu simt durere în timpul tratamentului. Confortul tău este prioritatea noastră.",
    },
    {
      id: 5,
      question: "Albirea dentară îmi strică smalțul?",
      answer:
        "Nu, albirea profesională făcută corect este sigură. Folosim produse certificate care protejează smalțul.",
    },
    {
      id: 6,
      question: "Cât durează un implant dentar?",
      answer:
        "Procesul complet durează 3-6 luni. Prima etapă (plasarea implantului) durează aproximativ 1 oră.",
    },
  ],
  costs: [
    {
      id: 7,
      question: "Cât costă o consultație?",
      answer:
        "Prima consultație pentru pacienți noi este GRATUITĂ. Include examinarea completă și plan de tratament.",
    },
    {
      id: 8,
      question: "Acceptați asigurarea CNAM?",
      answer:
        "Da, acceptăm asigurarea CNAM pentru serviciile acoperite. Echipa noastră te va ajuta cu documentele necesare.",
    },
    {
      id: 9,
      question: "Pot plăti în rate?",
      answer:
        "Da! Oferim rate fără dobândă pentru tratamente peste 3.000 MDL. Aprobarea se face pe loc.",
    },
  ],
};

const FAQSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<FAQCategory>("general");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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
          badge={{ icon: HelpCircle, text: "FAQ", color: "gold" }}
          title="Întrebări Frecvente"
          description="Răspunsuri la cele mai comune întrebări ale pacienților noștri"
        />

        <div className="max-w-3xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Caută în întrebări..."
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
                {currentFAQs.length} rezultate pentru &quot;{searchTerm}&quot;
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
                <p className="text-gray-500">
                  Nu am găsit întrebări pentru căutarea ta.
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 text-gold-600 hover:text-gold-700 font-medium"
                >
                  Resetează căutarea
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CTA - Points to Contact section below */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gold-50 to-teal-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">
              Nu ai găsit răspunsul?
            </h3>
            <p className="text-gray-600 mb-6">
              Completează formularul de contact și te vom ajuta cu orice întrebare
            </p>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold-600 text-white rounded-xl font-semibold hover:bg-gold-700 transition-colors"
            >
              <ArrowDown size={20} />
              <span>Contactează-ne</span>
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
