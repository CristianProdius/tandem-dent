import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "TandemDent",
  version: packageJson.version,
  copyright: `© ${currentYear}, TandemDent.`,
  meta: {
    title: "TandemDent - Dental Clinic Management System",
    description:
      "TandemDent is a comprehensive dental clinic management system for managing appointments, patients, treatments, and billing. Built with Next.js, Tailwind CSS, and modern UI components.",
  },
};
