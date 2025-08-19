"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  Calendar,
  Globe,
  Sparkles,
} from "lucide-react";

// Types
interface NavItem {
  id: string;
  label: string;
  href: string;
  subItems?: SubNavItem[];
}

interface SubNavItem {
  label: string;
  href: string;
  description?: string;
}

interface Language {
  code: string;
  label: string;
  flag?: string;
}

const NavigationHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("RO");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  // Navigation Items
  const navItems: NavItem[] = [
    { id: "home", label: "Acasă", href: "#home" },
    { id: "about", label: "Despre Noi", href: "#despre-noi" },
    {
      id: "services",
      label: "Servicii",
      href: "#servicii",
      subItems: [
        {
          label: "Implantologie",
          href: "#implantologie",
          description: "Soluții permanente pentru dinți lipsă",
        },
        {
          label: "Ortodonție",
          href: "#ortodontie",
          description: "Aliniere perfectă cu Invisalign",
        },
        {
          label: "Estetică Dentară",
          href: "#estetica",
          description: "Pentru un zâmbet perfect",
        },
        {
          label: "Chirurgie Orală",
          href: "#chirurgie",
          description: "Intervenții sigure și moderne",
        },
      ],
    },
    { id: "team", label: "Echipa", href: "#echipa" },
    { id: "contact", label: "Contact", href: "#contact" },
  ];

  // Languages
  const languages: Language[] = [
    { code: "RO", label: "Română", flag: "🇷🇴" },
    { code: "RU", label: "Русский", flag: "🇷🇺" },
    { code: "EN", label: "English", flag: "🇬🇧" },
  ];

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);

      // Update active section based on scroll position
      const sections = navItems.map((item) => item.id);
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle smooth scroll to section
  const handleScrollToSection = (href: string) => {
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      const offset = 80; // Height of sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  };

  return (
    <>
      <motion.nav
        ref={navRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-soft"
            : "bg-transparent"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link
                href="/"
                className="flex items-center gap-2 group"
                aria-label="Tandem Dent - Acasă"
              >
                <div className="relative">
                  <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                    <span className="text-white font-bold text-xl">T</span>
                  </div>
                </div>
                <div>
                  <span
                    className={`font-bold text-xl ${
                      isScrolled
                        ? "text-gray-900 dark:text-white"
                        : "text-white"
                    } transition-colors duration-300`}
                  >
                    Tandem Dent
                  </span>
                  <span
                    className={`block text-xs ${
                      isScrolled
                        ? "text-gray-600 dark:text-gray-400"
                        : "text-white/80"
                    } transition-colors duration-300`}
                  >
                    Zâmbete Sănătoase
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Nav Items */}
              <ul className="flex items-center gap-6" role="menubar">
                {navItems.map((item) => (
                  <li
                    key={item.id}
                    role="none"
                    className="relative"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <button
                      onClick={() => handleScrollToSection(item.href)}
                      className={`relative py-2 font-medium transition-all duration-300 flex items-center gap-1 ${
                        activeSection === item.id
                          ? isScrolled
                            ? "text-gold-600"
                            : "text-gold-400"
                          : isScrolled
                          ? "text-gray-700 hover:text-gold-600 dark:text-gray-300 dark:hover:text-gold-400"
                          : "text-white/90 hover:text-white"
                      }`}
                      role="menuitem"
                      aria-current={
                        activeSection === item.id ? "page" : undefined
                      }
                      tabIndex={0}
                      onKeyDown={(e) =>
                        handleKeyDown(e, () => handleScrollToSection(item.href))
                      }
                    >
                      {item.label}
                      {item.subItems && (
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-300 ${
                            hoveredItem === item.id ? "rotate-180" : ""
                          }`}
                        />
                      )}
                      {activeSection === item.id && (
                        <motion.div
                          layoutId="activeSection"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-500 to-gold-600"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </button>

                    {/* Dropdown for sub-items */}
                    {item.subItems && (
                      <AnimatePresence>
                        {hoveredItem === item.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                          >
                            {item.subItems.map((subItem, index) => (
                              <button
                                key={index}
                                onClick={() =>
                                  handleScrollToSection(subItem.href)
                                }
                                className="w-full px-4 py-3 text-left hover:bg-gold-50 dark:hover:bg-gold-900/20 transition-colors group"
                              >
                                <div className="font-medium text-gray-900 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400">
                                  {subItem.label}
                                </div>
                                {subItem.description && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {subItem.description}
                                  </div>
                                )}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </li>
                ))}
              </ul>

              {/* Phone Number */}
              <a
                href="tel:+37361234555"
                className={`flex items-center gap-2 font-medium transition-colors ${
                  isScrolled
                    ? "text-gray-700 hover:text-gold-600 dark:text-gray-300 dark:hover:text-gold-400"
                    : "text-white/90 hover:text-white"
                }`}
                aria-label="Sunați la +373 61 234 555"
              >
                <Phone size={16} />
                <span className="text-sm">061 234 555</span>
              </a>

              {/* Language Switcher */}
              <div className="relative" ref={languageRef}>
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                    isScrolled
                      ? "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                  aria-label="Selectare limbă"
                  aria-expanded={showLanguageDropdown}
                >
                  <Globe size={16} />
                  <span className="text-sm font-medium">
                    {selectedLanguage}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      showLanguageDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {showLanguageDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setSelectedLanguage(lang.code);
                            setShowLanguageDropdown(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 ${
                            selectedLanguage === lang.code
                              ? "bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-premium px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-glow transition-all flex items-center gap-2"
                onClick={() => handleScrollToSection("#contact")}
                aria-label="Programează o consultație"
              >
                <Calendar size={18} />
                <span>Programare</span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label={
                isMobileMenuOpen ? "Închide meniul" : "Deschide meniul"
              }
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xl">T</span>
                    </div>
                    <span className="font-bold text-xl text-gray-900 dark:text-white">
                      Tandem Dent
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Închide meniul"
                  >
                    <X size={24} className="text-gray-700 dark:text-gray-300" />
                  </button>
                </div>

                {/* Mobile Nav Items */}
                <nav className="flex-1 px-6 py-8">
                  <ul className="space-y-2">
                    {navItems.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => handleScrollToSection(item.href)}
                          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                            activeSection === item.id
                              ? "bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          {item.label}
                        </button>
                        {item.subItems && (
                          <div className="ml-4 mt-2 space-y-1">
                            {item.subItems.map((subItem, index) => (
                              <button
                                key={index}
                                onClick={() =>
                                  handleScrollToSection(subItem.href)
                                }
                                className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                              >
                                {subItem.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* Mobile Phone */}
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <a
                      href="tel:+37361234555"
                      className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
                    >
                      <Phone size={20} />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Sunați-ne
                        </div>
                        <div className="font-semibold">061 234 555</div>
                      </div>
                    </a>
                  </div>

                  {/* Mobile Language Switcher */}
                  <div className="mt-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Limba
                    </div>
                    <div className="flex gap-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setSelectedLanguage(lang.code)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedLanguage === lang.code
                              ? "bg-gold-100 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {lang.flag} {lang.code}
                        </button>
                      ))}
                    </div>
                  </div>
                </nav>

                {/* Mobile CTA */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleScrollToSection("#contact")}
                    className="w-full btn-premium py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg font-semibold shadow-lg flex items-center justify-center gap-2"
                  >
                    <Calendar size={20} />
                    <span>Programează Consultație</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationHeader;
