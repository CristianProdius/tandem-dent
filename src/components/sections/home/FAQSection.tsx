"use client";

import React, { useState, ReactNode } from "react";
import {
  Plus,
  Minus,
  Search,
  HelpCircle,
  DollarSign,
  AlertCircle,
  Activity,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Clock,
  Phone,
  FileText,
  Info,
  TrendingUp,
  BookOpen,
  LucideIcon,
} from "lucide-react";

// Type Definitions
interface FAQ {
  id: number;
  question: string;
  answer: string;
  popularity: number;
  relatedArticles?: string[];
}

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  count: number;
}

interface EmergencyGuideItem {
  title: string;
  action: string;
  urgency: string;
  time: string;
  color: string;
  bgColor: string;
}

type FAQCategory = "general" | "treatments" | "costs" | "emergency";

type FAQData = {
  [K in FAQCategory]: FAQ[];
};

interface FAQItemProps {
  faq: FAQ;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onHelpfulVote: (isHelpful: boolean) => void;
  helpfulVote: boolean | undefined;
  highlightSearchTerm: (text: string) => ReactNode;
}

const FAQSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<FAQCategory | "all">(
    "general"
  );
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, boolean>>({});
  const [showAskQuestion, setShowAskQuestion] = useState(false);

  // Categories
  const categories: Category[] = [
    { id: "general", name: "Generale", icon: Info, count: 3 },
    { id: "treatments", name: "Tratamente", icon: Activity, count: 3 },
    { id: "costs", name: "Costuri și Plăți", icon: DollarSign, count: 3 },
    { id: "emergency", name: "Urgențe", icon: AlertCircle, count: 1 },
  ];

  // FAQ Data from your PDF content
  const faqData: FAQData = {
    general: [
      {
        id: 1,
        question: "Cât de des trebuie să merg la control?",
        answer:
          "Recomandăm control la fiecare 6 luni. Aceasta ajută la depistarea timpurie a problemelor, când tratamentul este mai simplu și mai ieftin.",
        popularity: 95,
        relatedArticles: [
          "Ghid complet pentru igiena orală",
          "De ce sunt importante controalele regulate",
        ],
      },
      {
        id: 2,
        question: "De la ce vârstă pot aduce copilul?",
        answer:
          "Recomandăm prima vizită la 2-3 ani sau când apar toți dinții de lapte. Facem vizita distractivă pentru cei mici!",
        popularity: 78,
        relatedArticles: [
          "Stomatologie pediatrică",
          "Prima vizită a copilului la dentist",
        ],
      },
      {
        id: 3,
        question: "Cât timp durează vindecarea după extracție?",
        answer:
          "Vindecarea inițială durează 1-2 săptămâni. Vindecarea completă a osului durează 3-6 luni.",
        popularity: 82,
        relatedArticles: [
          "Îngrijire după extracție",
          "Ce să faci după o extracție dentară",
        ],
      },
    ],
    treatments: [
      {
        id: 4,
        question: "Tratamentele dor?",
        answer:
          "Folosim cele mai moderne metode de anestezie. Majoritatea pacienților nu simt durere în timpul tratamentului. Confortul tău este prioritatea noastră.",
        popularity: 98,
        relatedArticles: [
          "Tehnologii moderne fără durere",
          "Cum am eliminat frica de dentist",
        ],
      },
      {
        id: 5,
        question: "Albirea dentară îmi strică smalțul?",
        answer:
          "Nu, albirea profesională făcută corect este sigură. Folosim produse certificate care protejează smalțul.",
        popularity: 85,
        relatedArticles: [
          "Ghid complet pentru albirea dentară",
          "Mituri despre albirea dinților",
        ],
      },
      {
        id: 6,
        question: "Cât durează un implant dentar?",
        answer:
          "Procesul complet durează 3-6 luni. Prima etapă (plasarea implantului) durează aproximativ 1 oră.",
        popularity: 87,
        relatedArticles: [
          "Tot despre implanturi dentare",
          "Procesul pas cu pas",
        ],
      },
    ],
    costs: [
      {
        id: 7,
        question: "Cât costă o consultație?",
        answer:
          "Prima consultație pentru pacienți noi este GRATUITĂ. Include examinarea completă și plan de tratament.",
        popularity: 100,
        relatedArticles: [
          "Lista de prețuri",
          "Ce include o consultație gratuită",
        ],
      },
      {
        id: 8,
        question: "Acceptați asigurarea CNAM?",
        answer:
          "Da, acceptăm asigurarea CNAM pentru serviciile acoperite. Echipa noastră te va ajuta cu documentele necesare.",
        popularity: 88,
        relatedArticles: [
          "Servicii acoperite de CNAM",
          "Cum să folosești asigurarea",
        ],
      },
      {
        id: 9,
        question: "Pot plăti în rate?",
        answer:
          "Da! Oferim rate fără dobândă pentru tratamente peste 3.000 MDL. Aprobarea se face pe loc.",
        popularity: 92,
        relatedArticles: [
          "Opțiuni de finanțare",
          "Cum funcționează plata în rate",
        ],
      },
    ],
    emergency: [
      {
        id: 10,
        question: "Ce fac în caz de urgență dentară?",
        answer:
          "Sunați la +373 61 234 555 - răspundem 24/7. Pentru urgențe majore în afara programului, avem medic de gardă.",
        popularity: 96,
        relatedArticles: ["Ghid urgențe dentare", "Când să suni imediat"],
      },
    ],
  };

  // Emergency Guide Data from PDF
  const emergencyGuide: EmergencyGuideItem[] = [
    {
      title: "Dinte căzut",
      action: "Pune-l în lapte, vino urgent",
      urgency: "Maximă",
      time: "30 minute",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Durere severă",
      action: "Ia un calmant, aplică frig",
      urgency: "Înaltă",
      time: "Programare urgentă",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Umflătură facială",
      action: "Nu aplica căldură, vino urgent",
      urgency: "Înaltă",
      time: "Posibilă infecție",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Sângerare gingie",
      action: "Clătește cu apă sărată",
      urgency: "Medie",
      time: "24-48 ore",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  // Get current FAQs based on category and search
  const getCurrentFAQs = (): FAQ[] => {
    const allFAQs = Object.values(faqData).flat();
    const categoryFAQs =
      activeCategory === "all"
        ? allFAQs
        : activeCategory in faqData
        ? faqData[activeCategory as FAQCategory]
        : [];

    if (!searchTerm) return categoryFAQs;

    return categoryFAQs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Toggle FAQ expansion
  const toggleFAQ = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handle helpful vote
  const handleHelpfulVote = (faqId: number, isHelpful: boolean) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [faqId]: isHelpful,
    }));
  };

  // Highlight search terms
  const highlightSearchTerm = (text: string): ReactNode => {
    if (!searchTerm) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const currentFAQs = getCurrentFAQs();

  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-premium">Întrebări Frecvente</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Răspunsuri la cele mai comune întrebări ale pacienților noștri
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Main FAQ Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Caută în întrebări frecvente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:outline-none transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              {searchTerm && (
                <p className="mt-2 text-sm text-gray-600">
                  {currentFAQs.length} rezultate pentru "{searchTerm}"
                </p>
              )}
            </div>

            {/* Category Tabs */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() =>
                        setActiveCategory(category.id as FAQCategory)
                      }
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        activeCategory === category.id
                          ? "bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{category.name}</span>
                      <span
                        className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          activeCategory === category.id
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="divider-premium my-6"></div>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
              {currentFAQs.length > 0 ? (
                currentFAQs.map((faq, index) => (
                  <FAQItem
                    key={faq.id}
                    faq={faq}
                    index={index}
                    isExpanded={expandedItems.includes(faq.id)}
                    onToggle={() => toggleFAQ(faq.id)}
                    onHelpfulVote={(isHelpful: boolean) =>
                      handleHelpfulVote(faq.id, isHelpful)
                    }
                    helpfulVote={helpfulVotes[faq.id]}
                    highlightSearchTerm={highlightSearchTerm}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <HelpCircle
                    size={48}
                    className="mx-auto text-gray-300 mb-4"
                  />
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

          {/* Emergency Guide Sidebar (Desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-soft-lg p-6 border-2 border-red-100">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="text-red-600" size={24} />
                  <h3 className="text-lg font-bold text-gray-900">
                    Ghid Urgențe
                  </h3>
                </div>

                <div className="space-y-3">
                  {emergencyGuide.map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${item.bgColor}`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h4 className={`font-semibold ${item.color}`}>
                          {item.title}
                        </h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${item.bgColor} ${item.color} font-medium`}
                        >
                          {item.urgency}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {item.action}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <a
                    href="tel:+37361234555"
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-red-600 hover:to-red-700 transition-all"
                  >
                    <Phone size={18} />
                    <span>Urgențe 24/7</span>
                  </a>
                </div>
              </div>

              {/* Additional Resources */}
              <div className="mt-6 bg-gradient-to-br from-gold-50 to-white rounded-xl p-6 border border-gold-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen size={20} className="text-gold-600" />
                  Resurse Utile
                </h3>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gold-600 transition-colors"
                  >
                    <ChevronRight size={16} />
                    <span>Ghid Îngrijire Orală</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gold-600 transition-colors"
                  >
                    <ChevronRight size={16} />
                    <span>După Tratament</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gold-600 transition-colors"
                  >
                    <ChevronRight size={16} />
                    <span>Prețuri Orientative</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gold-600 transition-colors"
                  >
                    <ChevronRight size={16} />
                    <span>Blog Dental</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gold-50 to-teal-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Nu ai găsit răspunsul?</h3>
            <p className="text-gray-600 mb-6">
              Echipa noastră este aici să te ajute cu orice întrebare
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowAskQuestion(true)}
                className="btn-premium px-6 py-3 flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                <span>Întreabă-ne Direct</span>
              </button>
              <a
                href="tel:+37361234555"
                className="px-6 py-3 bg-white border-2 border-gold-500 text-gold-600 rounded-lg font-semibold hover:bg-gold-50 transition-all flex items-center justify-center gap-2"
              >
                <Phone size={20} />
                <span>Sună-ne</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Ask Question Button */}
      <button
        onClick={() => setShowAskQuestion(true)}
        className="fixed bottom-24 right-8 bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-full shadow-2xl hover:shadow-glow-lg transition-all hover-scale hidden md:flex items-center gap-2 z-30"
      >
        <HelpCircle size={24} />
        <span className="pr-2">Pune o Întrebare</span>
      </button>
    </section>
  );
};

// FAQ Item Component
const FAQItem: React.FC<FAQItemProps> = ({
  faq,
  index,
  isExpanded,
  onToggle,
  onHelpfulVote,
  helpfulVote,
  highlightSearchTerm,
}) => {
  return (
    <div
      className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
        isExpanded
          ? "border-gold-400 shadow-lg"
          : "border-gray-200 hover:border-gold-300"
      } ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-start justify-between text-left hover:bg-gold-50/50 transition-colors"
      >
        <div className="flex-1 pr-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2">
              {/* Popularity Badge */}
              <div className="flex items-center gap-1 bg-gold-100 px-2 py-1 rounded-full">
                <TrendingUp size={12} className="text-gold-600" />
                <span className="text-xs font-semibold text-gold-700">
                  {faq.popularity}%
                </span>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 flex-1">
              {highlightSearchTerm(faq.question)}
            </h3>
          </div>
        </div>
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isExpanded
              ? "bg-gold-500 text-white rotate-180"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {isExpanded ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>

      {/* Expandable Answer */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isExpanded ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-6 pb-6">
          <div className="pt-4 border-t border-gray-200">
            <p className="text-gray-700 leading-relaxed mb-4">
              {highlightSearchTerm(faq.answer)}
            </p>

            {/* Related Articles */}
            {faq.relatedArticles && faq.relatedArticles.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                  <FileText size={14} />
                  Articole Conexe:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {faq.relatedArticles.map((article: string, idx: number) => (
                    <a
                      key={idx}
                      href="#"
                      className="text-sm text-gold-600 hover:text-gold-700 hover:underline flex items-center gap-1"
                    >
                      <ChevronRight size={12} />
                      {article}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Helpful Feedback */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  A fost util acest răspuns?
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onHelpfulVote(true)}
                    className={`p-2 rounded-lg transition-all ${
                      helpfulVote === true
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600"
                    }`}
                  >
                    <ThumbsUp size={16} />
                  </button>
                  <button
                    onClick={() => onHelpfulVote(false)}
                    className={`p-2 rounded-lg transition-all ${
                      helpfulVote === false
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                    }`}
                  >
                    <ThumbsDown size={16} />
                  </button>
                </div>
              </div>
              {helpfulVote !== undefined && (
                <span className="text-sm text-gray-500">
                  Mulțumim pentru feedback!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
