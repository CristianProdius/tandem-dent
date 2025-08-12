// Clinic Information
export const CLINIC_INFO = {
  name: "Tandem Dent",
  fullName: "Clinica Stomatologică Tandem Dent",
  tagline: "Zâmbete Sănătoase în Chișinău",
  motto:
    "Pentru noi eficacitatea tratamentului și siguranța pacienților este prioritară!",
  description:
    "Clinica Stomatologică care a luat naștere din pasiune, muncă și experiență, alături de o echipă de medici profesioniști, dedicați și preocupați de a vă oferi cele mai bune și inovative servicii stomatologice.",

  // Contact Information
  contact: {
    phone: {
      main: "+373 61 234 555",
      display: "061 234 555",
      whatsapp: "+37361234555",
    },
    email: "tandemdent22@gmail.com",
    emergency: "+373 61 234 555", // 24/7 emergency line
  },

  // Location
  address: {
    street: "Strada Nicolae Zelinski 5/8",
    city: "Chișinău",
    postalCode: "MD-2032",
    country: "Moldova",
    fullAddress: "Strada Nicolae Zelinski 5/8, MD-2032, Chișinău",
    googleMapsUrl: "https://maps.google.com/?q=Tandem+Dent+Chisinau",
    coordinates: {
      lat: 47.0105, // To be updated with actual coordinates
      lng: 28.8638,
    },
  },

  // Working Hours
  schedule: {
    regular: {
      monday: { open: "09:00", close: "18:00" },
      tuesday: { open: "09:00", close: "18:00" },
      wednesday: { open: "09:00", close: "18:00" },
      thursday: { open: "09:00", close: "18:00" },
      friday: { open: "09:00", close: "18:00" },
      saturday: { closed: true },
      sunday: { closed: true },
    },
    display: "Luni-Vineri: 9:00-18:00",
    emergency: "24/7 pentru urgențe",
    holidays: "Închis în zilele de sărbătoare națională",
  },

  // Social Media
  social: {
    facebook: "https://facebook.com/tandemdent",
    instagram: "https://instagram.com/tandemdent",
    youtube: "https://youtube.com/@tandemdent",
    linkedin: "https://linkedin.com/company/tandem-dent",
  },

  // Legal
  legal: {
    registrationNumber: "1234567890", // To be updated
    vatNumber: "MD1234567890", // To be updated
    license: "Autorizație de funcționare ANSP",
    affiliations: [
      "Membru al Colegiului Stomatologilor",
      "Certificat Gold Invisalign Provider",
      "Diplomă de excelență în servicii medicale 2023",
    ],
  },
};

// Services
export const SERVICES = {
  main: [
    {
      id: "terapie-dentara",
      name: "Terapie dentară",
      icon: "tooth",
      description: "Tratamente complete pentru sănătatea dinților",
    },
    {
      id: "estetica-dentara",
      name: "Estetică dentară",
      icon: "sparkles",
      description: "Pentru un zâmbet perfect și strălucitor",
    },
    {
      id: "ortodontie",
      name: "Ortodonție",
      icon: "alignJustify",
      description: "Aliniere perfectă cu tehnologii moderne",
    },
    {
      id: "implantologie",
      name: "Implantologie",
      icon: "anchor",
      description: "Soluții permanente pentru dinți lipsă",
    },
    {
      id: "protetica-dentara",
      name: "Protetică dentară",
      icon: "crown",
      description: "Restaurări complete și estetice",
    },
    {
      id: "chirurgie-orala",
      name: "Chirurgie orală",
      icon: "scalpel",
      description: "Intervenții sigure și minim invazive",
    },
    {
      id: "endodontie",
      name: "Endodonție",
      icon: "activity",
      description: "Salvarea dinților prin tratamente de canal",
    },
  ],

  detailed: [
    {
      id: "consultatie",
      name: "Consultație, Control și Plan de tratament",
      duration: "30 minute",
      ideal: "Toată lumea, la fiecare 6 luni",
      includes: ["Examinare completă", "Radiografie", "Plan de tratament"],
      price: "GRATUIT pentru pacienți noi",
    },
    {
      id: "detartraj",
      name: "Detartraj și Periaj Profesional",
      duration: "45-60 minute",
      ideal: "Prevenirea cariilor și bolilor gingivale",
      recovery: "Imediată",
      price: "De la 400 MDL",
    },
    {
      id: "tratament-canal",
      name: "Tratament de Canal",
      duration: "1-2 ședințe",
      ideal: "Dinți cu carii profunde sau infecții",
      recovery: "1-2 zile",
      price: "De la 1200 MDL",
    },
    {
      id: "implanturi",
      name: "Implanturi Dentare",
      duration: "3-6 luni proces complet",
      ideal: "Dinți lipsă sau care trebuie extrași",
      recovery: "3-7 zile după intervenție",
      price: "De la 10000 MDL",
    },
    {
      id: "coroane-punti",
      name: "Coroane și Punți Dentare",
      duration: "2-3 vizite",
      ideal: "Dinți slăbiți sau spații între dinți",
      materials: ["Ceramică", "Zirconiu"],
      price: "De la 3500 MDL",
    },
    {
      id: "ortodontie-invisalign",
      name: "Ortodonție Invisalign",
      duration: "6-18 luni",
      ideal: "Dinți strâmbi sau probleme de mușcătură",
      advantages: ["Detașabile", "Confortabile", "Discrete"],
      price: "De la 25000 MDL",
    },
    {
      id: "albire",
      name: "Albire Profesională",
      duration: "60 minute",
      ideal: "Dinți pătați sau îngălbeniți",
      results: "Vizibile imediat, durează 1-2 ani",
      price: "De la 1500 MDL",
    },
    {
      id: "fatete",
      name: "Fațete Dentare",
      duration: "2-3 vizite",
      ideal: "Dinți pătați, ciobiți sau cu spații",
      durability: "10-15 ani",
      price: "De la 5000 MDL per dinte",
    },
  ],
};

