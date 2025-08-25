"use client";

import React from "react";
import { motion } from "motion/react";
import { Phone, MapPin, Clock, Star, ChevronDown } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/clinic/hero.png')`,
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />

          {/* Premium Gold Accent Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/10 via-transparent to-teal-500/10" />
        </div>
      </motion.div>

      {/* CSS-only animated elements - Adjusted for mobile */}
      <div className="absolute top-10 sm:top-20 left-5 sm:left-10 md:left-20 opacity-20 pointer-events-none">
        <div className="w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 blur-2xl sm:blur-3xl hero-float-1" />
      </div>

      <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 md:right-20 opacity-20 pointer-events-none">
        <div className="w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 blur-2xl sm:blur-3xl hero-float-2" />
      </div>

      <div className="absolute top-1/3 right-1/4 opacity-30 pointer-events-none hidden sm:block">
        <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 blur-xl sm:blur-2xl hero-float-3" />
      </div>

      {/* Main Content Container - Adjusted padding for mobile */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-8 sm:pb-12 mt-6">
        <motion.div className="w-full max-w-7xl">
          {/* Glass Morphism Card - Responsive padding */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-7xl"
          >
            <div className="hero-glass-card backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16">
              {/* Premium Badge - Smaller on mobile */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-gold-500/20 to-gold-600/20 border border-gold-500/30"
              >
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gold-400" />
                <span className="text-xs sm:text-sm font-medium text-gold-300">
                  Clinică Premium în Chișinău
                </span>
              </motion.div>

              {/* Main Headline - Responsive text sizing */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mb-4 sm:mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight"
              >
                <span className="text-gradient-gold block">
                  Zâmbete Sănătoase
                </span>
                <span className="text-white block mt-1 sm:mt-2">
                  în Chișinău
                </span>
              </motion.h1>

              {/* Subtitle - Responsive text and spacing */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mb-6 sm:mb-8 md:mb-10 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl"
              >
                Pentru noi eficacitatea tratamentului și siguranța pacienților
                este prioritară!
              </motion.p>

              {/* CTA Buttons Container - Stack on mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12"
              >
                {/* Primary CTA Button - Full width on mobile */}
                <button className="hero-btn-primary group relative overflow-hidden  sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white rounded-xl sm:rounded-2xl transition-all duration-300 w-full sm:w-auto">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Programează-te Acum
                    <span className="hero-arrow">→</span>
                  </span>
                </button>

                {/* Secondary CTA Button - Full width on mobile */}
                <a
                  href="tel:+37361234555"
                  className="group flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white border-2 border-white/30 rounded-xl sm:rounded-2xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-gold-400/50 hero-btn-secondary w-full sm:w-auto"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Sună Acum</span>
                </a>
              </motion.div>

              {/* Quick Info Cards - Stack on mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
              >
                {/* Working Hours Card */}
                <div className="hero-info-card backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 transition-all duration-300">
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 mt-0.5 sm:mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gold-400">
                        Program
                      </p>
                      <p className="text-white text-sm sm:text-base">
                        Luni-Vineri: 9:00-18:00
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="hero-info-card backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 transition-all duration-300">
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 mt-0.5 sm:mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gold-400">
                        Locație
                      </p>
                      <p className="text-white text-sm sm:text-base">
                        Str. N. Zelinski 5/8
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone Card - Full width on smallest mobile */}
                <div className="hero-info-card backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 transition-all duration-300 col-span-1 sm:col-span-2 md:col-span-1">
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 mt-0.5 sm:mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gold-400">
                        Telefon
                      </p>
                      <p className="text-white text-sm sm:text-base">
                        061 234 555
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll Indicator - Smaller on mobile */}
          <div className="hero-scroll-indicator">
            <div className="flex flex-col items-center gap-1 sm:gap-2 cursor-pointer">
              <span className="text-white/60 text-xs sm:text-sm">
                Descoperă Mai Mult
              </span>
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gold-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Bottom Wave - Responsive height */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
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
