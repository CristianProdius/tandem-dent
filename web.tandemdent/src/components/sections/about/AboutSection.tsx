"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Users,
  Shield,
  Handshake,
  Award,
  Star,
  CheckCircle,
  Play,
  Camera,
  Zap,
  Scan,
  Armchair,
  Trophy,
  Smile,
  Building,
  ChevronLeft,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

const AboutSection = () => {
  const [activeValue, setActiveValue] = useState(0);
  const [counters, setCounters] = useState({
    years: 0,
    procedures: 0,
    patients: 0,
    team: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  const statsRef = useRef(null);

  // Core Values Data
  const coreValues = [
    {
      icon: Heart,
      title: "Grijă",
      description: "Tratăm fiecare pacient cu compasiune și înțelegere",
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      icon: Users,
      title: "Implicare",
      description:
        "O echipă implicată, profesionistă și atentă la nevoile fiecărui pacient",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Shield,
      title: "Confort",
      description:
        "Tehnologie modernă, soluții minim-invazive și o abordare personalizată",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Handshake,
      title: "Colaborare",
      description:
        "Ascultarea activă și colaborarea sunt esențiale pentru succesul tratamentului",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  // Timeline Data
  const timeline = [
    { year: "2020", event: "Fondarea Clinicii Tandem Dent", icon: Building },
    { year: "2021", event: "1000+ pacienți mulțumiți", icon: Smile },
    { year: "2022", event: "3000+ implanturi de succes", icon: Trophy },
    { year: "2023", event: "Gold Invisalign Provider", icon: Award },
    {
      year: "2024",
      event: "Diplomă de Excelență în Servicii Medicale",
      icon: Star,
    },
  ];

  // Technology Items
  const technology = [
    { icon: Scan, name: "Radiografii digitale", desc: "Cu radiații minime" },
    { icon: Zap, name: "Laser dentar", desc: "Tratamente fără durere" },
    { icon: Camera, name: "Cameră intraorală", desc: "Explicații clare" },
    { icon: Armchair, name: "Scaune confortabile", desc: "Cu perne încălzite" },
  ];

  // Certifications
  const certifications = [
    { title: "Autorizație ANSP", desc: "Autorizație de funcționare" },
    { title: "Colegiul Stomatologilor", desc: "Membru activ" },
    { title: "Gold Invisalign Provider", desc: "Certificat 2023" },
    { title: "Diplomă de Excelență", desc: "Servicii medicale 2023" },
  ];

  // Counter animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = {
      years: 15,
      procedures: 3000,
      patients: 5000,
      team: 8,
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounters({
        years: Math.floor(targets.years * progress),
        procedures: Math.floor(targets.procedures * progress),
        patients: Math.floor(targets.patients * progress),
        team: Math.floor(targets.team * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, interval);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section with Clinic Background */}
      <div className="relative h-[600px] overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-teal-500/20">
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Parallax Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)",
            transform: "translateY(0)",
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto enter-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Salut, noi suntem echipa
              <span className="text-gradient-gold block mt-2">
                Tandem Dent!
              </span>
            </h1>
            <div className="glass-dark p-6 rounded-2xl backdrop-blur-md">
              <p className="text-xl text-white/90 leading-relaxed">
                Clinica Stomatologică care a luat naștere din pasiune, muncă și
                experiență, alături de o echipă de medici profesioniști,
                dedicați și preocupați de a vă oferi cele mai bune și inovative
                servicii stomatologice.
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm">Descoperă povestea noastră</span>
            <ChevronLeft className="rotate-[-90deg]" size={24} />
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="enter-slide-up">
              <h2 className="text-4xl font-bold mb-6">
                <span className="text-gradient-premium">Misiunea Noastră</span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                La Tandem Dent îmbinăm tehnologia modernă cu o abordare
                personalizată pentru a oferi tratamente adaptate fiecărui
                pacient.
              </p>
              <p className="text-gray-600 mb-8">
                Pentru noi, eficacitatea tratamentului și siguranța pacienților
                este prioritară! Zâmbește și cucerește lumea din jur!
              </p>
              <button className="btn-premium flex items-center gap-2">
                <Play size={20} />
                Tur Virtual al Clinicii
              </button>
            </div>
            <div className="relative">
              {/* Video Placeholder */}
              <div className="relative rounded-2xl overflow-hidden shadow-premium aspect-video bg-gradient-to-br from-gold-100 to-teal-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover-scale cursor-pointer">
                    <Play size={32} className="text-gold-500 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-gradient-premium">Valorile Noastre</span>
            </h2>
            <p className="text-xl text-gray-600">
              Principiile care ne ghidează în fiecare zi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="group hover-scale cursor-pointer"
                  onMouseEnter={() => setActiveValue(index)}
                >
                  <div
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                      activeValue === index
                        ? "border-gold-500 shadow-glow bg-gradient-to-br from-gold-50 to-white"
                        : "border-gray-200 hover:border-gold-300"
                    }`}
                  >
                    <div
                      className={`w-16 h-16 ${value.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon size={32} className={value.color} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div
        ref={statsRef}
        className="py-20 bg-gradient-to-r from-gold-500 to-gold-600 text-white"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 text-glow">
                {counters.years}+
              </div>
              <div className="text-gold-100">Ani de Experiență</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 text-glow">
                {counters.procedures}+
              </div>
              <div className="text-gold-100">Proceduri de Succes</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 text-glow">
                {counters.patients}+
              </div>
              <div className="text-gold-100">Pacienți Mulțumiți</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 text-glow">
                {counters.team}
              </div>
              <div className="text-gold-100">Membri în Echipă</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Timeline */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="text-gradient-premium">Parcursul Nostru</span>
          </h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-gold-300 to-teal-300"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center ${
                      index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    } enter-slide-up`}
                  >
                    <div className="flex-1">
                      <div
                        className={`p-6 bg-white rounded-xl shadow-soft-lg hover-lift ${
                          index % 2 === 0 ? "mr-8 text-right" : "ml-8"
                        }`}
                      >
                        <div className="text-2xl font-bold text-gold-500 mb-2">
                          {item.year}
                        </div>
                        <div className="text-gray-700">{item.event}</div>
                      </div>
                    </div>
                    <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center shadow-glow">
                      <Icon size={28} className="text-white" />
                    </div>
                    <div className="flex-1"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Technology Showcase */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="text-gradient-premium">Tehnologie Modernă</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technology.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <div
                  key={index}
                  className="card-hover border-premium rounded-xl p-6 text-center"
                >
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mb-4 float-animation">
                    <Icon size={36} className="text-teal-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{tech.name}</h3>
                  <p className="text-gray-600 text-sm">{tech.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Certifications Carousel */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="text-gradient-premium">
              Certificări & Afilieri
            </span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="group">
                <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-premium transition-all border border-gold-200 hover:border-gold-400">
                  <div className="flex items-center justify-between mb-4">
                    <Award size={32} className="text-gold-500" />
                    <CheckCircle size={20} className="text-green-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{cert.title}</h3>
                  <p className="text-gray-600 text-sm">{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Comparison */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="text-gradient-premium">De Ce Să Ne Alegi?</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gold-400 to-gold-500 rounded-full flex items-center justify-center mb-4 pulse-glow">
                <Target size={36} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Abordare Personalizată</h3>
              <p className="text-gray-600">
                Fiecare pacient primește un plan de tratament adaptat nevoilor
                sale specifice
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center mb-4 pulse-glow">
                <Sparkles size={36} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Tehnologie de Ultimă Oră
              </h3>
              <p className="text-gray-600">
                Echipamente moderne pentru tratamente eficiente și confortabile
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gold-400 to-gold-500 rounded-full flex items-center justify-center mb-4 pulse-glow">
                <TrendingUp size={36} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Rezultate Dovedite</h3>
              <p className="text-gray-600">
                Peste 5000 de pacienți mulțumiți și mii de proceduri de succes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Message from Dr. Căpățină */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-premium p-8 md:p-12">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-200 to-gold-300 flex-shrink-0 flex items-center justify-center">
                <div className="text-3xl font-bold text-gold-700">VC</div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  Mesaj de la Dr. Căpățină Vitalie
                </h3>
                <p className="text-gray-600">
                  Fondator & Medic Stomatolog Principal
                </p>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="italic">&quot;Dragă pacient,</p>
              <p>
                Când am fondat Tandem Dent, visul meu a fost să creez o clinică
                unde fiecare pacient să se simtă ca acasă, unde teama de
                stomatolog să fie înlocuită cu încredere și confort.
              </p>
              <p>
                După 15 ani de experiență și peste 3000 de implanturi plasate cu
                succes, pot spune cu mândrie că am reușit să construim nu doar o
                clinică, ci o familie dedicată sănătății dumneavoastră.
              </p>
              <p>
                Vă așteptăm cu drag să faceți parte din familia Tandem
                Dent!&quot;
              </p>
              <div className="mt-6">
                <div className="font-handwriting text-3xl text-gold-600">
                  Dr. V. Căpățină
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center gap-3 px-6 py-3 bg-gold-50 rounded-full">
              <Shield size={24} className="text-gold-600" />
              <span className="font-semibold text-gold-800">
                Garanție 100% Satisfacție
              </span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-teal-50 rounded-full">
              <Award size={24} className="text-teal-600" />
              <span className="font-semibold text-teal-800">
                15+ Ani de Excelență
              </span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-gold-50 rounded-full">
              <Users size={24} className="text-gold-600" />
              <span className="font-semibold text-gold-800">
                5000+ Pacienți Fericiți
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
