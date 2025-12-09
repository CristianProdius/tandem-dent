"use client";

import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUp,
  Send,
  Sparkles,
  ChevronRight,
  Heart,
  Check,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { BsCashCoin, BsCreditCard2Front } from "react-icons/bs";
import { TbCreditCardPay } from "react-icons/tb";
import Link from "next/link";
import Image from "next/image";
import { useClinicInfo } from "@/hooks";
import { validateEmail } from "@/lib/validations";
import { ErrorMessage } from "@/components/common";

const Footer: React.FC = () => {
  const clinicInfo = useClinicInfo();

  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [emailError, setEmailError] = useState("");

  const servicesLinks = [
    { label: "Implantologie", href: "#services" },
    { label: "Ortodonție Invisalign", href: "#services" },
    { label: "Estetică Dentară", href: "#services" },
    { label: "Chirurgie Orală", href: "#services" },
    { label: "Tratament de Canal", href: "#services" },
  ];

  const usefulLinks = [
    { label: "Despre Noi", href: "#team" },
    { label: "Echipa Noastră", href: "#team" },
    { label: "Întrebări Frecvente", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  const legalLinks = [
    { label: "Politica de Confidențialitate", href: "/politica-confidentialitate" },
    { label: "Termeni și Condiții", href: "/termeni-conditii" },
    { label: "Politica Cookie", href: "/politica-cookie" },
    { label: "GDPR", href: "/gdpr" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: clinicInfo.social.facebook,
      icon: <FaFacebook size={20} />,
      hoverClass: "hover:bg-[#1877F2] hover:text-white",
    },
    {
      name: "Instagram",
      href: clinicInfo.social.instagram,
      icon: <FaInstagram size={20} />,
      hoverClass: "hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white",
    },
    {
      name: "YouTube",
      href: clinicInfo.social.youtube,
      icon: <FaYoutube size={20} />,
      hoverClass: "hover:bg-[#FF0000] hover:text-white",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNewsletterSubmit = async (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    setEmailError("");

    if (!validateEmail(email)) {
      setEmailError("Vă rugăm introduceți o adresă de email validă");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubscribed(true);
      setIsSubmitting(false);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 5000);
    }, 1500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="relative bg-gray-50 text-gray-900 border-t border-gray-200">
        <div className="container mx-auto px-4 pt-12 pb-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Brand Section */}
            <div>
              <Link href="/" className="inline-block mb-4 group">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Image
                      src="images/logo/logo.png"
                      width={160}
                      height={44}
                      alt="Tandem Dent Logo"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.nextElementSibling) {
                          (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex";
                        }
                      }}
                    />
                    <div
                      className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center"
                      style={{ display: "none" }}
                    >
                      <span className="text-white font-bold text-xl">T</span>
                    </div>
                  </div>
                </div>
              </Link>

              <p className="text-gray-600 mb-5 text-sm leading-relaxed">
                Pentru noi eficacitatea tratamentului și siguranța pacienților este prioritară.
              </p>

              {/* Social Media Icons */}
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center transition-all text-gray-600 ${social.hoverClass}`}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links Section */}
            <div>
              <h4 className="text-sm font-bold mb-4 text-gray-900 uppercase tracking-wide">
                Servicii
              </h4>
              <ul className="space-y-2">
                {servicesLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group flex items-center gap-1 text-gray-600 hover:text-gold-600 transition-colors text-sm"
                    >
                      <ChevronRight size={14} className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>

              <h4 className="text-sm font-bold mt-6 mb-3 text-gray-900 uppercase tracking-wide">
                Informații
              </h4>
              <ul className="space-y-2">
                {usefulLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group flex items-center gap-1 text-gray-600 hover:text-gold-600 transition-colors text-sm"
                    >
                      <ChevronRight size={14} className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Section - Simplified */}
            <div>
              <h4 className="text-sm font-bold mb-4 text-gray-900 uppercase tracking-wide">
                Contact
              </h4>
              <div className="space-y-3 text-sm">
                <a
                  href={clinicInfo.address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-gray-600 hover:text-gold-600 transition-colors"
                >
                  <MapPin size={16} className="text-gold-500 mt-0.5 flex-shrink-0" />
                  <span>{clinicInfo.address.street}, {clinicInfo.address.city}</span>
                </a>
                <a
                  href={clinicInfo.phone.href}
                  className="flex items-center gap-2 text-gray-600 hover:text-gold-600 transition-colors"
                >
                  <Phone size={16} className="text-gold-500 flex-shrink-0" />
                  <span>{clinicInfo.phone.display}</span>
                </a>
                <a
                  href={clinicInfo.email.href}
                  className="flex items-center gap-2 text-gray-600 hover:text-gold-600 transition-colors"
                >
                  <Mail size={16} className="text-gold-500 flex-shrink-0" />
                  <span>{clinicInfo.email.address}</span>
                </a>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={16} className="text-gold-500 flex-shrink-0" />
                  <span>{clinicInfo.schedule.display}</span>
                </div>
              </div>

              {/* Payment Methods - Simplified */}
              <div className="mt-6">
                <p className="text-xs text-gray-500 mb-2">Metode de plată:</p>
                <div className="flex items-center gap-3">
                  <BsCashCoin size={22} className="text-gray-400" title="Numerar" />
                  <BsCreditCard2Front size={22} className="text-gray-400" title="Card Bancar" />
                  <TbCreditCardPay size={24} className="text-gray-400" title="Rate 0%" />
                </div>
              </div>
            </div>

            {/* Newsletter Section */}
            <div>
              <h4 className="text-sm font-bold mb-4 text-gray-900 uppercase tracking-wide">
                Newsletter
              </h4>
              <p className="text-gray-600 mb-3 text-sm">
                Primește sfaturi pentru sănătatea orală
              </p>

              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    onKeyPress={(e) => e.key === "Enter" && handleNewsletterSubmit(e)}
                    placeholder="Email-ul tău"
                    className={`w-full px-3 py-2.5 bg-white border ${
                      emailError ? "border-red-500" : "border-gray-300"
                    } rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gold-500 transition-colors`}
                    disabled={isSubmitting}
                  />
                  {isSubscribed && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Check className="text-green-500" size={18} />
                    </div>
                  )}
                </div>

                <ErrorMessage message={emailError} />

                <button
                  onClick={handleNewsletterSubmit}
                  disabled={isSubmitting || isSubscribed}
                  className={`w-full px-4 py-2.5 ${
                    isSubscribed ? "bg-green-600" : "bg-gold-600 hover:bg-gold-700"
                  } text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isSubscribed ? (
                    <>
                      <Check size={16} />
                      <span>Înscris!</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Abonează-te</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                * Nu trimitem spam.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} Tandem Dent. Toate drepturile rezervate.
              </p>
              <p className="text-xs text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-1">
                Realizat cu <Heart size={12} className="text-red-500" /> în Chișinău
              </p>
            </div>

            {/* Legal Links - No dots */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
              {legalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-500 hover:text-gold-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-10 h-10 bg-gold-600 text-white rounded-full shadow-lg hover:bg-gold-700 flex items-center justify-center transition-all hover:scale-110"
          aria-label="Înapoi sus"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
};

export default Footer;
