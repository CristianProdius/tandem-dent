"use client";

import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Car,
  Globe,
  ChevronDown,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { SectionHeader, FloatingLabelInput, FloatingLabelTextarea, ErrorMessage } from "@/components/common";
import { useClinicInfo } from "@/hooks";
import { getEmailError, getPhoneError, getNameError, getRequiredError } from "@/lib/validations";

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

const services = [
  "Consultație generală",
  "Terapie dentară",
  "Ortopedie dentară",
  "Ortodonție",
  "Implantologie",
  "Chirurgie orală",
  "Alt serviciu",
];

const ContactSection: React.FC = () => {
  const clinicInfo = useClinicInfo();

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

    const nameError = getNameError(formData.name);
    if (nameError) newErrors.name = nameError;

    const phoneError = getPhoneError(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    const emailError = getEmailError(formData.email);
    if (emailError) newErrors.email = emailError;

    const serviceError = getRequiredError(formData.service, "Serviciul");
    if (serviceError) newErrors.service = serviceError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      id="contact"
      className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 100px, rgba(245, 158, 11, 0.1) 100px, rgba(245, 158, 11, 0.1) 200px)`,
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-gold-400/10 to-gold-600/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <SectionHeader
          badge={{ icon: MapPin, text: "Contact & Locație", color: "gold" }}
          title="Programează o Vizită"
          description="Suntem aici pentru a-ți oferi cel mai bun tratament. Contactează-ne pentru o programare."
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <div>
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-gold-500/10 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                Formular de Programare
              </h3>

              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <div>
                    <FloatingLabelInput
                      id="name"
                      type="text"
                      label="Nume complet"
                      value={formData.name}
                      onChange={(value) => handleInputChange("name", value)}
                      error={errors.name}
                      required
                    />
                    <ErrorMessage message={errors.name} />
                  </div>

                  {/* Phone Input */}
                  <div>
                    <FloatingLabelInput
                      id="phone"
                      type="tel"
                      label="Telefon"
                      value={formData.phone}
                      onChange={(value) => handleInputChange("phone", value)}
                      error={errors.phone}
                      required
                    />
                    <ErrorMessage message={errors.phone} />
                  </div>

                  {/* Email Input */}
                  <div>
                    <FloatingLabelInput
                      id="email"
                      type="email"
                      label="Email"
                      value={formData.email}
                      onChange={(value) => handleInputChange("email", value)}
                      error={errors.email}
                      required
                    />
                    <ErrorMessage message={errors.email} />
                  </div>

                  {/* Service Select */}
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
                        <option value="">Selectați serviciul dorit</option>
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

                  {/* Message Textarea */}
                  <FloatingLabelTextarea
                    id="message"
                    label="Mesaj (opțional)"
                    value={formData.message}
                    onChange={(value) => handleInputChange("message", value)}
                    rows={4}
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 text-lg font-semibold text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #8b6e20, #b89229)",
                      boxShadow: "0 4px 20px rgba(245, 158, 11, 0.3)",
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
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    Programare Trimisă!
                  </h4>
                  <p className="text-gray-600">
                    Vă vom contacta în curând pentru confirmare.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Quick Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {/* Phone Card */}
              <a
                href={clinicInfo.phone.href}
                className="group relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-200 hover:border-gold-500/50 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Telefon</h4>
                  <p className="text-gold-600 font-medium">{clinicInfo.phone.display}</p>
                  <p className="text-sm text-gray-500 mt-1">Apelează acum</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 to-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              {/* WhatsApp Card */}
              <a
                href={clinicInfo.phone.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-200 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform">
                    <WhatsAppIcon className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">WhatsApp</h4>
                  <p className="text-green-600 font-medium">{clinicInfo.phone.main}</p>
                  <p className="text-sm text-gray-500 mt-1">Scrie-ne acum</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              {/* Email Card */}
              <a
                href={clinicInfo.email.href}
                className="group relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <p className="text-blue-600 font-medium text-sm">
                    {clinicInfo.email.address}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Trimite email</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              {/* Schedule Card */}
              <div className="relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-200">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-3">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Program</h4>
                  <p className="text-teal-600 font-medium">{clinicInfo.schedule.display}</p>

                  {/* Open/Closed Status */}
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isOpen ? "bg-green-500" : "bg-red-500"
                      } animate-pulse`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isOpen ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isOpen ? "Deschis acum" : "Închis"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Card with Map */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
              {/* Map Container */}
              <div className="relative h-64 bg-gray-200">
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
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <MapPin className="w-6 h-6 text-gold-500" />
                  </div>
                </div>
              </div>

              {/* Address Info */}
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-gold-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Adresa</h4>
                    <p className="text-gray-600">
                      {clinicInfo.address.street}
                      <br />
                      {clinicInfo.address.postalCode}, {clinicInfo.address.city}
                    </p>
                  </div>
                </div>

                {/* Parking Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                  <Car className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Parcare gratuită în fața clinicii
                  </span>
                </div>

                {/* Directions Button */}
                <a
                  href={clinicInfo.address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="font-medium">Vezi pe Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
