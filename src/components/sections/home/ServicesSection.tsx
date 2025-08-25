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
      },
    },
  };

  const iconBgClass =
    service.color === "gold"
      ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
      : "bg-gradient-to-br from-teal-400 to-teal-600";

  const hoverBorderClass =
    service.color === "gold"
      ? "hover:border-yellow-400/50"
      : "hover:border-teal-400/50";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group h-full"
    >
      <div
        className={`relative h-full bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-500 ${hoverBorderClass} hover:shadow-xl flex flex-col`}
      >
        {/* Background Gradient on Hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at top left, ${
              service.color === "gold"
                ? "rgba(250, 204, 21, 0.05)"
                : "rgba(20, 184, 166, 0.05)"
            }, transparent)`,
          }}
        />

        {/* Premium Badge for Special Services */}
        {(service.id === "implantologie" || service.id === "ortodontie") && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-6 right-6 z-10"
          >
            <div className="relative">
              <Award className="w-6 h-6 text-yellow-400" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl"
              />
            </div>
          </motion.div>
        )}

        {/* Card Content */}
        <div className="relative z-10 p-8 flex flex-col flex-1">
          {/* Top Section - Icon and Title */}
          <div className="mb-6">
            {/* Icon Container */}
            <motion.div
              animate={{
                rotate: isHovered ? 360 : 0,
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.6, type: "spring" }}
              className="relative mb-5 inline-block"
            >
              <div
                className={`w-14 h-14 ${iconBgClass} rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
                  isHovered ? "shadow-2xl" : ""
                }`}
              >
                {service.icon}
              </div>

              {/* Floating Sparkle on Hover */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isHovered ? 1 : 0,
                  opacity: isHovered ? 1 : 0,
                  rotate: isHovered ? 360 : 0,
                }}
                transition={{ duration: 0.4 }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
            </motion.div>

            {/* Service Name */}
            <h3
              className={`text-2xl font-bold mb-3 text-gray-900 transition-colors duration-300 ${
                isHovered
                  ? service.color === "gold"
                    ? "text-yellow-600"
                    : "text-teal-600"
                  : ""
              }`}
            >
              {service.name}
            </h3>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed text-base">
              {service.description}
            </p>
          </div>

          {/* Middle Section - Benefits (Always visible but highlighted on hover) */}
          <div className="flex-1 mb-6">
            <motion.div
              animate={{
                opacity: isHovered ? 1 : 0.7,
                y: isHovered ? 0 : 5,
              }}
              transition={{ duration: 0.3 }}
            >
              <ul className="space-y-2.5">
                {service.benefits?.map((benefit, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0.6, x: 0 }}
                    animate={{
                      opacity: isHovered ? 1 : 0.6,
                      x: isHovered ? 8 : 0,
                    }}
                    transition={{
                      delay: isHovered ? idx * 0.1 : 0,
                      duration: 0.3,
                    }}
                    className="flex items-start gap-2.5 text-sm text-gray-600"
                  >
                    <motion.div
                      animate={{
                        scale: isHovered ? 1.2 : 1,
                        rotate: isHovered ? 360 : 0,
                      }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <CheckCircle
                        className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-colors duration-300 ${
                          isHovered ? "text-green-500" : "text-gray-400"
                        }`}
                      />
                    </motion.div>
                    <span
                      className={`transition-colors duration-300 ${
                        isHovered ? "text-gray-700 font-medium" : ""
                      }`}
                    >
                      {benefit}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Bottom Section - CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              y: isHovered ? -2 : 0,
            }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <a
              href={`/servicii/${service.id}`}
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isHovered
                  ? service.color === "gold"
                    ? "bg-yellow-50 text-yellow-700"
                    : "bg-teal-50 text-teal-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>Află mai mult</span>
              <motion.div
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </a>
          </motion.div>
        </div>

        {/* Decorative Corner Element */}
        <motion.div
          className={`absolute bottom-0 right-0 w-24 h-24 opacity-10 ${
            service.color === "gold" ? "bg-yellow-400" : "bg-teal-400"
          }`}
          style={{
            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
          }}
          animate={{
            scale: isHovered ? 1.5 : 1,
            opacity: isHovered ? 0.15 : 0.05,
          }}
          transition={{ duration: 0.4 }}
        />
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
      className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-gray-50 to-white"
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
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20"
          >
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-600">
              Servicii Premium
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span>Serviciile Noastre</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
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
                7
              </div>
              <div className="text-sm text-gray-600">Specializări</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Services Grid - Improved spacing */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10 mb-12"
          role="list"
        >
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

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
            href="/servicii"
            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #facc15, #eab308)",
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
