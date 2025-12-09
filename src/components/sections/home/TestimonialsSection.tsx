"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { Star, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { SectionHeader } from "@/components/common";

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
  content: string;
  rating: number;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Diana S.",
    content:
      "O echipă de profesioniști! Servicii excelente, atmosferă prietenoasă și rezultate foarte bune. Recomand cu drag!",
    rating: 5,
    date: "2024",
  },
  {
    id: 2,
    name: "Irina Jeman",
    content:
      "Oameni minunați, răbdători, care dau dovadă de profesionalism! O echipă care oferă servicii de calitate cu o experiență de apreciat! Vă mulțumesc pentru tot ce ați făcut și faceți pentru mine!",
    rating: 5,
    date: "2024",
  },
  {
    id: 3,
    name: "Andrei Minzarari",
    content:
      "Un colectiv și un grup de profesioniști fenomenali! Vă consiliez această stomatologie de super calitate!",
    rating: 5,
    date: "2024",
  },
  {
    id: 4,
    name: "Maxim Stricaci",
    content:
      "Stomatologie bună, muncă de calitate. Operația a fost făcută cât mai confortabil, plus că setarea psihologică a fost corectă. Vă recomand!",
    rating: 5,
    date: "2024",
  },
  {
    id: 5,
    name: "Dasha Sk",
    content:
      "Super clinică. Îl cunosc pe ortodont și chirurgul din 2016 ca pacient. Chirurgul a scos măseaua de minte, astfel încât să nu simt nimic.",
    rating: 5,
    date: "2024",
  },
];

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, []);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(nextTestimonial, 6000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, nextTestimonial]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > 50) prevTestimonial();
    else if (info.offset.x < -50) nextTestimonial();
  };

  const current = testimonials[currentIndex];

  return (
    <section
      className="py-20 lg:py-28 bg-gradient-to-b from-white via-gray-50/50 to-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      id="testimonials"
    >
      <div className="container mx-auto px-4">
        <SectionHeader
          badge={{ icon: MessageSquare, text: "Recenzii", color: "gold" }}
          title="Ce Spun Pacienții Noștri"
          description="Feedback-ul pacienților noștri ne motivează să oferim servicii de cea mai înaltă calitate"
        />

        {/* Testimonial Card */}
        <div className="relative max-w-2xl mx-auto">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            className="cursor-grab active:cursor-grabbing"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  &quot;{current.content}&quot;
                </p>

                {/* Author */}
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">
                    {current.name}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{current.date}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 rounded-full bg-white shadow border border-gray-100 items-center justify-center hover:bg-gray-50 transition-colors hidden md:flex"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 rounded-full bg-white shadow border border-gray-100 items-center justify-center hover:bg-gray-50 transition-colors hidden md:flex"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-6 bg-yellow-500"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Google Reviews Link */}
        <div className="mt-8 text-center">
          <a
            href="https://www.google.com/search?q=tandem+dent+chisinau+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <GoogleIcon className="w-4 h-4" />
            <span>5.0 pe Google Reviews</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
