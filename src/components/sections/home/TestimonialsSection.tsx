"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  PanInfo,
} from "motion/react";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  Award,
  Heart,
} from "lucide-react";

// Google Icon Component
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  date?: string;
  verified?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Diana S.",
    role: "Pacientă",
    content:
      "O echipă de profesioniști! Servicii excelente, atmosferă prietenoasă și rezultate foarte bune. Recomand cu drag!",
    rating: 5,
    date: "2024",
    verified: true,
  },
  {
    id: 2,
    name: "Irina Jeman",
    role: "Pacientă",
    content:
      "Oameni minunați, răbdători, care dau dovadă de profesionalism! O echipă care oferă servicii de calitate cu o experiență de apreciat! Vă mulțumesc pentru tot ce ați făcut și faceți pentru mine! Baftă în continuare și o să vă recomand și în continuare cu mare drag!",
    rating: 5,
    date: "2024",
    verified: true,
  },
  {
    id: 3,
    name: "Andrei Minzarari",
    role: "Pacient",
    content:
      "Un colectiv și un grup de profesioniști fenomenali! Vă consiliez această stomatologie de super calitate!",
    rating: 5,
    date: "2024",
    verified: true,
  },
];

// Additional testimonials for the full carousel
const additionalTestimonials: Testimonial[] = [
  {
    id: 4,
    name: "Ina Braguta",
    role: "Pacientă",
    content: "Cei mai buni!",
    rating: 5,
    date: "2024",
    verified: true,
  },
  {
    id: 5,
    name: "Maxim Stricaci",
    role: "Pacient",
    content:
      "Stomatologie bună, muncă de calitate. Operația a fost făcută cât mai confortabil, plus că setarea psihologică a fost corectă. Vă recomand!",
    rating: 5,
    date: "2024",
    verified: true,
  },
  {
    id: 6,
    name: "Dasha Sk",
    role: "Pacientă",
    content:
      "Super clinică. Îl cunosc pe ortodont și chirurgul din 2016 ca pacient. Chirurgul a scos măseaua de minte, astfel încât să nu simt nimic.",
    rating: 5,
    date: "2024",
    verified: true,
  },
];

const allTestimonials = [...testimonials, ...additionalTestimonials];

interface TestimonialCardProps {
  testimonial: Testimonial;
  isActive: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  isActive,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.9,
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="w-full"
    >
      <div className="relative max-w-3xl mx-auto">
        {/* Quote Background Decoration */}
        <div className="absolute -top-6 -left-6 text-gold-500/10">
          <Quote className="w-24 h-24 fill-current" />
        </div>

        <div className="relative glass backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-premium border border-gold-500/10">
          {/* Rating Stars */}
          <div className="flex items-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Star className="w-5 h-5 fill-gold-400 text-gold-400" />
              </motion.div>
            ))}
            {testimonial.verified && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="ml-2 flex items-center gap-1 px-2 py-1 bg-green-500/10 rounded-full"
              >
                <ThumbsUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600 dark:text-green-400">
                  Verificat
                </span>
              </motion.div>
            )}
          </div>

          {/* Testimonial Content */}
          <blockquote className="relative">
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed italic mb-6">
              "{testimonial.content}"
            </p>
          </blockquote>

          {/* Author Info */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-lg text-gray-900 dark:text-white">
                {testimonial.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {testimonial.role} • {testimonial.date}
              </div>
            </div>

            {/* Heart Icon */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-red-500"
            >
              <Heart className="w-6 h-6 fill-current" />
            </motion.div>
          </div>
        </div>

        {/* Quote End Decoration */}
        <div className="absolute -bottom-6 -right-6 text-gold-500/10 rotate-180">
          <Quote className="w-24 h-24 fill-current" />
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);
  const scale = useTransform(x, [-100, 0, 100], [0.95, 1, 0.95]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        nextTestimonial();
      }, 5000); // Change testimonial every 5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex, isPaused]);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % allTestimonials.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + allTestimonials.length) % allTestimonials.length
    );
  }, []);

  const goToTestimonial = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Handle swipe gestures
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      prevTestimonial();
    } else if (info.offset.x < -threshold) {
      nextTestimonial();
    }
  };

  return (
    <section
      className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50  dark:via-gray-950 dark:to-gray-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.15) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-gold-400/10 to-gold-600/10 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Premium Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/20"
          >
            <MessageSquare className="w-4 h-4 text-gold-500" />
            <span className="text-sm font-medium text-gold-600 dark:text-gold-400">
              Părerile Pacienților
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-gradient-gold">Ce Spun Pacienții Noștri</span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Încrederea și satisfacția pacienților noștri sunt cele mai
            importante mărturii ale muncii noastre
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div className="relative" style={{ opacity, scale }}>
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ x }}
            className="cursor-grab active:cursor-grabbing"
          >
            <AnimatePresence mode="wait">
              <TestimonialCard
                key={currentIndex}
                testimonial={allTestimonials[currentIndex]}
                isActive={true}
              />
            </AnimatePresence>
          </motion.div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gold-500/20 flex items-center justify-center hover:bg-gold-50 dark:hover:bg-gray-700 transition-colors group"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-gold-500 transition-colors" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gold-500/20 flex items-center justify-center hover:bg-gold-50 dark:hover:bg-gray-700 transition-colors group"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-gold-500 transition-colors" />
          </button>
        </motion.div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {allTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-gradient-to-r from-gold-400 to-gold-600"
                  : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Google Reviews Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <a
            href="https://www.google.com/search?q=tandem+dent+chisinau"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-shadow group"
          >
            <GoogleIcon className="w-6 h-6" />
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-gold-400 text-gold-400"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                5.0 pe Google Reviews
              </span>
            </div>
            <Award className="w-5 h-5 text-gold-500 group-hover:rotate-12 transition-transform" />
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient-gold">98%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Pacienți Mulțumiți
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient-gold">3000+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Recenzii Pozitive
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient-gold">5.0</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Rating Mediu
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