// Team Members
export const TEAM = [
  {
    id: "capatina-vitalie",
    name: "Dr. Căpățină Vitalie",
    role: "Medic Stomatolog Principal",
    specializations: ["Implantologie", "Chirurgie Orală", "Ortopedie Dentară"],
    education: [
      'Diplomă în Stomatologie, USMF "Nicolae Testemițanu"',
      "Specializare în Implantologie și Chirurgie Orală",
    ],
    achievements: [
      "Peste 3000 de implanturi plasate cu succes",
      "15+ ani experiență în stomatologie",
      "Membru al Asociației Stomatologilor din Moldova",
    ],
    image: "/images/team/dr-capatina.jpg",
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
      "10 ani experiență în ortodonție",
      "Gold Invisalign Provider",
      "Specialist în aparate dentare pentru copii și adulți",
    ],
    image: "/images/team/dr-iliev.jpg",
  },
  {
    id: "stoica-cristina",
    name: "Dr. Stoica Cristina",
    role: "Medic Stomatolog",
    specializations: ["Stomatologie Pediatrică", "Terapie Dentară"],
    education: ['Diplomă în Stomatologie, USMF "Nicolae Testemițanu"'],
    achievements: [
      "Abordare specială față de copii",
      "Specialist în tratamente minim invazive",
      "Experiență în sedare conștientă pentru copii",
    ],
    image: "/images/team/dr-stoica.jpg",
  },
  {
    id: "ambrosi-liudmila",
    name: "Ambrosi Liudmila",
    role: "Asistent Medical Principal",
    specializations: ["Asistență Medicală", "Sterilizare"],
    achievements: [
      "Cu noi din 2020",
      "Certificat în managementul sterilizării",
      "Specialist în asistență chirurgicală",
    ],
    image: "/images/team/ambrosi.jpg",
  },
];

// Testimonials
export const TESTIMONIALS = [
  {
    id: 1,
    name: "Diana S.",
    role: "Pacientă",
    content:
      "O echipă de profesioniști! Servicii excelente, atmosferă prietenoasă și rezultate foarte bune. Recomand cu drag!",
    rating: 5,
    date: "2024",
  },
  {
    id: 2,
    name: "Irina Jeman",
    role: "Pacientă",
    content:
      "Oameni minunați, răbdători, care dau dovadă de profesionalism! O echipă care oferă servicii de calitate cu o experiență de apreciat! Vă mulțumesc pentru tot ce ați făcut și faceți pentru mine! Baftă în continuare și o să vă recomand și în continuare cu mare drag!",
    rating: 5,
    date: "2024",
  },
  {
    id: 3,
    name: "Andrei Minzarari",
    role: "Pacient",
    content:
      "Un colectiv și un grup de profesioniști fenomenali! Vă consiliez această stomatologie de super calitate!",
    rating: 5,
    date: "2024",
  },
  {
    id: 4,
    name: "Ina Braguta",
    role: "Pacientă",
    content: "Cei mai buni!",
    rating: 5,
    date: "2024",
  },
  {
    id: 5,
    name: "Maxim Stricaci",
    role: "Pacient",
    content:
      "Stomatologie bună, muncă de calitate. Operația a fost făcută cât mai confortabil, plus că setarea psihologică a fost corectă. Vă recomand!",
    rating: 5,
    date: "2024",
  },
  {
    id: 6,
    name: "Dasha Sk",
    role: "Pacientă",
    content:
      "Super clinică. Îl cunosc pe ortodont și chirurgul din 2016 ca pacient. Chirurgul a scos măseaua de minte, astfel încât să nu simt nimic.",
    rating: 5,
    date: "2024",
  },
  {
    id: 7,
    name: "Lilia Pulbere",
    role: "Pacientă",
    content: "Tandem-Dent sunt cei mai buni!!!",
    rating: 5,
    date: "2024",
  },
  {
    id: 8,
    name: "Vera S.",
    role: "Pacientă",
    content:
      "Am venit cu frică și am plecat zâmbind. Echipa este extraordinară!",
    rating: 5,
    date: "2024",
  },
  {
    id: 9,
    name: "Dumitru P.",
    role: "Pacient",
    content: "Explicații clare, prețuri corecte, rezultate excelente.",
    rating: 5,
    date: "2024",
  },
];

