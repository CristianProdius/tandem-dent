// src/data/testimonials.ts

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  date: string;
  verified: boolean;
  source?: "google" | "facebook" | "website";
  treatmentType?: string;
}

export const mainTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Diana S.",
    role: "Pacientă",
    content:
      "O echipă de profesioniști! Servicii excelente, atmosferă prietenoasă și rezultate foarte bune. Recomand cu drag!",
    rating: 5,
    date: "2024",
    verified: true,
    source: "google",
  },
  {
    id: 2,
    name: "Irina Jeman",
    role: "Pacientă",
    content:
      "Oameni minunați, răbdători, care dau dovadă de profesionalism! O echipă care oferă servicii de calitate cu o experiență de apreciat! Vă mulțumesc pentru tot ce ați făcut și faceți pentru mine! Baftă în continuare și o să vă recomand și în continuare cu mare drag!",
    rating: 5,
    date: "2024",
    verified: true,
    source: "google",
  },
  {
    id: 3,
    name: "Andrei Minzarari",
    role: "Pacient",
    content:
      "Un colectiv și un grup de profesioniști fenomenali! Vă consiliez această stomatologie de super calitate!",
    rating: 5,
    date: "2024",
    verified: true,
    source: "google",
  },
];

export const allTestimonials: Testimonial[] = [
  ...mainTestimonials,
  {
    id: 4,
    name: "Ina Braguta",
    role: "Pacientă",
    content: "Cei mai buni!",
    rating: 5,
    date: "2024",
    verified: true,
    source: "facebook",
  },
  {
    id: 5,
    name: "Maxim Stricaci",
    role: "Pacient",
    content:
      "Stomatologie bună, muncă de calitate. Operația a fost făcută cât mai confortabil, plus că setarea psihologică a fost corectă. Vă recomand!",
    rating: 5,
    date: "2024",
    verified: true,
    source: "google",
    treatmentType: "Chirurgie orală",
  },
  {
    id: 6,
    name: "Dasha Sk",
    role: "Pacientă",
    content:
      "Super clinică. Îl cunosc pe ortodont și chirurgul din 2016 ca pacient. Chirurgul a scos măseaua de minte, astfel încât să nu simt nimic.",
    rating: 5,
    date: "2024",
    verified: true,
    source: "google",
    treatmentType: "Chirurgie orală",
  },
  {
    id: 7,
    name: "Lilia Pulbere",
    role: "Pacientă",
    content: "Tandem-Dent sunt cei mai buni!!!",
    rating: 5,
    date: "2024",
    verified: true,
    source: "facebook",
  },
  {
    id: 8,
    name: "Vera S.",
    role: "Pacientă",
    content:
      "Am venit cu frică și am plecat zâmbind. Echipa este extraordinară!",
    rating: 5,
    date: "2024",
    verified: true,
    source: "google",
    treatmentType: "Terapie dentară",
  },
  {
    id: 9,
    name: "Dumitru P.",
    role: "Pacient",
    content: "Explicații clare, prețuri corecte, rezultate excelente.",
    rating: 5,
    date: "2024",
    verified: true,
    source: "google",
  },
];

// Statistics for the testimonials section
export const testimonialStats = {
  satisfactionRate: 98,
  totalReviews: 3000,
  averageRating: 5.0,
  googleRating: 5.0,
  facebookRating: 4.9,
  verifiedReviews: true,
};

// Sample testimonial quotes for different services
export const serviceTestimonials = {
  implantologie: {
    quote: "După implant, pot mânca tot ce vreau din nou!",
    author: "Elena B.",
    rating: 5,
  },
  ortodontie: {
    quote: "Nimeni nu și-a dat seama că port aparat!",
    author: "Cristina D.",
    rating: 5,
  },
  "estetica-dentara": {
    quote: "Zâmbetul de vedeta pe care mi l-am dorit mereu!",
    author: "Diana F.",
    rating: 5,
  },
  "chirurgie-orala": {
    quote: "Am crezut că voi pierde dintele, dar l-au salvat!",
    author: "Andrei C.",
    rating: 5,
  },
  "terapie-dentara": {
    quote: "Controalele regulate m-au scutit de probleme mari.",
    author: "Gheorghe T.",
    rating: 5,
  },
  "protetica-dentara": {
    quote: "Coroana mea arată exact ca un dinte natural.",
    author: "Victor M.",
    rating: 5,
  },
  endodontie: {
    quote: "Tratament fără durere, exact cum mi s-a promis.",
    author: "Maria L.",
    rating: 5,
  },
};
