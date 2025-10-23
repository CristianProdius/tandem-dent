"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useClinicInfo } from "@/hooks";

interface NavItem {
  id: string;
  label: string;
  href: string;
  subItems?: SubNavItem[];
}

interface SubNavItem {
  label: string;
  href: string;
}

interface Language {
  code: string;
  label: string;
  flag: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  activeSection: string;
  onNavigate: (href: string) => void;
}

const languages: Language[] = [
  { code: "RO", label: "Română", flag: "🇷🇴" },
  { code: "RU", label: "Русский", flag: "🇷🇺" },
  { code: "EN", label: "English", flag: "🇬🇧" },
];

/**
 * Mobile menu component
 * Extracted from NavigationHeader to reduce complexity
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navItems,
  activeSection,
  onNavigate,
}) => {
  const clinicInfo = useClinicInfo();
  const [mobileMenuStage, setMobileMenuStage] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("RO");

  // Handle menu animation stages
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setMobileMenuStage(1), 50);
      setTimeout(() => setMobileMenuStage(2), 150);
      setTimeout(() => setMobileMenuStage(3), 250);
    } else {
      setMobileMenuStage(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-40 xl:hidden transition-all duration-500 ${
          mobileMenuStage >= 1 ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Menu Panel */}
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
          {/* Header */}
          <div
            className={`flex items-center justify-between p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm transition-all duration-500 delay-100 ${
              mobileMenuStage >= 3
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            <Link
              href="/"
              onClick={onClose}
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
              onClick={onClose}
              className="p-3 rounded-xl hover:bg-gray-100 transition-all duration-300 group"
              aria-label="Închide meniul"
            >
              <X
                size={24}
                className="text-gray-700 group-hover:rotate-90 transition-transform duration-300"
              />
            </button>
          </div>

          {/* Navigation Items */}
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
                      mobileMenuStage >= 3 ? `${200 + itemIndex * 60}ms` : "0ms",
                  }}
                >
                  <button
                    onClick={() => onNavigate(item.href)}
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

                  {/* Subitems */}
                  {item.subItems && (
                    <ul className="ml-4 mt-2 space-y-1">
                      {item.subItems.map((subItem, index) => (
                        <li key={index}>
                          <button
                            onClick={() => onNavigate(subItem.href)}
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

            {/* Contact Info */}
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
                  href={clinicInfo.phone.href}
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
                      {clinicInfo.phone.main}
                    </div>
                  </div>
                </a>

                <a
                  href={clinicInfo.email.href}
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
                      {clinicInfo.email.address}
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
                      {clinicInfo.address.full}
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
                      {clinicInfo.schedule.display}
                    </div>
                  </div>
                </div>
              </div>

              {/* Language Switcher */}
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
                      <span className="block mt-1 text-xs">{lang.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* CTA Button */}
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
              onClick={() => onNavigate("#contact")}
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
  );
};
