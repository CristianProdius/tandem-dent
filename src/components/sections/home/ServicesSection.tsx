"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  Activity,
  Anchor,
  AlignJustify,
  Sparkles,
  Shield,
  ArrowRight,
  CheckCircle,
  Clock,
  Award,
} from "lucide-react";

// Custom Tooth Icon Component
const ToothIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C10.5 2 9 3 9 5C9 6 8.5 7 7.5 7C6.5 7 6 8 6 9C6 11 6 14 7 16L9 22L12 18L15 22L17 16C18 14 18 11 18 9C18 8 17.5 7 16.5 7C15.5 7 15 6 15 5C15 3 13.5 2 12 2Z" />
  </svg>
);

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  benefits?: string[];
  color: "gold" | "teal";
}

const services: Service[] = [
  {
    id: "terapie-dentara",
    name: "Terapie dentară",
    description: "Tratamente complete pentru sănătatea dinților",
    icon: <ToothIcon className="w-6 h-6" />,
    benefits: [
      "Obturații estetice",
      "Tratament carii",
      "Reconstrucții dentare",
    ],
    color: "gold",
  },
  {
    id: "estetica-dentara",
    name: "Estetică dentară",
    description: "Pentru un zâmbet perfect și strălucitor",
    icon: <Sparkles className="w-6 h-6" />,
    benefits: ["Albire profesională", "Fațete dentare", "Bonding estetic"],
    color: "teal",
  },
  {
    id: "ortodontie",
    name: "Ortodonție",
    description: "Aliniere perfectă cu tehnologii moderne",
    icon: <AlignJustify className="w-6 h-6" />,
    benefits: ["Invisalign", "Aparate dentare", "Ortodonție pentru copii"],
    color: "gold",
  },
  {
    id: "implantologie",
    name: "Implantologie",
    description: "Soluții permanente pentru dinți lipsă",
    icon: <Anchor className="w-6 h-6" />,
    benefits: ["Implanturi premium", "Restaurare completă", "Garanție extinsă"],
    color: "teal",
  },
  {
    id: "protetica-dentara",
    name: "Protetică dentară",
    description: "Restaurări complete și estetice",
    icon: <Shield className="w-6 h-6" />,
    benefits: ["Coroane ceramice", "Punți dentare", "Proteze moderne"],
    color: "gold",
  },
  {
    id: "chirurgie-orala",
    name: "Chirurgie orală",
    description: "Intervenții sigure și minim invazive",
    icon: <Activity className="w-6 h-6" />,
    benefits: [
      "Extracții complexe",
      "Chirurgie parodontală",
      "Augmentare osoasă",
    ],
    color: "teal",
  },
  {
    id: "endodontie",
    name: "Endodonție",
    description: "Salvarea dinților prin tratamente de canal",
    icon: <Activity className="w-6 h-6" />,
    benefits: ["Tratament microscopic", "Tehnologie modernă", "Fără durere"],
    color: "gold",
  },
];

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        // Removed 'ease' property to fix type error
      },
    },
  };

  const iconBgClass =
    service.color === "gold"
      ? "bg-gradient-to-br from-gold-400 to-gold-600"
      : "bg-gradient-to-br from-teal-400 to-teal-600";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      <div className="card-hover relative h-full bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:border-gold-400/50 dark:hover:border-gold-400/30">
        {/* Background Gradient on Hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at top left, ${
              service.color === "gold"
                ? "rgba(212, 175, 55, 0.05)"
                : "rgba(20, 184, 166, 0.05)"
            }, transparent)`,
          }}
        />

        {/* Icon Container */}
        <motion.div
          animate={{
            rotate: isHovered ? 360 : 0,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.5 }}
          className="relative mb-4"
        >
          <div
            className={`w-16 h-16 ${iconBgClass} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-glow transition-shadow duration-300`}
          >
            {service.icon}
          </div>

          {/* Floating Sparkle on Hover */}
          {isHovered && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
            </motion.div>
          )}
        </motion.div>

        {/* Service Name */}
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-gradient-gold transition-all duration-300">
          {service.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
          {service.description}
        </p>

        {/* Benefits List (Shows on Hover) */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isHovered ? "auto" : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <ul className="space-y-1 mb-4">
            {service.benefits?.map((benefit, idx) => (
              <motion.li
                key={idx}
                initial={{ x: -20, opacity: 0 }}
                animate={{
                  x: isHovered ? 0 : -20,
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span>{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Learn More Link */}
        <motion.a
          href={`/servicii/${service.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300"
          style={{ color: service.color === "gold" ? "#d4af37" : "#14b8a6" }}
          whileHover={{ x: 5 }}
        >
          Află mai mult
          <ArrowRight className="w-4 h-4" />
        </motion.a>

        {/* Premium Badge for Special Services */}
        {(service.id === "implantologie" || service.id === "ortodontie") && (
          <div className="absolute top-4 right-4">
            <Award className="w-5 h-5 text-gold-400" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ServicesSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(212, 175, 55, 0.1) 35px, rgba(212, 175, 55, 0.1) 70px)`,
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
        className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-gold-400/20 to-gold-600/20 rounded-full blur-2xl"
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          {/* Premium Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/20"
          >
            <Award className="w-4 h-4 text-gold-500" />
            <span className="text-sm font-medium text-gold-600 dark:text-gold-400">
              Servicii Premium
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gradient-gold">Serviciile Noastre</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Clinica Stomatologică Tandem Dent îți pune la dispoziție un spectru
            larg de servicii stomatologice, la cel mai înalt nivel
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-gradient-gold">15+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Ani Experiență
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-gradient-gold">3000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Pacienți Mulțumiți
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-gradient-gold">7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Specializări
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-12"
        >
          {/* Additional Info */}
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 italic">
            "Frumusețea zâmbetului tău trebuie întreținută cu grijă!"
          </p>

          {/* CTA Button */}
          <motion.a
            href="/servicii"
            className="btn-premium inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white rounded-2xl transition-all duration-300 hover-lift hover-glow shimmer group"
            style={{
              background: "linear-gradient(135deg, #d4af37, #b89229)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Vezi Toate Serviciile</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.span>
          </motion.a>

          {/* Quick Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-400" />
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
