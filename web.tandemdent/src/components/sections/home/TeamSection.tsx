"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Users, Phone } from "lucide-react";
import { SectionHeader } from "@/components/common";
import { teamMembers } from "@/data/team";
import { useTranslations } from "next-intl";

// Map team member IDs to translation keys
const memberKeyMap: Record<string, string> = {
  "capatina-vitalie": "capatinaVitalie",
  "iliev-olesea": "ilievOlesea",
  "stoica-cristina": "stoicaCristina",
  "ambrosi-liudmila": "ambrosiLiudmila",
};

const TeamSection = () => {
  const t = useTranslations("team");

  return (
    <section id="team" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeader
          badge={{ icon: Users, text: t("badge"), color: "gold" }}
          title={t("title")}
          description={t("description")}
        />

        {/* All 4 doctors in a grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {teamMembers.map((member, index) => {
            const translationKey = memberKeyMap[member.id] || member.id;
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <TeamCard
                  member={member}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  name={t(`members.${translationKey}.name` as any)}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  role={t(`members.${translationKey}.role` as any)}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  specializations={t.raw(`members.${translationKey}.specializations` as any) as string[]}
                  yearsExperienceText={t("yearsExperience")}
                  bookText={t("bookAppointment")}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Team Card with Hover Effect
interface TeamCardProps {
  member: (typeof teamMembers)[0];
  name: string;
  role: string;
  specializations: string[];
  yearsExperienceText: string;
  bookText: string;
}

const TeamCard: React.FC<TeamCardProps> = ({
  member,
  name,
  role,
  specializations,
  yearsExperienceText,
  bookText
}) => {
  const accentColor = member.color === "gold" ? "from-gold-500 to-gold-600" : "from-teal-500 to-teal-600";

  return (
    <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-200">
      {/* Photo */}
      {member.image ? (
        <Image
          src={member.image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
          <span className="text-5xl font-bold text-gray-400">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </span>
        </div>
      )}

      {/* Default: Name at Bottom */}
      <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <h3 className="text-lg font-bold text-white">{name}</h3>
        <p className="text-white/80 text-sm">{role}</p>
      </div>

      {/* Hover: Full Info */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accentColor} p-5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      >
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
          <p className="text-white/90 font-medium text-sm mb-3">{role}</p>
          <p className="text-white/80 text-sm leading-relaxed">
            {member.experience} {yearsExperienceText} {specializations[0]?.toLowerCase()}.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {specializations.slice(0, 2).map((spec, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-white/20 rounded-full text-xs text-white font-medium"
              >
                {spec}
              </span>
            ))}
          </div>

          <a
            href="#contact"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-gray-900 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            <Phone size={14} />
            {bookText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
