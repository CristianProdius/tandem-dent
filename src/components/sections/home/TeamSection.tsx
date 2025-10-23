"use client";
import React, { useState } from "react";
import {
  ChevronDown,
  Award,
  GraduationCap,
  Calendar,
  Users,
  Shield,
  Star,
  Stethoscope,
  Baby,
  Heart,
  Brain,
  Sparkles,
  Phone,
} from "lucide-react";
import { SectionHeader } from "@/components/common";

const TeamSection = () => {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const teamMembers = [
    {
      id: "capatina-vitalie",
      name: "Dr. Căpățină Vitalie",
      role: "Medic Stomatolog Principal",
      specializations: [
        "Implantologie",
        "Chirurgie Orală",
        "Ortopedie Dentară",
      ],
      education: [
        'Diplomă în Stomatologie, USMF "Nicolae Testemițanu"',
        "Specializare în Implantologie și Chirurgie Orală",
      ],
      achievements: [
        { icon: Brain, text: "Peste 3000 de implanturi plasate cu succes" },
        { icon: Calendar, text: "15+ ani experiență în stomatologie" },
        {
          icon: Award,
          text: "Membru al Asociației Stomatologilor din Moldova",
        },
      ],
      yearsExperience: 15,
      color: "gold",
    },
    {
      id: "iliev-olesea",
      name: "Dr. Iliev Olesea",
      role: "Medic Ortodont",
      specializations: ["Ortodonție"],
      education: [
        'Diplomă în Stomatologie, USMF "Nicolae Testemițanu"',
        "Specializare în Ortodonție",
      ],
      achievements: [
        { icon: Calendar, text: "10 ani experiență în ortodonție" },
        { icon: Award, text: "Gold Invisalign Provider" },
        {
          icon: Users,
          text: "Specialist în aparate dentare pentru copii și adulți",
        },
      ],
      yearsExperience: 10,
      color: "teal",
    },
    {
      id: "stoica-cristina",
      name: "Dr. Stoica Cristina",
      role: "Medic Stomatolog",
      specializations: ["Stomatologie Pediatrică", "Terapie Dentară"],
      education: ['Diplomă în Stomatologie, USMF "Nicolae Testemițanu"'],
      achievements: [
        { icon: Baby, text: "Abordare specială față de copii" },
        { icon: Heart, text: "Specialist în tratamente minim invazive" },
        {
          icon: Sparkles,
          text: "Experiență în sedare conștientă pentru copii",
        },
      ],
      yearsExperience: 8,
      color: "gold",
    },
    {
      id: "ambrosi-liudmila",
      name: "Ambrosi Liudmila",
      role: "Asistent Medical Principal",
      specializations: ["Asistență Medicală", "Sterilizare"],
      education: [],
      achievements: [
        { icon: Calendar, text: "Cu noi din 2020" },
        { icon: Shield, text: "Certificat în managementul sterilizării" },
        { icon: Stethoscope, text: "Specialist în asistență chirurgicală" },
      ],
      yearsExperience: 4,
      color: "teal",
    },
  ];

  const toggleMember = (id: string) => {
    setExpandedMember(expandedMember === id ? null : id);
  };

  // Deterministic positions for floating icons (no Math.random())
  const floatingIcons = [
    {
      left: "10%",
      top: "15%",
      delay: "0s",
      duration: "15s",
      icon: Stethoscope,
    },
    { left: "85%", top: "20%", delay: "0.5s", duration: "17s", icon: Heart },
    { left: "20%", top: "70%", delay: "1s", duration: "19s", icon: Shield },
    {
      left: "75%",
      top: "60%",
      delay: "1.5s",
      duration: "21s",
      icon: Stethoscope,
    },
    { left: "40%", top: "30%", delay: "2s", duration: "23s", icon: Heart },
    { left: "60%", top: "85%", delay: "2.5s", duration: "25s", icon: Shield },
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Parallax Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(212, 175, 55, 0.1) 35px, rgba(212, 175, 55, 0.1) 70px)`,
          }}
        />
      </div>

      {/* Floating Medical Icons Background - Fixed positions */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingIcons.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="absolute opacity-10 float-animation"
              style={{
                left: item.left,
                top: item.top,
                animationDelay: item.delay,
                animationDuration: item.duration,
              }}
            >
              <Icon size={40} />
            </div>
          );
        })}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <SectionHeader
          badge={{ icon: Users, text: "Echipa Noastră", color: "gold" }}
          title="Echipa Noastră de Profesioniști"
          description="Medici dedicați cu experiență vastă în stomatologie modernă"
        />

        {/* Team Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              isExpanded={expandedMember === member.id}
              onToggle={() => toggleMember(member.id)}
              index={index}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 enter-fade-in">
          <p className="text-gray-600 mb-6">
            Dorești să cunoști mai bine echipa noastră?
          </p>
          <button className="btn-premium inline-flex items-center gap-2 px-8 py-4 text-lg">
            <Phone size={20} />
            Programează o Întâlnire
          </button>
        </div>
      </div>
    </section>
  );
};

interface Achievement {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  text: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  specializations: string[];
  education: string[];
  achievements: Achievement[];
  yearsExperience: number;
  color: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  isExpanded,
  onToggle,
  index,
}) => {
  const accentColor =
    member.color === "gold" ? "bg-gradient-gold" : "bg-gradient-teal";
  const tagColor =
    member.color === "gold"
      ? "bg-gold-100 text-gold-800"
      : "bg-teal-100 text-teal-800";

  return (
    <div
      className="card-hover border-premium rounded-2xl overflow-hidden bg-white shadow-soft-lg enter-zoom"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative">
        {/* Photo Placeholder with Hover Effect */}
        <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Placeholder Image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`w-32 h-32 rounded-full ${accentColor} opacity-20 blur-3xl animate-pulse`}
            ></div>
            <div className="absolute">
              <div className="w-24 h-24 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <Stethoscope size={40} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Experience Badge */}
          <div className="absolute top-4 right-4 z-10">
            <div className="glass px-3 py-2 rounded-full text-white font-semibold flex items-center gap-1 float-animation">
              <Star size={16} className="text-gold-300" />
              <span>{member.yearsExperience}+ ani</span>
            </div>
          </div>

          {/* Shimmer Effect on Hover */}
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100"></div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Name and Role */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold mb-1 hover:text-gradient-gold transition-all cursor-pointer">
              {member.name}
            </h3>
            <p className="text-gray-600 font-medium">{member.role}</p>
          </div>

          {/* Specializations */}
          <div className="flex flex-wrap gap-2 mb-4">
            {member.specializations.map((spec, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-sm font-medium ${tagColor} hover-scale`}
              >
                {spec}
              </span>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 rounded-lg bg-gray-50">
              <div className="text-2xl font-bold text-gradient-gold">
                {member.achievements.length}
              </div>
              <div className="text-xs text-gray-600">Realizări</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-gray-50">
              <div className="text-2xl font-bold text-gradient-teal">
                {member.yearsExperience}+
              </div>
              <div className="text-xs text-gray-600">Ani Exp.</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-gray-50">
              <div className="text-2xl font-bold text-gradient-gold">5★</div>
              <div className="text-xs text-gray-600">Rating</div>
            </div>
          </div>

          {/* Expand Button */}
          <button
            onClick={onToggle}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-between group ${
              isExpanded
                ? accentColor + " text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            <span>
              {isExpanded ? "Vezi mai puțin" : "Vezi detalii complete"}
            </span>
            <ChevronDown
              className={`transition-transform ${
                isExpanded ? "rotate-180" : ""
              } group-hover:translate-y-1`}
              size={20}
            />
          </button>

          {/* Expandable Bio Section */}
          <div
            className={`overflow-hidden transition-all duration-500 ${
              isExpanded ? "max-h-96 mt-4" : "max-h-0"
            }`}
          >
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {/* Education */}
              {member.education.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                    <GraduationCap size={18} className="text-gold-500" />
                    Educație
                  </h4>
                  <ul className="space-y-1">
                    {member.education.map((edu, idx) => (
                      <li key={idx} className="text-sm text-gray-600 pl-6">
                        • {edu}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Achievements */}
              <div>
                <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                  <Award size={18} className="text-gold-500" />
                  Realizări & Experiență
                </h4>
                <ul className="space-y-2">
                  {member.achievements.map((achievement, idx) => {
                    const Icon = achievement.icon;
                    return (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <Icon
                          size={16}
                          className="text-teal-500 mt-0.5 flex-shrink-0"
                        />
                        <span>{achievement.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Meet & Greet CTA */}
              <button className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg font-medium hover:from-gold-600 hover:to-gold-700 transition-all shadow-glow hover:shadow-glow-lg">
                Programează cu {member.name.split(" ")[1]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
