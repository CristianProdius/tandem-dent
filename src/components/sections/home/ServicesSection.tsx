"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight, Award } from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { SectionHeader } from "@/components/common";

interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
}

const services: Service[] = [
  {
    id: "terapie-dentara",
    name: "Terapie dentară",
    description: "Tratamente complete pentru sănătatea dinților",
    image: "/images/services/terapie-dentara.png",
  },
  {
    id: "ortopedie-dentara",
    name: "Ortopedie dentară",
    description: "Restaurări complete și funcționale",
    image: "/images/services/ortopedie-dentara.png",
  },
  {
    id: "ortodontie",
    name: "Ortodonție",
    description: "Aliniere perfectă cu tehnologii moderne",
    image: "/images/services/ortodontie.png",
  },
  {
    id: "implantologie",
    name: "Implantologie",
    description: "Soluții permanente pentru dinți lipsă",
    image: "/images/services/implantologie.png",
  },
  {
    id: "chirurgie-orala",
    name: "Chirurgie orală",
    description: "Intervenții sigure și minim invazive",
    image: "/images/services/chirurgie-orala.png",
  },
];

const ServicesSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-gray-50 to-white"
      id="services"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(250, 204, 21, 0.1) 35px, rgba(250, 204, 21, 0.1) 70px)`,
          }}
        />
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full blur-2xl"
      />

      <motion.div
        animate={{
          y: [0, 30, 0],
          rotate: [360, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-teal-600/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <SectionHeader
          badge={{ icon: Award, text: "Servicii Premium", color: "gold" }}
          title="Serviciile Noastre"
          description="Clinica Stomatologică Tandem Dent îți pune la dispoziție un spectru larg de servicii stomatologice, la cel mai înalt nivel"
        />

        {/* Inline Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-12"
        >
          <span className="text-sm text-gray-600">
            <span className="font-semibold text-yellow-600">15+</span> ani experiență
          </span>
          <span className="hidden sm:inline text-gray-300">•</span>
          <span className="text-sm text-gray-600">
            <span className="font-semibold text-yellow-600">3000+</span> pacienți mulțumiți
          </span>
        </motion.div>

        {/* Bento Grid Services - Light theme, images, simple description */}
        <BentoGrid className="max-w-7xl mx-auto mb-12">
          {services.map((service) => (
            <BentoGridItem
              key={service.id}
              title={service.name}
              description={service.description}
              image={service.image}
              className={service.id === "implantologie" ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-12"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-yellow-500 rounded-xl transition-all duration-200 hover:bg-yellow-600 hover:shadow-lg"
          >
            Programează o Consultație
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
