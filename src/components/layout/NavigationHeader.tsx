"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  Calendar,
  Globe,
  Sparkles,
  MapPin,
  Clock,
  Mail,
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Navigation Items
  const navItems: NavItem[] = [
    { id: "home", label: "Acasă", href: "#home" },
    { id: "despre-noi", label: "Despre Noi", href: "#despre-noi" },
    {
      id: "servicii",
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
        {
          label: "Terapie Dentară",
          href: "#terapie",
          description: "Tratamente complete pentru sănătatea dinților",
        },
        {
          label: "Endodonție",
          href: "#endodontie",
          description: "Salvarea dinților prin tratamente de canal",
        },
      ],
    },
    { id: "echipa", label: "Echipa", href: "#echipa" },
    { id: "testimoniale", label: "Testimoniale", href: "#testimoniale" },
    { id: "contact", label: "Contact", href: "#contact" },
  ];

  // Languages
  const languages: Language[] = [
    { code: "RO", label: "Română", flag: "🇷🇴" },
    { code: "RU", label: "Русский", flag: "🇷🇺" },
    { code: "EN", label: "English", flag: "🇬🇧" },
  ];

  // Contact info for mobile
  const contactInfo = {
    phone: "+373 61 234 555",
    email: "tandemdent22@gmail.com",
    address: "Strada Nicolae Zelinski 5/8, Chișinău",
    schedule: "Luni-Vineri: 9:00-18:00",
  };

  // Handle scroll effects with proper offset calculation
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Calculate scroll progress
      const progress = (scrollPosition / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));

      // Set scrolled state with debounce
      setIsScrolled(scrollPosition > 20);

      // Update active section based on scroll position with proper offset
      const offset = headerRef.current?.offsetHeight || 80;

      const sections = navItems.map((item) => item.id);
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollPosition;
          const elementBottom = elementTop + rect.height;

          // Check if the scroll position is within the section bounds
          return (
            scrollPosition >= elementTop - offset - 100 &&
            scrollPosition < elementBottom - offset
          );
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    // Add passive listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isMobileMenuOpen]);

  // Close dropdowns when clicking outside
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

  // Handle smooth scroll to section with proper offset
  const handleScrollToSection = (href: string) => {
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      const offset = headerRef.current?.offsetHeight || 80;
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
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-[60]"
        aria-hidden="true"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-gold-500 to-gold-600"
          style={{ width: `${scrollProgress}%` }}
          transition={{ ease: "linear", duration: 0.1 }}
        />
      </div>

      {/* Main Navigation with proper positioning */}
      <motion.header
        ref={headerRef}
        className="fixed top-1 left-0 right-0 z-50 w-full"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <nav
          ref={navRef}
          className={`relative transition-all duration-300 ${
            isScrolled
              ? "bg-white/95 backdrop-blur-xl shadow-soft"
              : "bg-transparent"
          }`}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              {/* Logo - Responsive sizing */}
              <motion.div
                className="flex items-center flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Link href="/" aria-label="Tandem Dent - Acasă">
                  <Image
                    src="/images/logo/logo.png"
                    alt="Tandem Dent Logo"
                    width="56"
                    height="56"
                    className="object-contain"
                    priority
                  />
                </Link>
              </motion.div>

              {/* Desktop Navigation - Hidden on tablets and below */}
              <div className="hidden xl:flex items-center gap-6 lg:gap-8">
                {/* Nav Items */}
                <ul className="flex items-center gap-4 lg:gap-6" role="menubar">
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
                        className={`relative py-2 font-medium text-sm lg:text-base transition-all duration-300 flex items-center gap-1 ${
                          activeSection === item.id
                            ? isScrolled
                              ? "text-gold-600"
                              : "text-gold-400"
                            : isScrolled
                            ? "text-gray-700 hover:text-gold-600"
                            : "text-white/90 hover:text-white"
                        }`}
                        role="menuitem"
                        aria-current={
                          activeSection === item.id ? "page" : undefined
                        }
                        tabIndex={0}
                        onKeyDown={(e) =>
                          handleKeyDown(e, () =>
                            handleScrollToSection(item.href)
                          )
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
                              className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                            >
                              <div className="max-h-[400px] overflow-y-auto">
                                {item.subItems.map((subItem, index) => (
                                  <button
                                    key={index}
                                    onClick={() =>
                                      handleScrollToSection(subItem.href)
                                    }
                                    className="w-full px-4 py-3 text-left hover:bg-gold-50 transition-colors group"
                                  >
                                    <div className="font-medium text-gray-900 group-hover:text-gold-600">
                                      {subItem.label}
                                    </div>
                                    {subItem.description && (
                                      <div className="text-xs text-gray-600 mt-1">
                                        {subItem.description}
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Contact Info - Responsive */}
                <div className="hidden lg:flex items-center gap-4 xl:gap-6">
                  {/* Phone Number */}
                  <a
                    href="tel:+37361234555"
                    className={`flex items-center gap-2 font-medium transition-colors ${
                      isScrolled
                        ? "text-gray-700 hover:text-gold-600"
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
                      onClick={() =>
                        setShowLanguageDropdown(!showLanguageDropdown)
                      }
                      className={`flex items-center gap-1 px-2 lg:px-3 py-1.5 rounded-lg transition-all ${
                        isScrolled
                          ? "text-gray-600 hover:bg-gray-100"
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
                          className="absolute top-full right-0 mt-2 w-36 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden"
                        >
                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setSelectedLanguage(lang.code);
                                setShowLanguageDropdown(false);
                              }}
                              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                                selectedLanguage === lang.code
                                  ? "bg-gold-50 text-gold-600"
                                  : "text-gray-700"
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
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden lg:flex btn-premium px-4 xl:px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-glow transition-all items-center gap-2"
                  onClick={() => handleScrollToSection("#contact")}
                  aria-label="Programează o consultație"
                >
                  <Calendar size={18} />
                  <span className="hidden xl:inline">Programare</span>
                </motion.button>
              </div>

              {/* Tablet Menu (Medium devices) */}
              <div className="hidden md:flex xl:hidden items-center gap-4">
                <a
                  href="tel:+37361234555"
                  className={`flex items-center gap-2 font-medium transition-colors ${
                    isScrolled
                      ? "text-gray-700 hover:text-gold-600"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  <Phone size={18} />
                </a>
                <button
                  onClick={() => handleScrollToSection("#contact")}
                  className="btn-premium px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg font-semibold shadow-lg"
                >
                  <Calendar size={18} />
                </button>
              </div>

              {/* Mobile/Tablet Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`xl:hidden p-2 rounded-lg transition-colors ${
                  isScrolled
                    ? "text-gray-700 hover:bg-gray-100"
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
        </nav>
      </motion.header>

      {/* Mobile/Tablet Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 xl:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel - Responsive width */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-96 md:w-[400px] bg-white z-50 xl:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3"
                  >
                    <div className="relative w-10 h-10">
                      <Image
                        src="/images/logo/logo.png"
                        alt="Tandem Dent Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Închide meniul"
                  >
                    <X size={24} className="text-gray-700" />
                  </button>
                </div>

                {/* Mobile Nav Items - Scrollable */}
                <nav className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
                  <ul className="space-y-2">
                    {navItems.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => handleScrollToSection(item.href)}
                          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                            activeSection === item.id
                              ? "bg-gold-50 text-gold-600"
                              : "text-gray-700 hover:bg-gray-50"
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
                                className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gold-600 hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                {subItem.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* Mobile Contact Info */}
                  <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
                    <a
                      href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-3 text-gray-700 hover:text-gold-600 transition-colors"
                    >
                      <Phone size={20} />
                      <div>
                        <div className="text-xs text-gray-500">Sunați-ne</div>
                        <div className="font-semibold">{contactInfo.phone}</div>
                      </div>
                    </a>

                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="flex items-center gap-3 text-gray-700 hover:text-gold-600 transition-colors"
                    >
                      <Mail size={20} />
                      <div>
                        <div className="text-xs text-gray-500">Email</div>
                        <div className="text-sm break-all">
                          {contactInfo.email}
                        </div>
                      </div>
                    </a>

                    <div className="flex items-start gap-3 text-gray-700">
                      <MapPin size={20} className="flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-xs text-gray-500">Adresă</div>
                        <div className="text-sm">{contactInfo.address}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-gray-700">
                      <Clock size={20} className="flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-xs text-gray-500">Program</div>
                        <div className="text-sm">{contactInfo.schedule}</div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Language Switcher */}
                  <div className="mt-6">
                    <div className="text-sm text-gray-500 mb-3">Limba</div>
                    <div className="grid grid-cols-3 gap-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setSelectedLanguage(lang.code)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedLanguage === lang.code
                              ? "bg-gold-100 text-gold-600"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {lang.flag} {lang.code}
                        </button>
                      ))}
                    </div>
                  </div>
                </nav>

                {/* Mobile CTA - Sticky bottom */}
                <div className="p-4 sm:p-6 border-t border-gray-200 bg-white">
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
