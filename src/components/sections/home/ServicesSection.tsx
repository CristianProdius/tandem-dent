"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import {
  ArrowRight,
  Clock,
  CheckCircle,
  Shield,
  Award,
} from "lucide-react";
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
    image: "/images/services/terapie-dentara.jpg",
  },
  {
    id: "ortopedie-dentara",
    name: "Ortopedie dentară",
    description: "Restaurări complete și funcționale",
    image: "/images/services/ortopedie-dentara.jpg",
  },
  {
    id: "ortodontie",
    name: "Ortodonție",
    description: "Aliniere perfectă cu tehnologii moderne",
    image: "/images/services/ortodontie.jpg",
  },
  {
    id: "implantologie",
    name: "Implantologie",
    description: "Soluții permanente pentru dinți lipsă",
    image: "/images/services/implantologie.jpg",
  },
  {
    id: "chirurgie-orala",
    name: "Chirurgie orală",
    description: "Intervenții sigure și minim invazive",
    image: "/images/services/chirurgie-orala.jpg",
  },
];

const ServicesSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Service image header
  const ServiceHeader = ({ service }: { service: Service }) => {
    return (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden relative bg-gray-100">
        <Image
          src={service.image}
          alt={service.name}
          fill
          className="object-cover"
          onError={(e) => {
            // Fallback to gradient if image doesn't exist
            e.currentTarget.style.display = 'none';
            if (e.currentTarget.parentElement) {
              e.currentTarget.parentElement.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
            }
          }}
        />
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-gray-50 to-white"
      id="servicii"
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

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                15+
              </div>
              <div className="text-sm text-gray-600">Ani Experiență</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                3000+
              </div>
              <div className="text-sm text-gray-600">Pacienți Mulțumiți</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                5
              </div>
              <div className="text-sm text-gray-600">Servicii Premium</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bento Grid Services - Light theme, images, simple description */}
        <BentoGrid className="max-w-7xl mx-auto mb-12">
          {services.map((service) => (
            <BentoGridItem
              key={service.id}
              title={service.name}
              description={service.description}
              header={<ServiceHeader service={service} />}
              className={service.id === "implantologie" ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          {/* Additional Info */}
          <p className="text-lg text-gray-600 mb-8 italic">
            &quot;Frumusețea zâmbetului tău trebuie întreținută cu grijă!&quot;
          </p>

          {/* CTA Button */}
          <motion.a
            href="#contact"
            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #facc15, #eab308)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Programează o Consultație</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.span>
          </motion.a>

          {/* Quick Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span>Consultație gratuită</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Garanție pentru toate tratamentele</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-500" />
              <span>Echipamente moderne</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
