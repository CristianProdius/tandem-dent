// src/app/page.tsx
import {
  HeroSection,
  ServicesSection,
  TestimonialsSection,
  TeamSection,
  ContactSection,
  FAQSection,
} from "@/components/sections/home";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero - First impression & primary CTA */}
      <HeroSection />

      {/* Services - What we offer */}
      <ServicesSection />

      {/* Team - Who will treat you (builds trust) */}
      <TeamSection />

      {/* Testimonials - Social proof (validates trust) */}
      <TestimonialsSection />

      {/* FAQ - Answer objections before booking */}
      <FAQSection />

      {/* Contact - Final conversion point */}
      <ContactSection />
    </main>
  );
}
