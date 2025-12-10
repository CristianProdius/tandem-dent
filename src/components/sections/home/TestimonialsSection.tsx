"use client";

import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { SectionHeader } from "@/components/common";
import { useTranslations } from "next-intl";

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
    <div className="flex gap-0.5 mb-3">
      {[...Array(testimonial.rating)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
    <p className="text-gray-700 leading-relaxed flex-1 mb-4">
      &quot;{testimonial.content}&quot;
    </p>
    <div className="text-sm text-gray-600 pt-4 border-t border-gray-100">
      <span className="font-medium text-gray-900">{testimonial.name}</span>
      <span className="mx-2">•</span>
      <span>{testimonial.date}</span>
    </div>
  </div>
);

const TestimonialsSection: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const t = useTranslations("testimonials");

  // Build testimonials from translations
  const testimonials: Testimonial[] = [
    { id: 1, name: t("items.1.name"), content: t("items.1.content"), rating: 5, date: "2024" },
    { id: 2, name: t("items.2.name"), content: t("items.2.content"), rating: 5, date: "2024" },
    { id: 3, name: t("items.3.name"), content: t("items.3.content"), rating: 5, date: "2024" },
    { id: 4, name: t("items.4.name"), content: t("items.4.content"), rating: 5, date: "2024" },
    { id: 5, name: t("items.5.name"), content: t("items.5.content"), rating: 5, date: "2024" },
    { id: 6, name: t("items.6.name"), content: t("items.6.content"), rating: 5, date: "2024" },
  ];

  // 3 per page on desktop, 1 on mobile
  const itemsPerPageDesktop = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPageDesktop);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Get current testimonials for desktop (3 at a time)
  const startIndex = currentPage * itemsPerPageDesktop;
  const currentTestimonials = testimonials.slice(startIndex, startIndex + itemsPerPageDesktop);

  return (
    <section
      className="py-20 lg:py-28 bg-gradient-to-b from-white via-gray-50/50 to-white"
      id="testimonials"
    >
      <div className="container mx-auto px-4">
        <SectionHeader
          badge={{ icon: MessageSquare, text: t("badge"), color: "gold" }}
          title={t("title")}
          description={t("description")}
        />

        {/* Testimonials with Navigation */}
        <div className="relative max-w-6xl mx-auto">
          {/* Grid - 1 on mobile, 2 on tablet, 3 on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevPage}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-14 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={nextPage}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-14 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentPage
                  ? "w-6 bg-gold-500"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>

        {/* Google Reviews Link */}
        <div className="mt-8 text-center">
          <a
            href="https://www.google.com/search?q=tandem+dent+chisinau+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors"
          >
            <GoogleIcon className="w-4 h-4" />
            <span>{t("googleReviews")}</span>
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
