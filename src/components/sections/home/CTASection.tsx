"use client";
import React, { useState, useEffect, useRef } from "react";
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
  Sparkles,
  Timer,
  ChevronRight,
  X,
  Loader,
  Heart,
  TrendingUp,
  Award,
  MapPin,
  Zap,
} from "lucide-react";

type CtaVariant = "appointment" | "emergency" | "offer";

const CTASection = () => {
  // State for A/B testing variations
  const [ctaVariant, setCtaVariant] = useState<CtaVariant>("appointment"); // 'appointment', 'emergency', 'offer'
  const [buttonVariant, setButtonVariant] = useState("gold"); // 'gold', 'teal'

  // Interactive states
  const [appointmentType, setAppointmentType] = useState("consultation");
  const [preferredContact, setPreferredContact] = useState("phone");
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [exitIntentShown, setExitIntentShown] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
  });

  // Dynamic counters
  const [appointmentsToday, setAppointmentsToday] = useState(12);
  const [spotsLeft, setSpotsLeft] = useState(3);
  const [offerTimeLeft, setOfferTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });

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

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: { clientY: number }) => {
      if (e.clientY <= 0 && !exitIntentShown) {
        setExitIntentShown(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [exitIntentShown]);

  // Simulate dynamic appointment bookings
  useEffect(() => {
    const interval = setInterval(() => {
      setAppointmentsToday((prev) => prev + Math.floor(Math.random() * 2));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name || !formData.phone || !formData.service) {
      alert("Vă rugăm completați toate câmpurile obligatorii");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
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

    // Trigger confetti animation
    triggerConfetti();

    // Hide success message after 5 seconds
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const triggerConfetti = () => {
    // Confetti animation would go here
    console.log("🎉 Confetti!");
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
    emergency: {
      headline: "Urgențe Dentare? Suntem Aici 24/7",
      subtext: "Răspundem imediat la situații urgente",
      button: "Sună Acum: +373 61 234 555",
      icon: Phone,
      color: "red",
    },
    offer: {
      headline: "Ofertă Specială: Control + Detartraj",
      subtext: "Economisește 30% ca pacient nou",
      button: "Revendică Oferta",
      icon: Gift,
      color: "teal",
    },
  };

  const currentCTA = ctaContent[ctaVariant];
  const Icon = currentCTA.icon;

  return (
    <>
      {/* Main CTA Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-premium">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/90 to-teal-500/90"></div>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)",
              backgroundSize: "50px 50px, 30px 30px",
              animation: "float 20s ease-in-out infinite",
            }}
          />
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute float-animation opacity-20"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + i * 10}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${10 + i * 2}s`,
              }}
            >
              <Heart size={30} className="text-white" />
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* A/B Test Selector (would be hidden in production) */}
          <div className="absolute top-0 right-0 bg-white/10 backdrop-blur-md rounded-lg p-2 text-white text-xs">
            <select
              value={ctaVariant}
              onChange={(e) => setCtaVariant(e.target.value as CtaVariant)}
              className="bg-transparent border border-white/30 rounded px-2 py-1"
            >
              <option value="appointment">Appointment</option>
              <option value="emergency">Emergency</option>
              <option value="offer">Offer</option>
            </select>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                <Users size={18} className="text-white" />
                <span className="text-white font-medium">
                  Peste 5000 pacienți mulțumiți
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                <Clock size={18} className="text-white" />
                <span className="text-white font-medium">
                  Programare în 24h
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                <CheckCircle size={18} className="text-white" />
                <span className="text-white font-medium">
                  Fără liste de așteptare
                </span>
              </div>
            </div>

            {/* Dynamic Icon */}
            <div className="mb-6 inline-block">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center pulse-glow">
                <Icon size={48} className="text-white" />
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 enter-fade-in">
              {currentCTA.headline}
            </h2>

            {/* Subtext */}
            <p className="text-xl text-white/90 mb-8 enter-fade-in animation-delay-200">
              {currentCTA.subtext}
            </p>

            {/* Urgency Indicators */}
            {ctaVariant === "offer" && (
              <div className="mb-8 flex justify-center items-center gap-4">
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2 text-white">
                    <Timer size={20} />
                    <span className="font-mono text-lg">
                      {String(offerTimeLeft.hours).padStart(2, "0")}:
                      {String(offerTimeLeft.minutes).padStart(2, "0")}:
                      {String(offerTimeLeft.seconds).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <div className="text-white/90">Ofertă limitată!</div>
              </div>
            )}

            {/* Appointment Type Selector */}
            <div className="mb-8">
              <div className="inline-flex bg-white/10 backdrop-blur-md rounded-lg p-1">
                {["consultation", "emergency", "treatment", "checkup"].map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => setAppointmentType(type)}
                      className={`px-4 py-2 rounded-md transition-all ${
                        appointmentType === type
                          ? "bg-white text-gray-900 shadow-lg"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      {type === "consultation" && "Consultație"}
                      {type === "emergency" && "Urgență"}
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
                className={`
                  inline-flex items-center gap-3 px-8 py-4 text-lg font-bold rounded-full
                  transform transition-all duration-300 hover:scale-105
                  ${
                    buttonVariant === "gold"
                      ? "bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600"
                      : "bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600"
                  }
                  text-white shadow-2xl hover:shadow-glow-lg
                  pulse-glow shimmer
                `}
                onClick={() => {
                  if (ctaVariant === "emergency") {
                    window.location.href = "tel:+37361234555";
                  } else {
                    setShowCallbackForm(true);
                  }
                }}
              >
                {currentCTA.button}
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Multiple Contact Options */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <a
                href="tel:+37361234555"
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white hover:bg-white/30 transition-all hover-scale"
              >
                <Phone size={20} />
                <span>Sună Direct</span>
              </a>
              <a
                href="https://wa.me/37361234555"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500/80 backdrop-blur-md px-6 py-3 rounded-full text-white hover:bg-green-500 transition-all hover-scale"
              >
                <MessageCircle size={20} />
                <span>WhatsApp</span>
              </a>
              <button
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white hover:bg-white/30 transition-all hover-scale"
                onClick={() => setShowCallbackForm(true)}
              >
                <Mail size={20} />
                <span>Email</span>
              </button>
            </div>

            {/* Social Proof & Scarcity */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-white/90">
                <TrendingUp size={18} />
                <span className="animate-pulse">
                  {appointmentsToday} persoane au programat astăzi
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/90">
                <AlertCircle size={18} />
                <span className="font-semibold">
                  Doar {spotsLeft} locuri disponibile săptămâna aceasta
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/90">
                <Star size={18} />
                <span>Recomandați de 98% dintre pacienți</span>
              </div>
            </div>

            {/* Guarantee Badge */}
            <div className="mt-8">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
                <Shield size={24} className="text-green-300" />
                <span className="text-white font-semibold">
                  Satisfacție 100% Garantată
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Callback Form Modal */}
      {showCallbackForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl enter-zoom">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gradient-premium">
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
                          : "border-gray-200 hover:border-gold-300"
                      }`}
                    >
                      {method === "phone" && (
                        <Phone className="mx-auto" size={20} />
                      )}
                      {method === "whatsapp" && (
                        <MessageCircle className="mx-auto" size={20} />
                      )}
                      {method === "email" && (
                        <Mail className="mx-auto" size={20} />
                      )}
                      <span className="text-xs mt-1 block">
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Număr de telefon *"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold-500 focus:outline-none transition-all"
                />
              </div>

              {preferredContact === "email" && (
                <div>
                  <input
                    type="email"
                    placeholder="Adresa de email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold-500 focus:outline-none transition-all"
                  />
                </div>
              )}

              <div>
                <select
                  value={formData.service}
                  onChange={(e) => handleInputChange("service", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold-500 focus:outline-none transition-all"
                >
                  <option value="">Selectează serviciul dorit *</option>
                  <option value="consultation">Consultație generală</option>
                  <option value="emergency">Urgență dentară</option>
                  <option value="implant">Implant dentar</option>
                  <option value="orthodontics">Ortodonție</option>
                  <option value="cleaning">Curățare profesională</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        <div className="fixed bottom-8 right-8 z-50 enter-slide-up">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
            <CheckCircle size={24} />
            <div>
              <div className="font-bold">Cerere trimisă cu succes!</div>
              <div className="text-sm">Te vom contacta în curând.</div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-gradient-to-r from-gold-500 to-gold-600 p-4">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <div className="font-bold">Programează-te</div>
            <div className="text-xs">Consultație gratuită</div>
          </div>
          <button
            onClick={() => (window.location.href = "tel:+37361234555")}
            className="bg-white text-gold-600 px-4 py-2 rounded-full font-bold flex items-center gap-2"
          >
            <Phone size={18} />
            <span>Sună Acum</span>
          </button>
        </div>
      </div>

      {/* Exit Intent Popup */}
      {exitIntentShown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl enter-zoom">
            <div className="text-center">
              <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift size={40} className="text-gold-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Stai! Avem o ofertă pentru tine!
              </h3>
              <p className="text-gray-600 mb-6">
                Primește 20% reducere la prima vizită dacă te programezi acum
              </p>
              <button
                className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all"
                onClick={() => {
                  setExitIntentShown(false);
                  setCtaVariant("offer");
                }}
              >
                Vreau Reducerea
              </button>
              <button
                className="mt-3 text-gray-500 hover:text-gray-700"
                onClick={() => setExitIntentShown(false)}
              >
                Nu, mulțumesc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Chat Widget Placeholder */}
      <div className="fixed bottom-8 right-8 z-40 hidden md:block">
        <button className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-full shadow-2xl hover:shadow-glow-lg transition-all hover-scale">
          <MessageCircle size={24} />
        </button>
      </div>
    </>
  );
};

export default CTASection;
