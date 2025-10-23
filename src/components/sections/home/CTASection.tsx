"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Phone,
  Gift,
  Clock,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Mail,
  Users,
  Star,
  Shield,
  AlertCircle,
  Timer,
  X,
  Loader,
  TrendingUp,
  Zap,
} from "lucide-react";

type CtaVariant = "appointment" | "offer";

const CTASection = () => {
  // State for A/B testing variations
  const [ctaVariant, setCtaVariant] = useState<CtaVariant>("appointment");

  // Interactive states
  const [appointmentType, setAppointmentType] = useState("consultation");
  const [preferredContact, setPreferredContact] = useState("phone");
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [exitIntentShown, setExitIntentShown] = useState(false);
  const [exitIntentDismissed, setExitIntentDismissed] = useState(false);
  const [timeOnPage, setTimeOnPage] = useState(0);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
  });

  // Dynamic counters - use fixed initial values to avoid hydration issues
  const [appointmentsToday] = useState(12);
  const [spotsLeft] = useState(3);
  const [offerTimeLeft, setOfferTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });

  // Check localStorage on mount to sync state
  useEffect(() => {
    const dismissed = localStorage.getItem("exitIntentDismissed") === "true";
    if (dismissed) {
      setExitIntentDismissed(true);
    }
  }, []);

  // Track time on page
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnPage((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Countdown timer for offer
  useEffect(() => {
    const timer = setInterval(() => {
      setOfferTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Exit intent detection with delay (30 seconds on page)
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (
        e.clientY <= 0 &&
        !exitIntentShown &&
        !exitIntentDismissed &&
        timeOnPage >= 30
      ) {
        setExitIntentShown(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [exitIntentShown, exitIntentDismissed, timeOnPage]);

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name || !formData.phone || !formData.service) {
      alert("Vă rugăm completați toate câmpurile obligatorii");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowSuccess(true);
    setShowCallbackForm(false);

    // Reset form
    setFormData({
      name: "",
      phone: "",
      email: "",
      service: "",
    });

    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDismissExitIntent = () => {
    setExitIntentShown(false);
    setExitIntentDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("exitIntentDismissed", "true");
    }
  };

  // CTA Variants
  const ctaContent = {
    appointment: {
      headline: "Începe Călătoria Spre un Zâmbet Perfect",
      subtext: "Consultație GRATUITĂ pentru pacienți noi",
      button: "Programează Acum",
      icon: Calendar,
      color: "gold",
    },
    offer: {
      headline: "Ofertă Specială: Control + Detartraj",
      subtext: "Economisește 30% ca pacient nou",
      button: "Revendică Oferta",
      icon: Gift,
      color: "green",
    },
  };

  const currentCTA = ctaContent[ctaVariant];
  const Icon = currentCTA.icon;

  return (
    <>
      {/* Main CTA Section */}
      <section className="relative py-20 bg-gray-20">
        {/* Subtle Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #3B82F6 1px, transparent 1px), radial-gradient(circle at 80% 80%, #3B82F6 1px, transparent 1px)",
              backgroundSize: "40px 40px, 30px 30px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          {/* Main Content */}
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm">
                <Users size={18} className="text-gold-600" />
                <span className="text-gray-700 font-medium">
                  Peste 5000 pacienți mulțumiți
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm">
                <Clock size={18} className="text-gold-600" />
                <span className="text-gray-700 font-medium">
                  Programare în 24h
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm">
                <CheckCircle size={18} className="text-green-600" />
                <span className="text-gray-700 font-medium">
                  Fără liste de așteptare
                </span>
              </div>
            </div>

            {/* Dynamic Icon */}
            <div className="mb-6 inline-block">
              <div className="w-24 h-24 bg-white border-2 border-gold-100 rounded-full flex items-center justify-center shadow-lg">
                <Icon size={48} className="text-gold-600" />
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {currentCTA.headline}
            </h2>

            {/* Subtext */}
            <p className="text-xl text-gray-600 mb-8">{currentCTA.subtext}</p>

            {/* Urgency Indicators */}
            {ctaVariant === "offer" && (
              <div className="mb-8 flex justify-center items-center gap-4">
                <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <Timer size={20} />
                    <span className="font-mono text-lg font-semibold">
                      {String(offerTimeLeft.hours).padStart(2, "0")}:
                      {String(offerTimeLeft.minutes).padStart(2, "0")}:
                      {String(offerTimeLeft.seconds).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <div className="text-gray-700 font-medium">
                  Ofertă limitată!
                </div>
              </div>
            )}

            {/* Appointment Type Selector */}
            <div className="mb-8">
              <div className="inline-flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                {["consultation", "treatment", "checkup"].map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => setAppointmentType(type)}
                      className={`px-4 py-2 rounded-md transition-all ${
                        appointmentType === type
                          ? "bg-gold-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {type === "consultation" && "Consultație"}
                      {type === "treatment" && "Tratament"}
                      {type === "checkup" && "Control"}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Main CTA Button */}
            <div className="mb-8">
              <button
                className="inline-flex items-center gap-3 px-8 py-4 text-lg font-bold rounded-full
                  bg-gold-600 hover:bg-gold-700 text-white shadow-lg hover:shadow-xl
                  transform transition-all duration-300 hover:scale-105"
                onClick={() => setShowCallbackForm(true)}
              >
                {currentCTA.button}
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Multiple Contact Options */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <a
                href="tel:+37361234555"
                className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-full text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md"
              >
                <Phone size={20} className="text-gold-600" />
                <span>Sună Direct</span>
              </a>
              <a
                href="https://wa.me/37361234555"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-50 border border-green-200 px-6 py-3 rounded-full text-green-700 hover:bg-green-100 hover:border-green-300 transition-all shadow-sm hover:shadow-md"
              >
                <MessageCircle size={20} />
                <span>WhatsApp</span>
              </a>
              <button
                className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-full text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md"
                onClick={() => setShowCallbackForm(true)}
              >
                <Mail size={20} className="text-gold-600" />
                <span>Email</span>
              </button>
            </div>

            {/* Social Proof & Scarcity */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <TrendingUp size={18} className="text-green-600" />
                <span>{appointmentsToday} persoane au programat astăzi</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <AlertCircle size={18} className="text-orange-500" />
                <span className="font-semibold">
                  Doar {spotsLeft} locuri disponibile săptămâna aceasta
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Star size={18} className="text-yellow-500" />
                <span>Recomandați de 98% dintre pacienți</span>
              </div>
            </div>

            {/* Guarantee Badge */}
            <div className="mt-8">
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-6 py-3 rounded-full">
                <Shield size={24} className="text-green-600" />
                <span className="text-green-700 font-semibold">
                  Satisfacție 100% Garantată
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Callback Form Modal */}
      {showCallbackForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Programează-te Rapid
              </h3>
              <button
                onClick={() => setShowCallbackForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Contact Method Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cum preferi să te contactăm?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["phone", "whatsapp", "email"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPreferredContact(method)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        preferredContact === method
                          ? "border-gold-500 bg-gold-50"
                          : "border-gray-200 hover:border-gold-300 bg-white"
                      }`}
                    >
                      {method === "phone" && (
                        <Phone className="mx-auto text-gray-700" size={20} />
                      )}
                      {method === "whatsapp" && (
                        <MessageCircle
                          className="mx-auto text-green-600"
                          size={20}
                        />
                      )}
                      {method === "email" && (
                        <Mail className="mx-auto text-gray-700" size={20} />
                      )}
                      <span className="text-xs mt-1 block text-gray-600">
                        {method === "phone" && "Telefon"}
                        {method === "whatsapp" && "WhatsApp"}
                        {method === "email" && "Email"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div>
                <input
                  type="text"
                  placeholder="Numele tău *"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold-500 focus:outline-none transition-all bg-white"
                />
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Număr de telefon *"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold-500 focus:outline-none transition-all bg-white"
                />
              </div>

              {preferredContact === "email" && (
                <div>
                  <input
                    type="email"
                    placeholder="Adresa de email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold-500 focus:outline-none transition-all bg-white"
                  />
                </div>
              )}

              <div>
                <select
                  value={formData.service}
                  onChange={(e) => handleInputChange("service", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold-500 focus:outline-none transition-all bg-white text-gray-700"
                >
                  <option value="">Selectează serviciul dorit *</option>
                  <option value="consultation">Consultație generală</option>
                  <option value="implant">Implant dentar</option>
                  <option value="orthodontics">Ortodonție</option>
                  <option value="cleaning">Curățare profesională</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 bg-gold-600 text-white font-bold rounded-lg hover:bg-gold-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Se procesează...</span>
                  </>
                ) : (
                  <>
                    <span>Trimite Cererea</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              {/* Instant Callback Option */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-gold-600 hover:text-gold-700 font-medium flex items-center gap-2 mx-auto"
                  onClick={() => {
                    setShowCallbackForm(false);
                    window.location.href = "tel:+37361234555";
                  }}
                >
                  <Zap size={16} />
                  <span>Vreau să fiu sunat imediat</span>
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                * Câmpuri obligatorii
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3">
            <CheckCircle size={24} />
            <div>
              <div className="font-bold">Cerere trimisă cu succes!</div>
              <div className="text-sm">Te vom contacta în curând.</div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t-2 border-gray-200 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-gray-900">
            <div className="font-bold">Programează-te</div>
            <div className="text-xs text-gray-600">Consultație gratuită</div>
          </div>
          <button
            onClick={() => (window.location.href = "tel:+37361234555")}
            className="bg-gold-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-md hover:bg-gold-700 transition-colors"
          >
            <Phone size={18} />
            <span>Sună Acum</span>
          </button>
        </div>
      </div>

      {/* Exit Intent Popup */}
      {exitIntentShown && !exitIntentDismissed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-gray-200">
            <div className="text-center">
              <div className="w-20 h-20 bg-gold-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gold-100">
                <Gift size={40} className="text-gold-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">
                Stai! Avem o ofertă pentru tine!
              </h3>
              <p className="text-gray-600 mb-6">
                Primește 20% reducere la prima vizită dacă te programezi acum
              </p>
              <button
                className="w-full py-3 bg-gold-600 text-white font-bold rounded-lg hover:bg-gold-700 transition-all shadow-md hover:shadow-lg"
                onClick={() => {
                  setExitIntentShown(false);
                  setCtaVariant("offer");
                }}
              >
                Vreau Reducerea
              </button>
              <button
                className="mt-3 text-gray-500 hover:text-gray-700"
                onClick={handleDismissExitIntent}
              >
                Nu, mulțumesc
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CTASection;
