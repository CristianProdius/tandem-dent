// src/data/team.ts

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specializations: string[];
  education: string[];
  achievements: string[];
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
    "Peste 3000 de implanturi plasate cu succes",
    "15+ ani experiență în stomatologie",
    "Membru al Asociației Stomatologilor din Moldova",
    "Speaker la conferințe internaționale de implantologie",
    "Trainer certificat pentru sisteme de implanturi premium",
  ],
  experience: 15,
  image: "/images/team/dr-capatina.jpg",
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
      "10 ani experiență în ortodonție",
      "Gold Invisalign Provider",
      "Specialist în aparate dentare pentru copii și adulți",
      "Peste 500 cazuri Invisalign tratate cu succes",
    ],
    experience: 10,
    image: "/images/team/dr-iliev.jpg",
    featured: true,
    stats: {
      patients: 2000,
      procedures: 3000,
    },
    languages: ["Română", "Русский", "English"],
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
      "Abordare specială față de copii",
      "Specialist în tratamente minim invazive",
      "Experiență în sedare conștientă pentru copii",
      "7 ani experiență în stomatologie pediatrică",
    ],
    experience: 7,
    image: "/images/team/dr-stoica.jpg",
    featured: false,
    languages: ["Română", "Русский"],
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
      "Cu noi din 2020",
      "Certificat în managementul sterilizării",
      "Specialist în asistență chirurgicală",
      "Coordonator al echipei de asistenți",
    ],
    experience: 8,
    image: "/images/team/ambrosi.jpg",
    featured: false,
    languages: ["Română", "Русский"],
  },
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
