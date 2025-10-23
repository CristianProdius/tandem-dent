import { CLINIC_INFO } from "@/lib/constants";

/**
 * Custom hook to access centralized clinic information
 * Prevents duplication of contact data across components
 */
export const useClinicInfo = () => {
  return {
    // Contact Information
    phone: {
      main: CLINIC_INFO.contact.phone.main,
      display: CLINIC_INFO.contact.phone.display,
      whatsapp: CLINIC_INFO.contact.phone.whatsapp,
      href: `tel:${CLINIC_INFO.contact.phone.main.replace(/\s/g, "")}`,
      whatsappHref: `https://wa.me/${CLINIC_INFO.contact.phone.whatsapp.replace(/\s/g, "")}`,
    },

    // Email
    email: {
      address: CLINIC_INFO.contact.email,
      href: `mailto:${CLINIC_INFO.contact.email}`,
    },

    // Address
    address: {
      street: CLINIC_INFO.address.street,
      city: CLINIC_INFO.address.city,
      postalCode: CLINIC_INFO.address.postalCode,
      country: CLINIC_INFO.address.country,
      full: CLINIC_INFO.address.fullAddress,
      googleMapsUrl: CLINIC_INFO.address.googleMapsUrl,
      coordinates: CLINIC_INFO.address.coordinates,
    },

    // Schedule
    schedule: {
      regular: CLINIC_INFO.schedule.regular,
      display: CLINIC_INFO.schedule.display,
      holidays: CLINIC_INFO.schedule.holidays,
    },

    // Clinic Info
    name: CLINIC_INFO.name,
    fullName: CLINIC_INFO.fullName,
    tagline: CLINIC_INFO.tagline,
    motto: CLINIC_INFO.motto,
    description: CLINIC_INFO.description,

    // Social Media
    social: CLINIC_INFO.social,

    // Legal
    legal: CLINIC_INFO.legal,
  };
};
