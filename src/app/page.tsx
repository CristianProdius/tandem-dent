// src/app/page.tsx
import {
  HeroSection,
  ServicesSection,
  TestimonialsSection,
  TeamSection,
  ContactSection,
  DoctorSection,
  CTASection,
  FAQSection,
} from "@/components/sections/home";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Premium Landing */}
      <HeroSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Doctor Section */}
      <DoctorSection />

      {/* Team Section */}
      <TeamSection />

      {/* Contact Section */}
      <ContactSection />

      <CTASection />

      <FAQSection />
    </main>
  );
}
