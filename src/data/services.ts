// src/data/services.ts

export interface ServiceBenefit {
  title: string;
  description?: string;
}

export interface Service {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription?: string;
  icon: string; // Icon name to be mapped in component
  benefits: string[];
  color: "gold" | "teal";
  duration?: string;
  price?: string;
  featured?: boolean;
}

export const mainServices: Service[] = [
  {
    id: "terapie-dentara",
    name: "Terapie dentară",
    shortDescription: "Tratamente complete pentru sănătatea dinților",
    fullDescription:
      "Oferim o gamă completă de tratamente terapeutice pentru menținerea și restaurarea sănătății dentare, folosind cele mai moderne tehnici și materiale.",
    icon: "tooth",
    benefits: [
      "Obturații estetice",
      "Tratament carii",
      "Reconstrucții dentare",
    ],
    color: "gold",
    featured: true,
  },
  {
    id: "estetica-dentara",
    name: "Estetică dentară",
    shortDescription: "Pentru un zâmbet perfect și strălucitor",
    fullDescription:
      "Transformăm zâmbetul tău într-unul de invidiat prin proceduri estetice moderne și personalizate.",
    icon: "sparkles",
    benefits: ["Albire profesională", "Fațete dentare", "Bonding estetic"],
    color: "teal",
    featured: true,
  },
  {
    id: "ortodontie",
    name: "Ortodonție",
    shortDescription: "Aliniere perfectă cu tehnologii moderne",
    fullDescription:
      "Corectăm problemele de aliniere dentară folosind cele mai avansate sisteme ortodontice, inclusiv Invisalign.",
    icon: "alignJustify",
    benefits: ["Invisalign", "Aparate dentare", "Ortodonție pentru copii"],
    color: "gold",
    duration: "6-18 luni",
    featured: true,
  },
  {
    id: "implantologie",
    name: "Implantologie",
    shortDescription: "Soluții permanente pentru dinți lipsă",
    fullDescription:
      "Înlocuim dinții lipsă cu implanturi dentare de înaltă calitate care arată și funcționează ca dinții naturali.",
    icon: "anchor",
    benefits: ["Implanturi premium", "Restaurare completă", "Garanție extinsă"],
    color: "teal",
    duration: "3-6 luni",
    featured: true,
  },
  {
    id: "protetica-dentara",
    name: "Protetică dentară",
    shortDescription: "Restaurări complete și estetice",
    fullDescription:
      "Realizăm lucrări protetice de înaltă calitate pentru restaurarea funcționalității și esteticii dentare.",
    icon: "shield",
    benefits: ["Coroane ceramice", "Punți dentare", "Proteze moderne"],
    color: "gold",
    duration: "2-3 vizite",
  },
  {
    id: "chirurgie-orala",
    name: "Chirurgie orală",
    shortDescription: "Intervenții sigure și minim invazive",
    fullDescription:
      "Efectuăm intervenții chirurgicale cu tehnici minim invazive pentru recuperare rapidă și confort maxim.",
    icon: "activity",
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
    shortDescription: "Salvarea dinților prin tratamente de canal",
    fullDescription:
      "Tratăm infecțiile și inflamațiile pulpare pentru a salva dinții naturali și a elimina durerea.",
    icon: "activity",
    benefits: ["Tratament microscopic", "Tehnologie modernă", "Fără durere"],
    color: "gold",
    duration: "1-2 ședințe",
  },
];

export const detailedServices = [
  {
    id: "consultatie",
    name: "Consultație, Control și Plan de tratament",
    duration: "30 minute",
    ideal: "Toată lumea, la fiecare 6 luni",
    includes: ["Examinare completă", "Radiografie", "Plan de tratament"],
    price: "GRATUIT pentru pacienți noi",
    description:
      "Verificăm sănătatea întregii cavități bucale pentru a preveni problemele înainte să apară.",
  },
  {
    id: "detartraj",
    name: "Detartraj și Periaj Profesional",
    duration: "45-60 minute",
    ideal: "Prevenirea cariilor și bolilor gingivale",
    recovery: "Imediată",
    price: "De la 400 MDL",
    description:
      "Îndepărtăm placa bacteriană și tartrul pentru gingii sănătoase.",
  },
  {
    id: "tratament-canal",
    name: "Tratament de Canal",
    duration: "1-2 ședințe",
    ideal: "Dinți cu carii profunde sau infecții",
    recovery: "1-2 zile",
    price: "De la 1200 MDL",
    description:
      "Salvăm dinții afectați profund, eliminând durerea și infecția.",
  },
  {
    id: "implanturi",
    name: "Implanturi Dentare",
    duration: "3-6 luni proces complet",
    ideal: "Dinți lipsă sau care trebuie extrași",
    recovery: "3-7 zile după intervenție",
    price: "De la 10000 MDL",
    description:
      "Înlocuim dinții lipsă cu soluții permanente care arată și funcționează natural.",
  },
  {
    id: "coroane-punti",
    name: "Coroane și Punți Dentare",
    duration: "2-3 vizite",
    ideal: "Dinți slăbiți sau spații între dinți",
    materials: ["Ceramică", "Zirconiu"],
    price: "De la 3500 MDL",
    description:
      "Protejăm și restaurăm dinții deteriorați sau înlocuim dinții lipsă.",
  },
  {
    id: "ortodontie-invisalign",
    name: "Ortodonție Invisalign",
    duration: "6-18 luni",
    ideal: "Dinți strâmbi sau probleme de mușcătură",
    advantages: ["Detașabile", "Confortabile", "Discrete"],
    price: "De la 25000 MDL",
    description:
      "Îndreptăm dinții cu aliniere transparente, aproape invizibile.",
  },
  {
    id: "albire",
    name: "Albire Profesională",
    duration: "60 minute",
    ideal: "Dinți pătați sau îngălbeniți",
    results: "Vizibile imediat, durează 1-2 ani",
    price: "De la 1500 MDL",
    description: "Zâmbet mai alb cu până la 8 nuanțe într-o singură vizită.",
  },
  {
    id: "fatete",
    name: "Fațete Dentare",
    duration: "2-3 vizite",
    ideal: "Dinți pătați, ciobiți sau cu spații",
    durability: "10-15 ani",
    price: "De la 5000 MDL per dinte",
    description:
      "Transformăm complet aspectul zâmbetului cu fațete subțiri de porțelan.",
  },
];

// Service Categories for navigation
export const serviceCategories = [
  {
    id: "preventie",
    name: "PREVENȚIE",
    description: "Cel mai bun tratament este prevenirea problemelor.",
    services: ["consultatie", "detartraj"],
    icon: "shield",
  },
  {
    id: "restaurare",
    name: "RESTAURARE",
    description: "Redăm funcționalitatea și estetica dinților.",
    services: ["terapie-dentara", "endodontie", "coroane-punti"],
    icon: "tool",
  },
  {
    id: "estetica",
    name: "ESTETICĂ",
    description: "Pentru un zâmbet de care să fii mândru.",
    services: ["estetica-dentara", "albire", "fatete"],
    icon: "sparkles",
  },
];
