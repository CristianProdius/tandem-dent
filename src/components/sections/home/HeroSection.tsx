"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import {
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Star,
  ChevronDown,
} from "lucide-react";

interface FloatingElementProps {
  delay?: number;
  duration?: number;
  className?: string;
  children: React.ReactNode;
}

const FloatingElement: React.FC<FloatingElementProps> = ({
  delay = 0,
  duration = 3,
  className = "",
  children,
}) => (
  <motion.div
    className={`absolute ${className}`}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 5, 0],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
);

const HeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068')`,
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />

          {/* Premium Gold Accent Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/10 via-transparent to-teal-500/10" />
        </div>
      </motion.div>

      {/* Floating Decorative Elements */}
      <FloatingElement
        delay={0}
        duration={4}
        className="top-20 left-10 md:left-20 opacity-20"
      >
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 blur-3xl" />
      </FloatingElement>

      <FloatingElement
        delay={1}
        duration={5}
        className="bottom-20 right-10 md:right-20 opacity-20"
      >
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 blur-3xl" />
      </FloatingElement>

      <FloatingElement
        delay={2}
        duration={3.5}
        className="top-1/3 right-1/4 opacity-30"
      >
        <Sparkles className="w-8 h-8 text-gold-400" />
      </FloatingElement>

      {/* Main Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div className="w-full max-w-7xl" style={{ opacity }}>
          {/* Glass Morphism Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="glass backdrop-blur-xl rounded-3xl p-8 md:p-12 lg:p-16 mx-auto max-w-5xl"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              boxShadow:
                "0 20px 40px rgba(0, 0, 0, 0.1), 0 0 60px rgba(212, 175, 55, 0.1)",
            }}
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-gold-500/20 to-gold-600/20 border border-gold-500/30"
            >
              <Star className="w-4 h-4 text-gold-400" />
              <span className="text-sm font-medium text-gold-300">
                Clinică Premium în Chișinău
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight"
            >
              <span className="text-gradient-gold block">
                Zâmbete Sănătoase
              </span>
              <span className="text-white block mt-2">în Chișinău</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-10 text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl"
            >
              Pentru noi eficacitatea tratamentului și siguranța pacienților
              este prioritară!
            </motion.p>

            {/* CTA Buttons Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              {/* Primary CTA Button */}
              <button
                onClick={scrollToContact}
                className="btn-premium group relative overflow-hidden px-8 py-4 text-lg font-semibold text-white rounded-2xl transition-all duration-300 hover-lift hover-glow shimmer"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #b89229)",
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Programează-te Acum
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </button>

              {/* Secondary CTA Button */}
              <a
                href="tel:+37361234555"
                className="group flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-gold-400/50 hover-lift"
              >
                <Phone className="w-5 h-5" />
                <span>Sună Acum</span>
              </a>
            </motion.div>

            {/* Quick Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* Working Hours Card */}
              <div className="glass-dark backdrop-blur-md rounded-xl p-4 border border-white/10 hover-lift transition-all duration-300">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gold-400">Program</p>
                    <p className="text-white">Luni-Vineri: 9:00-18:00</p>
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div className="glass-dark backdrop-blur-md rounded-xl p-4 border border-white/10 hover-lift transition-all duration-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gold-400">Locație</p>
                    <p className="text-white">Str. N. Zelinski 5/8</p>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="glass-dark backdrop-blur-md rounded-xl p-4 border border-white/10 hover-lift transition-all duration-300">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gold-400">Telefon</p>
                    <p className="text-white">061 234 555</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={scrollToContact}
            >
              <span className="text-white/60 text-sm">Descoperă Mai Mult</span>
              <ChevronDown className="w-6 h-6 text-gold-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
            fillOpacity="0.05"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
