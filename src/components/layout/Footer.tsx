"use client";

import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUp,
  Send,
  Facebook,
  Instagram,
  Youtube,
  Sparkles,
  ChevronRight,
  Heart,
  Shield,
  CreditCard,
  Banknote,
  Check,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Types
interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

interface ContactInfo {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Services Links
  const servicesLinks: FooterLink[] = [
    { label: "Implantologie", href: "#implantologie" },
    { label: "Ortodonție Invisalign", href: "#ortodontie" },
    { label: "Estetică Dentară", href: "#estetica" },
    { label: "Chirurgie Orală", href: "#chirurgie" },
    { label: "Tratament de Canal", href: "#endodontie" },
  ];

  // Useful Links
  const usefulLinks: FooterLink[] = [
    { label: "Despre Noi", href: "#despre-noi" },
    { label: "Echipa Noastră", href: "#echipa" },
    { label: "Prețuri Orientative", href: "#preturi" },
    { label: "Întrebări Frecvente", href: "#faq" },
    { label: "Blog Dental", href: "/blog" },
  ];

  // Legal Links
  const legalLinks: FooterLink[] = [
    {
      label: "Politica de Confidențialitate",
      href: "/politica-confidentialitate",
    },
    { label: "Termeni și Condiții", href: "/termeni-conditii" },
    { label: "Politica Cookie", href: "/politica-cookie" },
    { label: "GDPR", href: "/gdpr" },
  ];

  // Social Media Links
  const socialLinks: SocialLink[] = [
    {
      name: "Facebook",
      href: "https://facebook.com/tandemdent",
      icon: <Facebook size={20} />,
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      name: "Instagram",
      href: "https://instagram.com/tandemdent",
      icon: <Instagram size={20} />,
      color:
        "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:text-white",
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@tandemdent",
      icon: <Youtube size={20} />,
      color: "hover:bg-red-600 hover:text-white",
    },
  ];

  // Contact Information
  const contactInfo: ContactInfo[] = [
    {
      icon: <MapPin size={18} />,
      label: "Adresă",
      value: "Strada Nicolae Zelinski 5/8, MD-2032, Chișinău",
      href: "https://maps.google.com/?q=Tandem+Dent+Chisinau",
    },
    {
      icon: <Phone size={18} />,
      label: "Telefon",
      value: "+373 61 234 555",
      href: "tel:+37361234555",
    },
    {
      icon: <Mail size={18} />,
      label: "Email",
      value: "tandemdent22@gmail.com",
      href: "mailto:tandemdent22@gmail.com",
    },
    {
      icon: <Clock size={18} />,
      label: "Program",
      value: "Luni - Vineri: 09:00 - 18:00",
    },
  ];

  // Payment Methods
  const paymentMethods = [
    { name: "Cash", icon: <Banknote size={24} />, label: "Numerar" },
    { name: "Card", icon: <CreditCard size={24} />, label: "Card Bancar" },
    { name: "Rate", icon: <Shield size={24} />, label: "Rate 0%" },
  ];

