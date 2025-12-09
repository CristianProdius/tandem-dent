// src/data/team.ts

import type { LucideIcon } from "lucide-react";
import {
  Award,
  Baby,
  Brain,
  Calendar,
  Heart,
  Shield,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";

export interface Achievement {
  icon: LucideIcon;
  text: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specializations: string[];
  education: string[];
  achievements: Achievement[];
  experience: number; // years
  image?: string;
  featured?: boolean;
  stats?: {
    implants?: number;
    patients?: number;
    procedures?: number;
  };
  certifications?: string[];
  languages?: string[];
  bio?: string;
  color: "gold" | "teal";
}

export const mainDoctor: TeamMember = {
  id: "capatina-vitalie",
  name: "Dr. Căpățină Vitalie",
  role: "Medic Stomatolog Principal",
  specializations: ["Implantologie", "Chirurgie Orală", "Ortopedie Dentară"],
  education: [
    'Diplomă în Stomatologie, USMF "Nicolae Testemițanu"',
    "Specializare în Implantologie și Chirurgie Orală",
    "Masterat în Chirurgie Oro-Maxilo-Facială",
    "Certificări internaționale în implantologie modernă",
  ],
  achievements: [
    { icon: Brain, text: "Peste 3000 de implanturi plasate cu succes" },
    { icon: Calendar, text: "15+ ani experiență în stomatologie" },
    { icon: Award, text: "Membru al Asociației Stomatologilor din Moldova" },
    { icon: Users, text: "Speaker la conferințe internaționale" },
  ],
  experience: 15,
  image: "/images/docs/vitalie.jpg",
  featured: true,
  stats: {
    implants: 3000,
    patients: 5000,
    procedures: 10000,
  },
  certifications: [
    "Straumann Implant System Certified",
    "Nobel Biocare Advanced Course",
    "Digital Smile Design Certified",
    "Invisalign Provider",
  ],
  languages: ["Română", "Русский", "English"],
  bio: "Cu o pasiune pentru excelența în stomatologie și o dedicare față de bunăstarea pacienților, Dr. Căpățină Vitalie aduce peste 15 ani de experiență în tratamente dentare complexe și implanturi de ultimă generație.",
  color: "gold",
};

export const teamMembers: TeamMember[] = [
  mainDoctor,
  {
    id: "iliev-olesea",
    name: "Dr. Iliev Olesea",
    role: "Medic Ortodont",
    specializations: ["Ortodonție", "Ortodonție pentru copii", "Invisalign"],
    education: [
      'Diplomă în Stomatologie, USMF "Nicolae Testemițanu"',
      "Specializare în Ortodonție",
      "Curs avansat Invisalign",
    ],
    achievements: [
      { icon: Calendar, text: "10 ani experiență în ortodonție" },
      { icon: Award, text: "Gold Invisalign Provider" },
      { icon: Users, text: "Specialist în aparate dentare pentru copii și adulți" },
      { icon: Sparkles, text: "Peste 500 cazuri Invisalign tratate cu succes" },
    ],
    experience: 10,
    image: "/images/docs/olesea.jpg",
    featured: true,
    stats: {
      patients: 2000,
      procedures: 3000,
    },
    languages: ["Română", "Русский", "English"],
    color: "teal",
  },
  {
    id: "stoica-cristina",
    name: "Dr. Stoica Cristina",
    role: "Medic Stomatolog",
    specializations: [
      "Stomatologie Pediatrică",
      "Terapie Dentară",
      "Endodonție",
    ],
    education: [
      'Diplomă în Stomatologie, USMF "Nicolae Testemițanu"',
      "Specializare în Pedodonție",
      "Curs de endodonție microscopică",
    ],
    achievements: [
      { icon: Baby, text: "Abordare specială față de copii" },
      { icon: Heart, text: "Specialist în tratamente minim invazive" },
      { icon: Sparkles, text: "Experiență în sedare conștientă pentru copii" },
      { icon: Calendar, text: "7 ani experiență în stomatologie pediatrică" },
    ],
    experience: 7,
    image: "/images/team/dr-stoica.jpg",
    featured: false,
    languages: ["Română", "Русский"],
    color: "gold",
  },
  {
    id: "ambrosi-liudmila",
    name: "Ambrosi Liudmila",
    role: "Asistent Medical Principal",
    specializations: [
      "Asistență Medicală",
      "Sterilizare",
      "Management cabinet",
    ],
    education: [
      "Diplomă în Asistență Medicală",
      "Certificat în managementul sterilizării",
      "Curs de prim ajutor avansat",
    ],
    achievements: [
      { icon: Calendar, text: "Cu noi din 2020" },
      { icon: Shield, text: "Certificat în managementul sterilizării" },
      { icon: Stethoscope, text: "Specialist în asistență chirurgicală" },
      { icon: Users, text: "Coordonator al echipei de asistenți" },
    ],
    experience: 8,
    image: "/images/team/ambrosi.jpg",
    featured: false,
    languages: ["Română", "Русский"],
    color: "teal",
  },
];

// Floating icons configuration for background animation
export const floatingIconsConfig = [
  { left: "10%", top: "15%", delay: 0, icon: Stethoscope },
  { left: "85%", top: "20%", delay: 0.5, icon: Heart },
  { left: "20%", top: "70%", delay: 1, icon: Shield },
  { left: "75%", top: "60%", delay: 1.5, icon: Stethoscope },
  { left: "40%", top: "30%", delay: 2, icon: Heart },
  { left: "60%", top: "85%", delay: 2.5, icon: Shield },
];

// Team statistics
export const teamStats = {
  totalExperience: teamMembers.reduce(
    (sum, member) => sum + member.experience,
    0
  ),
  totalProcedures: 20000,
  totalPatients: 8000,
  teamSize: teamMembers.length,
  languages: ["Română", "Русский", "English"],
  specializations: 12,
};

// Doctor's philosophy and approach
export const doctorPhilosophy = {
  quote:
    "Pentru mine, fiecare pacient reprezintă o oportunitate de a reda nu doar sănătatea, ci și încrederea în zâmbet. Aceasta este misiunea mea.",
  author: "Dr. Căpățină Vitalie",
  values: [
    {
      title: "Excelență Profesională",
      description:
        "Utilizăm cele mai moderne tehnologii și tehnici pentru rezultate optime",
    },
    {
      title: "Abordare Personalizată",
      description:
        "Fiecare tratament este adaptat nevoilor specifice ale pacientului",
    },
    {
      title: "Educație Continuă",
      description:
        "Participăm constant la cursuri și conferințe internaționale",
    },
    {
      title: "Empatie și Grijă",
      description: "Înțelegem temerile pacienților și oferim suport emoțional",
    },
  ],
};

// Badges and certifications
export const trustBadges = [
  {
    id: "top-implantolog",
    title: "Top Implantolog",
    icon: "award",
    color: "gold",
  },
  {
    id: "membru-asmm",
    title: "Membru ASMM",
    subtitle: "Asociația Stomatologilor din Moldova",
    icon: "shield",
    color: "blue",
  },
  {
    id: "rating-5",
    title: "5.0 Rating",
    subtitle: "Google Reviews",
    icon: "star",
    color: "green",
  },
  {
    id: "gold-provider",
    title: "Gold Provider",
    subtitle: "Invisalign",
    icon: "medal",
    color: "gold",
  },
];
