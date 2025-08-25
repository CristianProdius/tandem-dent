"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  Phone,
  ChevronDown,
  Calendar,
  Globe,
  MapPin,
  Clock,
  Mail,
  ArrowRight,
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
  icon?: React.ReactNode;
}

interface Language {
  code: string;
  label: string;
  flag?: string;
}

const NavigationHeader: React.FC = () => {
  // Track if we're on the client and ready for animations
  const [mounted, setMounted] = useState(false);

  // Core states
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("RO");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [mobileMenuStage, setMobileMenuStage] = useState(0);

  // Refs
  const navRef = useRef<HTMLElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Navigation Items with enhanced descriptions
  const navItems = useMemo<NavItem[]>(
    () => [
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
            icon: <Sparkles size={16} className="text-gold-500" />,
          },
          {
            label: "Ortodonție",
            href: "#ortodontie",
            description: "Aliniere perfectă cu Invisalign",
            icon: <Sparkles size={16} className="text-gold-500" />,
          },
          {
            label: "Estetică Dentară",
            href: "#estetica",
            description: "Pentru un zâmbet perfect",
            icon: <Sparkles size={16} className="text-gold-500" />,
          },
          {
            label: "Chirurgie Orală",
            href: "#chirurgie",
            description: "Intervenții sigure și moderne",
            icon: <Sparkles size={16} className="text-gold-500" />,
          },
          {
            label: "Terapie Dentară",
            href: "#terapie",
            description: "Tratamente complete pentru sănătatea dinților",
            icon: <Sparkles size={16} className="text-gold-500" />,
          },
          {
            label: "Endodonție",
            href: "#endodontie",
            description: "Salvarea dinților prin tratamente de canal",
            icon: <Sparkles size={16} className="text-gold-500" />,
          },
        ],
      },
      { id: "echipa", label: "Echipa", href: "#echipa" },
      { id: "testimoniale", label: "Testimoniale", href: "#testimoniale" },
      { id: "contact", label: "Contact", href: "#contact" },
    ],
    []
  );

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

  // Mount effect - enable animations after hydration
  useEffect(() => {
    setMounted(true);
    // Trigger header animation after mount
    setTimeout(() => setHeaderVisible(true), 100);
  }, []);

  // Handle mobile menu animation stages
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Stagger the animation stages
      setTimeout(() => setMobileMenuStage(1), 50);
      setTimeout(() => setMobileMenuStage(2), 150);
      setTimeout(() => setMobileMenuStage(3), 250);
    } else {
      setMobileMenuStage(0);
    }
  }, [isMobileMenuOpen]);

  // Handle scroll effects
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Set scrolled state with premium threshold
      setIsScrolled(scrollPosition > 50);

      // Update active section
      const offset = 100;
      const sections = navItems.map((item) => item.id);

      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollPosition;
          const elementBottom = elementTop + rect.height;

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

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted, navItems]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (!mounted) return;

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, mounted]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    if (!mounted) return;

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
  }, [mounted]);

  // Handle smooth scroll to section
  const handleScrollToSection = (href: string) => {
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

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
      {/* Main Navigation with Premium Glass Effect */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-700 ${
          mounted && headerVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav
          ref={navRef}
          className={`relative transition-all duration-500 ${
            isScrolled
              ? "bg-white/90 backdrop-blur-2xl shadow-2xl border-b border-gray-100"
              : "bg-gradient-to-b from-black/40 to-transparent backdrop-blur-sm"
          }`}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Premium gradient overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-r from-gold-500/5 via-transparent to-gold-500/5 opacity-50 pointer-events-none transition-opacity duration-500 ${
              isScrolled ? "opacity-100" : "opacity-0"
            }`}
          />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20 sm:h-24">
              {/* Enhanced Logo with Animation */}
              <div
                className={`flex items-center flex-shrink-0 transition-all duration-500 ${
                  mounted ? "hover:scale-110" : ""
                } ${isScrolled ? "scale-100" : "scale-110"}`}
              >
                <Link
                  href="/"
                  aria-label="Tandem Dent - Acasă"
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-400/20 to-gold-600/20 blur-xl group-hover:blur-2xl transition-all duration-500 rounded-full" />
                  <Image
                    src="/images/logo/logo.png"
                    alt="Tandem Dent Logo"
                    width={120}
                    height={80}
                    className="object-contain relative z-10"
                    priority
                  />
                </Link>
              </div>

              {/* Desktop Navigation with Premium Effects */}
              <div className="hidden xl:flex items-center gap-8">
                <ul className="flex items-center gap-6 lg:gap-8" role="menubar">
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
                        className={`relative py-3 font-medium text-sm lg:text-base transition-all duration-300 flex items-center gap-2 group ${
                          activeSection === item.id
                            ? isScrolled
                              ? "text-gold-600"
                              : "text-gold-300"
                            : isScrolled
                            ? "text-gray-700 hover:text-gold-600"
                            : "text-white hover:text-gold-300"
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
                        <span className="relative">
                          {item.label}
                          {/* Premium hover effect */}
                          <span
                            className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-gold-400 to-gold-600 transform origin-left transition-transform duration-300 ${
                              hoveredItem === item.id ||
                              activeSection === item.id
                                ? "scale-x-100"
                                : "scale-x-0"
                            }`}
                          />
                        </span>
                        {item.subItems && (
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 ${
                              hoveredItem === item.id ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>

                      {/* Premium Dropdown with Enhanced Styling */}
                      {item.subItems && hoveredItem === item.id && (
                        <div
                          className={`absolute top-full left-0 mt-4 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
                            mounted
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 -translate-y-4"
                          }`}
                        >
                          <div className="p-2">
                            {item.subItems.map((subItem, index) => (
                              <button
                                key={index}
                                onClick={() =>
                                  handleScrollToSection(subItem.href)
                                }
                                className="w-full px-4 py-3 text-left rounded-xl hover:bg-gradient-to-r hover:from-gold-50 hover:to-gold-100/50 transition-all duration-300 group flex items-start gap-3"
                              >
                                {subItem.icon && (
                                  <span className="mt-1">{subItem.icon}</span>
                                )}
                                <div>
                                  <div className="font-medium text-gray-900 group-hover:text-gold-600 transition-colors">
                                    {subItem.label}
                                  </div>
                                  {subItem.description && (
                                    <div className="text-sm text-gray-500 mt-0.5">
                                      {subItem.description}
                                    </div>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Premium Language Switcher */}
                <div className="relative" ref={languageRef}>
                  <button
                    onClick={() =>
                      setShowLanguageDropdown(!showLanguageDropdown)
                    }
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                      isScrolled
                        ? "hover:bg-gray-100 text-gray-700"
                        : "hover:bg-white/10 text-white backdrop-blur-sm"
                    }`}
                    aria-label="Schimbă limba"
                    aria-expanded={showLanguageDropdown}
                  >
                    <Globe size={20} />
                    <span className="text-sm font-medium">
                      {selectedLanguage}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${
                        showLanguageDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Premium Language Dropdown */}
                  {showLanguageDropdown && (
                    <div
                      className={`absolute top-full right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-100 py-2 min-w-[180px] transition-all duration-300 ${
                        mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
                      }`}
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setSelectedLanguage(lang.code);
                            setShowLanguageDropdown(false);
                          }}
                          className={`w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-gold-50 hover:to-transparent transition-all duration-300 flex items-center gap-3 ${
                            selectedLanguage === lang.code ? "bg-gold-50" : ""
                          }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span className="text-sm font-medium">
                            {lang.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Premium Desktop CTA Buttons */}
                <div className="flex items-center gap-4">
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                      isScrolled
                        ? "hover:bg-gray-100 text-gray-700"
                        : "hover:bg-white/10 text-white backdrop-blur-sm"
                    }`}
                    aria-label="Sună acum"
                  >
                    <Phone size={20} />
                    <span className="hidden lg:inline">
                      {contactInfo.phone}
                    </span>
                  </a>

                  <button
                    onClick={() => handleScrollToSection("#contact")}
                    className="group relative px-6 py-3 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-600 transition-all duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-r from-gold-600 to-gold-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center gap-2">
                      <Calendar size={20} />
                      <span>Programează</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Premium Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`xl:hidden relative p-3 rounded-xl transition-all duration-300 ${
                  isScrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-white/10 backdrop-blur-sm"
                }`}
                aria-label={
                  isMobileMenuOpen ? "Închide meniul" : "Deschide meniul"
                }
                aria-expanded={isMobileMenuOpen}
              >
                <div className="relative w-6 h-6">
                  <span
                    className={`absolute top-0 left-0 w-6 h-0.5 ${
                      isScrolled ? "bg-gray-700" : "bg-white"
                    } transition-all duration-300 ${
                      isMobileMenuOpen ? "rotate-45 top-[11px]" : ""
                    }`}
                  />
                  <span
                    className={`absolute top-[11px] left-0 w-6 h-0.5 ${
                      isScrolled ? "bg-gray-700" : "bg-white"
                    } transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`absolute bottom-0 left-0 w-6 h-0.5 ${
                      isScrolled ? "bg-gray-700" : "bg-white"
                    } transition-all duration-300 ${
                      isMobileMenuOpen ? "-rotate-45 bottom-[11px]" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Premium Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Premium Backdrop with Blur */}
          <div
            className={`fixed inset-0 bg-black/60 backdrop-blur-md z-40 xl:hidden transition-all duration-500 ${
              mobileMenuStage >= 1 ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Premium Mobile Menu Panel */}
          <div
            className={`fixed right-0 top-0 bottom-0 w-full sm:w-96 md:w-[420px] bg-white z-50 xl:hidden overflow-hidden transition-all duration-500 ease-out ${
              mobileMenuStage >= 2 ? "translate-x-0" : "translate-x-full"
            }`}
            style={{
              boxShadow:
                mobileMenuStage >= 2 ? "-10px 0 40px rgba(0,0,0,0.1)" : "none",
            }}
          >
            <div className="flex flex-col h-full bg-gradient-to-br from-white via-gray-50/30 to-gold-50/20">
              {/* Premium Mobile Menu Header */}
              <div
                className={`flex items-center justify-between p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm transition-all duration-500 delay-100 ${
                  mobileMenuStage >= 3
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4"
                }`}
              >
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="transform hover:scale-105 transition-transform"
                >
                  <Image
                    src="/images/logo/logo.png"
                    alt="Tandem Dent Logo"
                    width={100}
                    height={70}
                    className="object-contain"
                  />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 rounded-xl hover:bg-gray-100 transition-all duration-300 group"
                  aria-label="Închide meniul"
                >
                  <X
                    size={24}
                    className="text-gray-700 group-hover:rotate-90 transition-transform duration-300"
                  />
                </button>
              </div>

              {/* Premium Mobile Nav Items with Staggered Animation */}
              <nav className="flex-1 overflow-y-auto px-6 py-8">
                <ul className="space-y-3">
                  {navItems.map((item, itemIndex) => (
                    <li
                      key={item.id}
                      className={`transition-all duration-500 ${
                        mobileMenuStage >= 3
                          ? `opacity-100 translate-x-0`
                          : "opacity-0 translate-x-8"
                      }`}
                      style={{
                        transitionDelay:
                          mobileMenuStage >= 3
                            ? `${200 + itemIndex * 60}ms`
                            : "0ms",
                      }}
                    >
                      <button
                        onClick={() => handleScrollToSection(item.href)}
                        className={`w-full text-left px-5 py-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-between group ${
                          activeSection === item.id
                            ? "bg-gradient-to-r from-gold-100 to-gold-50 text-gold-700 shadow-lg"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-base">{item.label}</span>
                        <ArrowRight
                          size={18}
                          className={`transition-all duration-300 ${
                            activeSection === item.id
                              ? "translate-x-1 text-gold-600"
                              : "text-gray-400 group-hover:translate-x-1"
                          }`}
                        />
                      </button>

                      {/* Premium Mobile Subitems */}
                      {item.subItems && (
                        <ul className="ml-4 mt-2 space-y-1">
                          {item.subItems.map((subItem, index) => (
                            <li key={index}>
                              <button
                                onClick={() =>
                                  handleScrollToSection(subItem.href)
                                }
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:text-gold-600 hover:bg-gold-50/50 rounded-lg transition-all duration-300 flex items-center gap-2"
                              >
                                <span className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
                                {subItem.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Premium Mobile Contact Info */}
                <div
                  className={`mt-10 space-y-6 transition-all duration-500 ${
                    mobileMenuStage >= 3
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    transitionDelay: mobileMenuStage >= 3 ? "600ms" : "0ms",
                  }}
                >
                  <div className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles size={16} className="text-gold-500" />
                    Contact Rapid
                  </div>

                  <div className="space-y-4">
                    <a
                      href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                      className="flex items-start gap-4 text-gray-700 hover:text-gold-600 transition-all duration-300 p-3 rounded-xl hover:bg-gold-50/50"
                    >
                      <div className="p-2 bg-gold-100 rounded-lg">
                        <Phone size={20} className="text-gold-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">
                          Telefon
                        </div>
                        <div className="text-base font-semibold mt-1">
                          {contactInfo.phone}
                        </div>
                      </div>
                    </a>

                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="flex items-start gap-4 text-gray-700 hover:text-gold-600 transition-all duration-300 p-3 rounded-xl hover:bg-gold-50/50"
                    >
                      <div className="p-2 bg-gold-100 rounded-lg">
                        <Mail size={20} className="text-gold-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">
                          Email
                        </div>
                        <div className="text-base mt-1">
                          {contactInfo.email}
                        </div>
                      </div>
                    </a>

                    <div className="flex items-start gap-4 text-gray-700 p-3">
                      <div className="p-2 bg-gold-100 rounded-lg">
                        <MapPin size={20} className="text-gold-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">
                          Adresă
                        </div>
                        <div className="text-base mt-1">
                          {contactInfo.address}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 text-gray-700 p-3">
                      <div className="p-2 bg-gold-100 rounded-lg">
                        <Clock size={20} className="text-gold-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">
                          Program
                        </div>
                        <div className="text-base mt-1">
                          {contactInfo.schedule}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Premium Mobile Language Switcher */}
                  <div className="mt-8">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                      Selectează Limba
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setSelectedLanguage(lang.code)}
                          className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                            selectedLanguage === lang.code
                              ? "bg-gradient-to-r from-gold-100 to-gold-50 text-gold-700 shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span className="block mt-1 text-xs">
                            {lang.code}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </nav>

              {/* Premium Mobile CTA */}
              <div
                className={`p-6 border-t border-gray-100 bg-white/80 backdrop-blur-sm transition-all duration-500 ${
                  mobileMenuStage >= 3
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: mobileMenuStage >= 3 ? "700ms" : "0ms",
                }}
              >
                <button
                  onClick={() => handleScrollToSection("#contact")}
                  className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group"
                >
                  <Calendar
                    size={20}
                    className="group-hover:rotate-12 transition-transform duration-300"
                  />
                  <span>Programează Consultație</span>
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NavigationHeader;
