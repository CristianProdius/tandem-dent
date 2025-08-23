"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Check,
  AlertCircle,
  MessageCircle,
  Calendar,
  Car,
  Globe,
  ChevronDown,
  Loader2,
  CheckCircle,
  X,
} from "lucide-react";

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

interface FormData {
  name: string;
  phone: string;
  email: string;
  service: string;
  message?: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
}

const services = [
  "Consultație generală",
  "Implant dentar",
  "Ortodonție / Invisalign",
  "Albire dentară",
  "Terapie dentară",
  "Chirurgie orală",
  "Protetică dentară",
  "Urgență dentară",
  "Alt serviciu",
];

const ContactSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Check if clinic is open
  useEffect(() => {
    const checkIfOpen = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      const currentTimeInMinutes = hour * 60 + minutes;

      // Monday to Friday (1-5), 9:00-18:00
      if (day >= 1 && day <= 5) {
        const openTime = 9 * 60; // 9:00
        const closeTime = 18 * 60; // 18:00
        setIsOpen(
          currentTimeInMinutes >= openTime && currentTimeInMinutes < closeTime
        );
      } else {
        setIsOpen(false);
      }
    };

    checkIfOpen();
  }, [currentTime]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Numele este obligatoriu";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefonul este obligatoriu";
    } else if (!/^(\+373)?[0-9]{8}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Număr de telefon invalid";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email-ul este obligatoriu";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalid";
    }

    if (!formData.service) {
      newErrors.service = "Selectați un serviciu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        phone: "",
        email: "",
        service: "",
        message: "",
      });
      setIsSuccess(false);
    }, 3000);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50  dark:via-gray-950 dark:to-gray-900"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 100px, rgba(212, 175, 55, 0.1) 100px, rgba(212, 175, 55, 0.1) 200px)`,
          }}
        />
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-gold-400/10 to-gold-600/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/20"
          >
            <MapPin className="w-4 h-4 text-gold-500" />
            <span className="text-sm font-medium text-gold-600 dark:text-gold-400">
              Contact & Locație
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-gradient-gold">Programează o Vizită</span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Suntem aici pentru a-ți oferi cel mai bun tratament. Contactează-ne
            pentru o programare.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="glass backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-gold-500/10 shadow-premium">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Formular de Programare
              </h3>

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {/* Name Input */}
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className={`peer w-full px-4 py-3 bg-white dark:bg-gray-800 border rounded-xl transition-all duration-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none ${
                          errors.name
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="name"
                        className="absolute left-4 top-3 text-gray-600 dark:text-gray-400 transition-all duration-300 
                          peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                          peer-focus:-top-6 peer-focus:text-sm peer-focus:text-gold-500
                          peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-sm"
                      >
                        Nume complet *
                      </label>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {errors.name}
                        </motion.p>
                      )}
                    </div>

                    {/* Phone Input */}
                    <div className="relative">
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className={`peer w-full px-4 py-3 bg-white dark:bg-gray-800 border rounded-xl transition-all duration-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none ${
                          errors.phone
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="phone"
                        className="absolute left-4 top-3 text-gray-600 dark:text-gray-400 transition-all duration-300 
                          peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                          peer-focus:-top-6 peer-focus:text-sm peer-focus:text-gold-500
                          peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-sm"
                      >
                        Telefon *
                      </label>
                      {errors.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {errors.phone}
                        </motion.p>
                      )}
                    </div>

                    {/* Email Input */}
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={`peer w-full px-4 py-3 bg-white dark:bg-gray-800 border rounded-xl transition-all duration-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none ${
                          errors.email
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="email"
                        className="absolute left-4 top-3 text-gray-600 dark:text-gray-400 transition-all duration-300 
                          peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                          peer-focus:-top-6 peer-focus:text-sm peer-focus:text-gold-500
                          peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-sm"
                      >
                        Email *
                      </label>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {errors.email}
                        </motion.p>
                      )}
                    </div>

                    {/* Service Select */}
                    <div className="relative">
                      <select
                        id="service"
                        value={formData.service}
                        onChange={(e) =>
                          handleInputChange("service", e.target.value)
                        }
                        className={`peer w-full px-4 py-3 bg-white dark:bg-gray-800 border rounded-xl transition-all duration-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none appearance-none ${
                          errors.service
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                      >
                        <option value="">Selectați serviciul dorit</option>
                        {services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      {errors.service && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {errors.service}
                        </motion.p>
                      )}
                    </div>

                    {/* Message Textarea */}
                    <div className="relative">
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        rows={4}
                        className="peer w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl transition-all duration-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none resize-none"
                        placeholder=" "
                      />
                      <label
                        htmlFor="message"
                        className="absolute left-4 top-3 text-gray-600 dark:text-gray-400 transition-all duration-300 
                          peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                          peer-focus:-top-6 peer-focus:text-sm peer-focus:text-gold-500
                          peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-sm"
                      >
                        Mesaj (opțional)
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-premium w-full py-4 text-lg font-semibold text-white rounded-xl transition-all duration-300 hover-lift hover-glow shimmer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{
                        background: "linear-gradient(135deg, #d4af37, #b89229)",
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Se trimite...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Trimite Programarea
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Programare Trimisă!
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Vă vom contacta în curând pentru confirmare.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Quick Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {/* Phone Card */}
              <a
                href="tel:+37361234555"
                className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-gold-500/50 transition-all duration-300 hover-lift"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Telefon
                  </h4>
                  <p className="text-gold-600 dark:text-gold-400 font-medium">
                    061 234 555
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Apelează acum
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 to-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              {/* WhatsApp Card */}
              <a
                href="https://wa.me/37361234555"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-green-500/50 transition-all duration-300 hover-lift"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform">
                    <WhatsAppIcon className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    WhatsApp
                  </h4>
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    +373 61 234 555
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Scrie-ne acum
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              {/* Email Card */}
              <a
                href="mailto:tandemdent22@gmail.com"
                className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover-lift"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Email
                  </h4>
                  <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                    tandemdent22@gmail.com
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Trimite email
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              {/* Schedule Card */}
              <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-3">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Program
                  </h4>
                  <p className="text-teal-600 dark:text-teal-400 font-medium">
                    Luni-Vineri
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    9:00 - 18:00
                  </p>

                  {/* Open/Closed Status */}
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isOpen ? "bg-green-500" : "bg-red-500"
                      } animate-pulse`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isOpen
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {isOpen ? "Deschis acum" : "Închis"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Card with Map */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Map Container */}
              <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2719.2!2d28.8638!3d47.0105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDAwJzM3LjgiTiAyOMKwNTEnNDkuNyJF!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />

                {/* Map Overlay with Marker */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-white rounded-full p-3 shadow-lg"
                  >
                    <MapPin className="w-6 h-6 text-gold-500" />
                  </motion.div>
                </div>
              </div>

              {/* Address Info */}
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-gold-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Adresa
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Strada Nicolae Zelinski 5/8
                      <br />
                      MD-2032, Chișinău
                    </p>
                  </div>
                </div>

                {/* Parking Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Car className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">
                    Parcare gratuită în fața clinicii
                  </span>
                </div>

                {/* Directions Button */}
                <a
                  href="https://maps.google.com/?q=Tandem+Dent+Chisinau"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="font-medium">Vezi pe Google Maps</span>
                </a>
              </div>
            </div>

            {/* Emergency Notice */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-red-900 dark:text-red-200 mb-1">
                    Urgențe Stomatologice 24/7
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Pentru urgențe în afara programului, sunați la:{" "}
                    <a href="tel:+37361234555" className="font-bold underline">
                      061 234 555
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