  // Handle scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle newsletter subscription
  const handleNewsletterSubmit = async (
    e?: React.MouseEvent | React.KeyboardEvent
  ) => {
    if (e) e.preventDefault();
    setEmailError("");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Vă rugăm introduceți o adresă de email validă");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsSubmitting(false);
      setEmail("");

      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }, 1500);
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <footer className="relative bg-gray-50 text-gray-900 overflow-hidden border-t border-gray-200">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23EAB308' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative container mx-auto px-4 pt-16 pb-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              {/* Logo */}
              <Link href="/" className="inline-block mb-4 group">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Logo Image - Replace src with your actual logo path */}
                    <Image
                      src="images/logo/logo.png"
                      alt="Tandem Dent Logo"
                      onError={(e) => {
                        // Fallback if image doesn't load
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.nextElementSibling) {
                          (
                            e.currentTarget.nextElementSibling as HTMLElement
                          ).style.display = "flex";
                        }
                      }}
                    />
                    {/* Fallback logo */}
                    <div
                      className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300"
                      style={{ display: "none" }}
                    >
                      <span className="text-white font-bold text-2xl">T</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Tagline */}
              <p className="text-gray-700 mb-6 text-lg italic">
                &quot;Zâmbete Sănătoase în Chișinău&quot;
              </p>

              {/* Description */}
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Pentru noi eficacitatea tratamentului și siguranța pacienților
                este prioritară. Oferim servicii stomatologice complete cu
                echipamente moderne și o echipă dedicată.
              </p>

              {/* Social Media Icons */}
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center transition-all duration-300 text-gray-600 hover:scale-110 shadow-sm hover:shadow-md ${social.color}`}
                    aria-label={`Urmărește-ne pe ${social.name}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
                <div className="w-8 h-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
                Servicii Principale
              </h4>
              <ul className="space-y-3">
                {servicesLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors duration-300"
                    >
                      <ChevronRight
                        size={14}
                        className="text-yellow-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1"
                      />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <h4 className="text-lg font-bold mt-8 mb-4 text-gray-900 flex items-center gap-2">
                <div className="w-8 h-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
                Informații Utile
              </h4>
              <ul className="space-y-3">
                {usefulLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors duration-300"
                    >
                      <ChevronRight
                        size={14}
                        className="text-yellow-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1"
                      />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
                <div className="w-8 h-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
                Contact
              </h4>
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-600">{info.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">{info.label}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          target={
                            info.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            info.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="text-gray-700 hover:text-yellow-600 transition-colors duration-300 text-sm"
                        >
                          {info.value}
                          {info.href.startsWith("http") && (
                            <ExternalLink size={12} className="inline ml-1" />
                          )}
                        </a>
                      ) : (
                        <p className="text-gray-700 text-sm">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Emergency Notice */}
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-medium mb-1">
                  Urgențe 24/7
                </p>
                <a
                  href="tel:+37361234555"
                  className="text-gray-900 font-bold hover:text-red-600 transition-colors"
                >
                  +373 61 234 555
                </a>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
                <div className="w-8 h-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
                Newsletter
              </h4>
              <p className="text-gray-600 mb-4">
                Primește sfaturi lunare pentru sănătatea orală
              </p>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleNewsletterSubmit(e);
                      }
                    }}
                    placeholder="Email-ul tău"
                    className={`w-full px-4 py-3 bg-white border ${
                      emailError ? "border-red-500" : "border-gray-300"
                    } rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-all duration-300`}
                    disabled={isSubmitting}
                  />
                  {isSubscribed && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Check className="text-green-500" size={20} />
                    </div>
                  )}
                </div>

                {emailError && (
                  <p className="text-red-600 text-xs">{emailError}</p>
                )}

                <button
                  onClick={handleNewsletterSubmit}
                  disabled={isSubmitting || isSubscribed}
                  className={`w-full px-6 py-3 ${
                    isSubscribed
                      ? "bg-green-600"
                      : "bg-gradient-to-r from-yellow-500 to-yellow-600"
                  } text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isSubscribed ? (
                    <>
                      <Check size={18} />
                      <span>Înscris cu succes!</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Abonează-te</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                * Nu trimitem spam. Te poți dezabona oricând.
              </p>

              {/* Payment Methods */}
              <div className="mt-8">
                <p className="text-sm text-gray-600 mb-3">
                  Metode de plată acceptate:
                </p>
                <div className="flex gap-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.name}
                      className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm"
                      title={method.label}
                    >
                      <span className="text-yellow-600">{method.icon}</span>
                      <span className="text-xs text-gray-700">
                        {method.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Premium Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-600 text-sm">
                © 2024 Tandem Dent. Toate drepturile rezervate.
              </p>
              <p className="text-xs text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-1">
                Realizat cu <Heart size={12} className="text-red-500" /> în
                Chișinău
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-500 hover:text-yellow-600 transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                  {index < legalLinks.length - 1 && (
                    <span className="text-gray-400 hidden md:inline">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 transform hover:-translate-y-1"
          aria-label="Înapoi sus"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
};

export default Footer;
