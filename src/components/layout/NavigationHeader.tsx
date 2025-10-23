"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  ChevronDown,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useClinicInfo } from "@/hooks";
import { MobileMenu } from "./MobileMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";

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

const NavigationHeader: React.FC = () => {
  const clinicInfo = useClinicInfo();

  // Track if we're on the client and ready for animations
  const [mounted, setMounted] = useState(false);

  // Core states
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  // Refs
  const navRef = useRef<HTMLElement>(null);
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
            label: "Terapie Dentară",
            href: "#terapie-dentara",
            description: "Tratamente complete pentru sănătatea dinților",
            icon: <Sparkles size={16} className="text-gold-500" />,
          },
          {
            label: "Ortopedie Dentară",
            href: "#ortopedie-dentara",
            description: "Restaurări complete și funcționale",
            icon: <Sparkles size={16} className="text-gold-500" />,
          },
          {
            label: "Ortodonție",
            href: "#ortodontie",
            description: "Aliniere perfectă cu Invisalign",
            icon: <Sparkles size={16} className="text-gold-500" />,
          },
          {
            label: "Implantologie",
            href: "#implantologie",
            description: "Soluții permanente pentru dinți lipsă",
            icon: <Sparkles size={16} className="text-gold-500" />,
          },
          {
            label: "Chirurgie Orală",
            href: "#chirurgie-orala",
            description: "Intervenții sigure și moderne",
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

  // Mount effect - enable animations after hydration
  useEffect(() => {
    setMounted(true);
    // Trigger header animation after mount
    setTimeout(() => setHeaderVisible(true), 100);
  }, []);

  // Handle scroll effects
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Set scrolled state - switch to solid white after scrolling past hero section
      // Hero sections are typically viewport height, check after ~70% of viewport
      const heroThreshold = window.innerHeight * 0.7;
      setIsScrolled(scrollPosition > heroThreshold);

      // Update active section
      const offset = 100;
      const sections = navItems.map((item) => item.id);

      // If we're at the top of the page (first 100px), always set to home
      if (scrollPosition < 100) {
        setActiveSection("home");
        return;
      }

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
              ? "bg-white shadow-lg border-b border-gray-100"
              : "bg-gradient-to-b from-black/30 to-transparent"
          }`}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Premium gradient overlay - only show when scrolled */}
          {isScrolled && (
            <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-transparent to-gold-500/5 pointer-events-none" />
          )}

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

                {/* Language Switcher */}
                <LanguageSwitcher isScrolled={isScrolled} />

                {/* Premium Desktop CTA Buttons */}
                <div className="flex items-center gap-4">
                  <a
                    href={clinicInfo.phone.href}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                      isScrolled
                        ? "hover:bg-gray-100 text-gray-700"
                        : "hover:bg-white/10 text-white"
                    }`}
                    aria-label="Sună acum"
                  >
                    <Phone size={20} />
                    <span className="hidden lg:inline">
                      {clinicInfo.phone.main}
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
                    : "text-white hover:bg-white/10"
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

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        activeSection={activeSection}
        onNavigate={handleScrollToSection}
      />
    </>
  );
};

export default NavigationHeader;
