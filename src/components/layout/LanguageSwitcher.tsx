"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";

interface Language {
  code: string;
  label: string;
  flag: string;
}

interface LanguageSwitcherProps {
  isScrolled?: boolean;
  className?: string;
}

const languages: Language[] = [
  { code: "RO", label: "Română", flag: "🇷🇴" },
  { code: "RU", label: "Русский", flag: "🇷🇺" },
  { code: "EN", label: "English", flag: "🇬🇧" },
];

/**
 * Reusable language switcher component
 * Extracted from NavigationHeader to reduce complexity
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  isScrolled = false,
  className = "",
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState("RO");
  const [showDropdown, setShowDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!mounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mounted]);

  return (
    <div className={`relative ${className}`} ref={languageRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
          isScrolled
            ? "hover:bg-gray-100 text-gray-700"
            : "hover:bg-white/10 text-white backdrop-blur-sm"
        }`}
        aria-label="Schimbă limba"
        aria-expanded={showDropdown}
      >
        <Globe size={20} />
        <span className="text-sm font-medium">{selectedLanguage}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            showDropdown ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {showDropdown && (
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
                setShowDropdown(false);
              }}
              className={`w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-gold-50 hover:to-transparent transition-all duration-300 flex items-center gap-3 ${
                selectedLanguage === lang.code ? "bg-gold-50" : ""
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