// Company Values
export const VALUES = [
  {
    id: "grija",
    title: "Grijă",
    description: "Tratăm fiecare pacient cu compasiune și înțelegere.",
    icon: "heart",
  },
  {
    id: "implicare",
    title: "Implicare",
    description:
      "O echipă implicată, profesionistă și atentă la nevoile fiecărui pacient.",
    icon: "users",
  },
  {
    id: "confort",
    title: "Confort",
    description:
      "Ne bazăm pe tehnologie modernă, soluții minim-invazive și o abordare personalizată a fiecărui caz.",
    icon: "shield",
  },
  {
    id: "colaborare",
    title: "Colaborare",
    description:
      "La Tandem Dent ascultarea activă și colaborarea sunt esențiale – împreună alegem cea mai potrivită cale pentru sănătatea ta orală.",
    icon: "handshake",
  },
];

// Equipment & Technology
export const EQUIPMENT = [
  {
    id: "radiografii-digitale",
    name: "Radiografii digitale",
    description: "Cu radiații minime pentru siguranța pacientului",
    icon: "scan",
  },
  {
    id: "laser-dentar",
    name: "Laser dentar",
    description: "Pentru tratamente fără durere și vindecare rapidă",
    icon: "zap",
  },
  {
    id: "camera-intraorala",
    name: "Cameră intraorală",
    description: "Pentru explicații clare și documentare precisă",
    icon: "camera",
  },
  {
    id: "scaune-confortabile",
    name: "Scaune confortabile",
    description: "Cu perne încălzite pentru confort maxim",
    icon: "armchair",
  },
];

// Pricing Categories
export const PRICING = {
  financing: {
    available: true,
    minAmount: 5000,
    maxMonths: 12,
    interestRate: 0,
    description:
      "0% dobândă pentru tratamente peste 5.000 MDL, până la 12 rate",
    instantApproval: true,
  },

  paymentMethods: [
    { id: "cash", name: "Numerar", icon: "banknote" },
    { id: "card", name: "Card bancar", icon: "creditCard" },
    { id: "installments", name: "Rate fără dobândă", icon: "calendar" },
  ],

  insurance: {
    cnam: true,
    description: "Acceptăm asigurarea CNAM pentru serviciile acoperite",
  },
};

// FAQ Categories
export const FAQ_CATEGORIES = [
  {
    id: "general",
    name: "Întrebări Generale",
    icon: "info",
  },
  {
    id: "tratamente",
    name: "Despre Tratamente",
    icon: "activity",
  },
  {
    id: "costuri",
    name: "Costuri și Plăți",
    icon: "dollarSign",
  },
  {
    id: "urgente",
    name: "Urgențe",
    icon: "alertCircle",
  },
];

// Emergency Guide
export const EMERGENCY_GUIDE = [
  {
    problem: "Dinte căzut",
    action: "Pune-l în lapte, vino urgent",
    urgency: "Maximă",
    timeFrame: "30 minute",
    color: "red",
  },
  {
    problem: "Durere severă",
    action: "Ia un calmant, aplică frig",
    urgency: "Înaltă",
    timeFrame: "Programare urgentă",
    color: "orange",
  },
  {
    problem: "Umflătură facială",
    action: "Nu aplica căldură, vino urgent",
    urgency: "Înaltă",
    timeFrame: "Posibilă infecție",
    color: "orange",
  },
  {
    problem: "Sângerare gingie",
    action: "Clătește cu apă sărată",
    urgency: "Medie",
    timeFrame: "24-48 ore",
    color: "yellow",
  },
];

// Meta Information for SEO
export const META = {
  title: "Tandem Dent - Clinică Stomatologică Premium în Chișinău",
  description:
    "Clinica Stomatologică Tandem Dent oferă servicii stomatologice complete în Chișinău. Implantologie, ortodonție, estetică dentară cu echipamente moderne.",
  keywords:
    "stomatologie Chișinău, dentist Chișinău, implant dentar, ortodonție, Tandem Dent, clinică dentară, urgențe stomatologice",
  author: "Tandem Dent",
  locale: "ro_MD",
  type: "website",
  siteName: "Tandem Dent",
  image: "/images/og-image.jpg",
  url: "https://tandemdent.md",
};
