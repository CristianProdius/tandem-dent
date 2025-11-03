"use client";

import React, { useEffect, useRef } from "react";
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
  Shield,
  Star,
  Trophy,
  ArrowRight,
  Heart,
  Briefcase,
  Medal,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { SectionHeader } from "@/components/common";

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
      className="relative py-24 lg:py-36 overflow-hidden bg-gradient-to-br from-gold-50/20 via-white to-gold-50/30"
    >
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(217 119 6) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Enhanced Floating Decorative Elements */}
      <motion.div
        style={{ y: decorY }}
        className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-gold-300/20 via-yellow-300/15 to-gold-300/20 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-gold-200/20 to-yellow-200/20 rounded-full blur-3xl"
      />

      {/* Additional decorative elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-gold-200/10 to-transparent rounded-full"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <SectionHeader
          badge={{ icon: Sparkles, text: "Medicul Nostru Principal", color: "gold" }}
          title="Cunoaște-ți Medicul"
          description="Experiență, profesionalism și grijă pentru fiecare pacient"
        />

        {/* Main Content - Premium Split Layout */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Enhanced Image Section */}
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
              <div className="relative group">
                {/* Premium Background Glow */}
                <div className="absolute -inset-4 bg-gradient-to-br from-gold-400/30 via-yellow-400/20 to-gold-400/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700" />

                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Premium Frame with Gold Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-400 via-yellow-500 to-gold-400 rounded-3xl shadow-2xl" />

                  {/* Image Container */}
                  <div className="relative m-[3px] bg-white rounded-3xl overflow-hidden aspect-[3/4] shadow-inner">
                    <Image
                      src="/images/docs/vitalie.jpg"
                      alt="Dr. Căpățină Vitalie"
                      className="w-full h-full object-cover"
                      width={500}
                      height={500}
                    />

                    {/* Premium Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>

 

   
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Premium Information Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Name and Title with Premium Style */}
            <div>
              <h3 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Dr. Căpățină Vitalie
              </h3>
              <p className="text-xl font-semibold bg-gradient-to-r from-gold-500 to-gold-600 bg-clip-text text-transparent mb-5">
                Medic Stomatolog Principal
              </p>

              {/* Premium Specialty Tags */}
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold-100 to-yellow-100 rounded-full text-sm font-semibold text-gold-700 shadow-md">
                  <Briefcase className="w-4 h-4" />
                  Implantologie
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full text-sm font-semibold text-emerald-700 shadow-md">
                  <Heart className="w-4 h-4" />
                  Chirurgie Orală
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full text-sm font-semibold text-blue-700 shadow-md">
                  <Shield className="w-4 h-4" />
                  Ortopedie Dentară
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed text-lg">
                Cu o pasiune pentru excelența în stomatologie și o dedicare față
                de bunăstarea pacienților, Dr. Căpățină Vitalie aduce peste 15
                ani de experiență în tratamente dentare complexe și implanturi
                de ultimă generație.
              </p>
            </div>

            {/* Premium Achievement Stats */}
            <div className="grid grid-cols-3 gap-5">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="relative text-center p-5 bg-white rounded-2xl shadow-xl border border-gold-100 overflow-hidden group"
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-50 to-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-500 rounded-xl text-white mb-3 shadow-lg">
                      {achievement.icon}
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-gold-500 to-gold-600 bg-clip-text text-transparent">
                      {achievement.label === "Implanturi plasate" ? (
                        <AnimatedCounter from={0} to={3000} suffix="+" />
                      ) : achievement.label === "Ani experiență" ? (
                        <AnimatedCounter from={0} to={15} suffix="+" />
                      ) : (
                        <AnimatedCounter from={0} to={5000} suffix="+" />
                      )}
                    </div>
                    <div className="text-xs text-gray-600 font-medium mt-1">
                      {achievement.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Premium Credentials List */}
            <div className="space-y-4 bg-gradient-to-br from-gold-50/50 to-yellow-50/50 rounded-2xl p-6 border border-gold-100">
              <h4 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-gold-500" />
                Educație și Certificări
              </h4>
              {credentials.map((credential, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-500 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-all duration-300">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 font-medium">
                      {credential.title}
                    </p>
                    {credential.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {credential.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Premium Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2 }}
              className="flex flex-wrap gap-4 pt-8 border-t-2 border-gold-100"
            >
              <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gold-100 to-yellow-100 rounded-xl shadow-md">
                <Award className="w-5 h-5 text-gold-600" />
                <span className="text-sm font-bold text-gold-700">
                  Top Implantolog
                </span>
              </div>

              <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl shadow-md">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold text-blue-700">
                  Membru ASMM
                </span>
              </div>

              <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl shadow-md">
                <Star className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-700">
                  5.0 Rating
                </span>
              </div>
            </motion.div>

            {/* Premium CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.4 }}
              className="pt-6"
            >
              <a
                href="/echipa"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 group"
              >
                <span>Vezi Toată Echipa</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Premium Bottom Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.6 }}
          className="mt-24 text-center max-w-4xl mx-auto"
        >
          <blockquote className="relative bg-gradient-to-br from-white to-gold-50/30 rounded-3xl p-12 shadow-xl border border-gold-100">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-br from-gold-400 to-gold-500 rounded-full p-4 shadow-xl">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl text-gray-700 italic font-light leading-relaxed mb-6">
              &quot;Pentru mine, fiecare pacient reprezintă o oportunitate de a
              reda nu doar sănătatea, ci și încrederea în zâmbet. Aceasta este
              misiunea mea.&quot;
            </p>
            <footer>
              <cite className="text-lg font-semibold bg-gradient-to-r from-gold-600 to-gold-600 bg-clip-text text-transparent not-italic">
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
