"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
  useMotionValue,
} from "motion/react";
import {
  Award,
  CheckCircle,
  GraduationCap,
  Users,
  Calendar,
  Stethoscope,
  Shield,
  Star,
  Trophy,
  ArrowRight,
  Heart,
  Briefcase,
  Medal,
} from "lucide-react";

interface Achievement {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface Credential {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

// Animated Counter Component
interface CounterProps {
  from: number;
  to: number;
  duration?: number;
  suffix?: string;
}

const AnimatedCounter: React.FC<CounterProps> = ({
  from,
  to,
  duration = 2,
  suffix = "",
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, { duration: duration * 1000 });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(to);
    }
  }, [motionValue, to, isInView]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString() + suffix;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref}>{from}</span>;
};

const DoctorSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const imageY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.95, 1.05, 0.95]
  );
  const decorY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const achievements: Achievement[] = [
    {
      icon: <Trophy className="w-5 h-5" />,
      label: "Implanturi plasate",
      value: "3000+",
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Ani experiență",
      value: "15+",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Pacienți mulțumiți",
      value: "5000+",
    },
  ];

  const credentials: Credential[] = [
    {
      icon: <GraduationCap className="w-5 h-5" />,
      title: 'Diplomă în Stomatologie, USMF "Nicolae Testemițanu"',
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Specializare în Implantologie și Chirurgie Orală",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Membru al Asociației Stomatologilor din Moldova",
    },
    {
      icon: <Medal className="w-5 h-5" />,
      title: "Certificări internaționale în implantologie modernă",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(45deg, transparent 48%, rgba(212, 175, 55, 0.1) 49%, rgba(212, 175, 55, 0.1) 51%, transparent 52%)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        style={{ y: decorY }}
        className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-gold-400/10 to-gold-600/10 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/20"
          >
            <Stethoscope className="w-4 h-4 text-gold-500" />
            <span className="text-sm font-medium text-gold-600 dark:text-gold-400">
              Medicul Nostru Principal
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-gradient-gold">Cunoaște-ți Medicul</span>
          </h2>
        </motion.div>

        {/* Main Content - Split Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Section */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <motion.div
              style={{ y: imageY, scale: imageScale }}
              className="relative"
            >
              {/* Elegant Frame */}
              <div className="relative group">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold-400/20 to-gold-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />

                {/* Image Container with Float Animation */}
                <motion.div
                  className="relative float-animation"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Premium Frame Border */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-400 to-gold-600 rounded-3xl" />

                  {/* Image Placeholder */}
                  <div className="relative m-1 bg-gray-200 dark:bg-gray-800 rounded-3xl overflow-hidden aspect-[3/4]">
                    <img
                      src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070"
                      alt="Dr. Căpățină Vitalie"
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>

                  {/* Floating Badge */}
                  <motion.div
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-xl border border-gold-500/20"
                  >
                    <div className="flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-gold-500" />
                      <div>
                        <div className="text-2xl font-bold text-gradient-gold">
                          <AnimatedCounter from={0} to={3000} suffix="+" />
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Implanturi
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Experience Badge */}
                  <motion.div
                    animate={{ rotate: [0, -5, 0, 5, 0] }}
                    transition={{ duration: 7, repeat: Infinity }}
                    className="absolute -top-4 -left-4 bg-white dark:bg-gray-900 rounded-2xl p-3 shadow-xl border border-gold-500/20"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-teal-500" />
                      <div>
                        <div className="text-xl font-bold text-teal-500">
                          15+
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Ani
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Information Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Name and Title */}
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                Dr. Căpățină Vitalie
              </h3>
              <p className="text-xl text-gold-500 font-medium mb-4">
                Medic Stomatolog Principal
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold-500/10 rounded-full text-sm text-gold-600 dark:text-gold-400">
                  <Briefcase className="w-3 h-3" />
                  Implantologie
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-500/10 rounded-full text-sm text-teal-600 dark:text-teal-400">
                  <Heart className="w-3 h-3" />
                  Chirurgie Orală
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 rounded-full text-sm text-blue-600 dark:text-blue-400">
                  <Shield className="w-3 h-3" />
                  Ortopedie Dentară
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Cu o pasiune pentru excelența în stomatologie și o dedicare față
                de bunăstarea pacienților, Dr. Căpățină Vitalie aduce peste 15
                ani de experiență în tratamente dentare complexe și implanturi
                de ultimă generație.
              </p>
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg text-white mb-2">
                    {achievement.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {achievement.label === "Implanturi plasate" ? (
                      <AnimatedCounter from={0} to={3000} suffix="+" />
                    ) : achievement.label === "Ani experiență" ? (
                      <AnimatedCounter from={0} to={15} suffix="+" />
                    ) : (
                      <AnimatedCounter from={0} to={5000} suffix="+" />
                    )}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {achievement.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Credentials List */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Educație și Certificări
              </h4>
              {credentials.map((credential, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-start gap-3 group"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 dark:text-gray-300">
                      {credential.title}
                    </p>
                    {credential.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        {credential.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2 }}
              className="flex flex-wrap gap-4 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              {/* Badge 1 */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gold-50 dark:bg-gold-900/20 rounded-lg">
                <Award className="w-5 h-5 text-gold-600 dark:text-gold-400" />
                <span className="text-sm font-medium text-gold-800 dark:text-gold-300">
                  Top Implantolog
                </span>
              </div>

              {/* Badge 2 */}
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Membru ASMM
                </span>
              </div>

              {/* Badge 3 */}
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Star className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-800 dark:text-green-300">
                  5.0 Rating
                </span>
              </div>
            </motion.div>

            {/* CTA Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.4 }}
              className="pt-6"
            >
              <a
                href="/echipa"
                className="inline-flex items-center gap-2 text-gold-600 dark:text-gold-400 hover:text-gold-700 dark:hover:text-gold-300 transition-colors group"
              >
                <span className="font-medium">Vezi Toată Echipa</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.6 }}
          className="mt-20 text-center max-w-3xl mx-auto"
        >
          <blockquote className="relative">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-gold-500/20">
              <svg
                className="w-16 h-16"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 italic">
              "Pentru mine, fiecare pacient reprezintă o oportunitate de a reda
              nu doar sănătatea, ci și încrederea în zâmbet. Aceasta este
              misiunea mea."
            </p>
            <footer className="mt-4">
              <cite className="text-gold-600 dark:text-gold-400 font-medium not-italic">
                — Dr. Căpățină Vitalie
              </cite>
            </footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
};

export default DoctorSection;
