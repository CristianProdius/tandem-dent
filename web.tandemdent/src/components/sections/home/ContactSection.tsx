"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Car,
  ChevronDown,
  Loader2,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import {
  SectionHeader,
  FloatingLabelInput,
  FloatingLabelTextarea,
  ErrorMessage,
} from "@/components/common";
import { useClinicInfo } from "@/hooks";
import { SERVICES } from "@/lib/constants";
import {
  getEmailError,
  getPhoneError,
  getNameError,
  getRequiredError,
} from "@/lib/validations";
import { useTranslations } from "next-intl";

interface FormData {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
}

interface SubmissionData {
  name: string;
  service: string;
  timestamp: number;
}

const STORAGE_KEY = "tandemdent_last_submission";

// Get service names from constants
const services = SERVICES.main.map((s) => s.name);

const ContactSection: React.FC = () => {
  const clinicInfo = useClinicInfo();
  const t = useTranslations("contact");
  const tCommon = useTranslations("common");

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
  const [submittedData, setSubmittedData] = useState<SubmissionData | null>(null);
  const [hasRecentSubmission, setHasRecentSubmission] = useState(false);

  // Check for recent submission in localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: SubmissionData = JSON.parse(stored);
      setSubmittedData(data);
      setHasRecentSubmission(true);
    }
  }, []);

  const resetForm = useCallback(() => {
    setHasRecentSubmission(false);
    setIsSuccess(false);
    setSubmittedData(null);
    setFormData({ name: "", phone: "", email: "", service: "", message: "" });
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
        const openTime = 9 * 60;
        const closeTime = 18 * 60;
        setIsOpen(
          currentTimeInMinutes >= openTime && currentTimeInMinutes < closeTime
        );
      } else {
        setIsOpen(false);
      }
    };

    checkIfOpen();
    const timer = setInterval(checkIfOpen, 60000);
    return () => clearInterval(timer);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const nameError = getNameError(formData.name);
    if (nameError) newErrors.name = nameError;

    const phoneError = getPhoneError(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    // Only validate email if provided
    if (formData.email) {
      const emailError = getEmailError(formData.email);
      if (emailError) newErrors.email = emailError;
    }

    const serviceError = getRequiredError(formData.service, "Serviciul");
    if (serviceError) newErrors.service = serviceError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      // Save to localStorage
      const submission: SubmissionData = {
        name: formData.name,
        service: formData.service,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submission));
      setSubmittedData(submission);
      setIsSuccess(true);
      setHasRecentSubmission(true);
    } catch (error) {
      console.error("Form submission error:", error);
      alert("A apărut o eroare. Vă rugăm încercați din nou sau contactați-ne telefonic.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section id="contact" className="relative py-20 lg:py-32 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          badge={{ icon: MapPin, text: t("badge"), color: "gold" }}
          title={t("title")}
          description={t("description")}
        />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm h-fit">
            <h3 className="text-xl font-bold mb-6 text-gray-900">
              {t("formTitle")}
            </h3>

            {/* Show success/already submitted state */}
            {(isSuccess || hasRecentSubmission) && submittedData ? (
              <div className="text-center py-8">
                {/* Animated checkmark */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-pulse opacity-20" />
                  <div className="absolute inset-2 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Personalized message */}
                <h4 className="text-2xl font-bold text-gray-900 mb-3">
                  {t("success.title", { name: submittedData.name })}
                </h4>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto leading-relaxed">
                  {isSuccess
                    ? t("success.message", { service: submittedData.service })
                    : t("success.alreadySentMessage")}
                </p>

                {/* Already sent notice */}
                {hasRecentSubmission && !isSuccess && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <p className="text-amber-800 text-sm font-medium">
                      {t("success.alreadySent")}
                    </p>
                  </div>
                )}

                {/* Send another request button */}
                <button
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 px-6 py-3 text-gold-700 bg-gold-50 hover:bg-gold-100 rounded-xl transition-all duration-300 font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t("success.sendAnother")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <FloatingLabelInput
                    id="name"
                    type="text"
                    label={t("form.name")}
                    value={formData.name}
                    onChange={(value) => handleInputChange("name", value)}
                    error={errors.name}
                    required
                  />
                  <ErrorMessage message={errors.name} />
                </div>

                <div>
                  <FloatingLabelInput
                    id="phone"
                    type="tel"
                    label={t("form.phone")}
                    value={formData.phone}
                    onChange={(value) => handleInputChange("phone", value)}
                    error={errors.phone}
                    required
                  />
                  <ErrorMessage message={errors.phone} />
                </div>

                <div>
                  <FloatingLabelInput
                    id="email"
                    type="email"
                    label={t("form.email")}
                    value={formData.email}
                    onChange={(value) => handleInputChange("email", value)}
                    error={errors.email}
                  />
                  <ErrorMessage message={errors.email} />
                </div>

                <div>
                  <div className="relative">
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) =>
                        handleInputChange("service", e.target.value)
                      }
                      className={`peer w-full px-4 py-3 bg-white border rounded-xl transition-all duration-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none appearance-none ${
                        errors.service ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">{t("form.service")}</option>
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  <ErrorMessage message={errors.service} />
                </div>

                <FloatingLabelTextarea
                  id="message"
                  label={t("form.message")}
                  value={formData.message}
                  onChange={(value) => handleInputChange("message", value)}
                  rows={3}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 font-semibold text-white rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t("form.submitting")}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t("form.submit")}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Map and Contact Info */}
          <div className="flex flex-col h-full">
            {/* Google Map - Expanded */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex-1 min-h-[300px] lg:min-h-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2720.5!2d28.7897!3d46.9856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97c3628b769a1%3A0x5765a4c0f6e5c9f7!2sStrada%20Nicolae%20Zelinski%205%2F8%2C%20Chi%C8%99in%C4%83u%2C%20Moldova!5e0!3m2!1sen!2s!4v1702000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "300px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Tandem Dent Location"
                className="w-full h-full"
              />
            </div>

            {/* Contact Info - Compact */}
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              {/* Address Row */}
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-gold-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    {clinicInfo.address.street}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {clinicInfo.address.postalCode}, {clinicInfo.address.city}
                  </p>
                </div>
                <Link
                  href={clinicInfo.address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gold-600 hover:text-gold-700 font-medium whitespace-nowrap"
                >
                  {tCommon("openInMaps")} →
                </Link>
              </div>

              {/* Compact Contact Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link
                  href={clinicInfo.phone.href}
                  className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 hover:bg-gold-50 rounded-xl transition-colors group"
                >
                  <Phone className="w-4 h-4 text-gold-600" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">{tCommon("phone")}</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {clinicInfo.phone.display}
                    </p>
                  </div>
                </Link>

                <Link
                  href={clinicInfo.phone.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 hover:bg-green-50 rounded-xl transition-colors group"
                >
                  <WhatsAppIcon className="w-4 h-4 text-green-600" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">{tCommon("whatsapp")}</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {tCommon("writeUs")}
                    </p>
                  </div>
                </Link>

                <Link
                  href={clinicInfo.email.href}
                  className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 hover:bg-blue-50 rounded-xl transition-colors group"
                >
                  <Mail className="w-4 h-4 text-blue-600" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">{tCommon("email")}</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {tCommon("send")}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs text-gray-500">{tCommon("schedule")}</p>
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isOpen ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {tCommon("scheduleShort")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Parking Badge */}
              <div className="mt-4 flex items-center gap-2 text-sm text-green-700">
                <Car className="w-4 h-4" />
                <span>{tCommon("freeParking")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
