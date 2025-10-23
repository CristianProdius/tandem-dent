/**
 * Centralized validation functions
 * Prevents duplication of validation logic across components
 */

// Validation error messages
export const VALIDATION_MESSAGES = {
  email: {
    required: "Email-ul este obligatoriu",
    invalid: "Email invalid",
  },
  phone: {
    required: "Telefonul este obligatoriu",
    invalid: "Numar de telefon invalid",
  },
  name: {
    required: "Numele este obligatoriu",
    minLength: "Numele trebuie sa aiba cel putin 2 caractere",
  },
  service: {
    required: "Selectati un serviciu",
  },
  required: "Acest camp este obligatoriu",
};

/**
 * Validates email address format
 * @param email - Email address to validate
 * @returns true if valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  if (!email || !email.trim()) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates Moldova phone number format
 * Accepts formats: +373 XX XXX XXX, 0XX XXX XXX, or variations
 * @param phone - Phone number to validate
 * @returns true if valid, false otherwise
 */
export const validatePhone = (phone: string): boolean => {
  if (!phone || !phone.trim()) return false;
  // Remove all spaces and dashes
  const cleanPhone = phone.replace(/[\s-]/g, "");
  // Accept +373XXXXXXXX (8-9 digits after +373) or 0XXXXXXXX (8-9 digits)
  const phoneRegex = /^(\+373[0-9]{8,9}|0[0-9]{8,9})$/;
  return phoneRegex.test(cleanPhone);
};

/**
 * Validates required field
 * @param value - Value to validate
 * @returns true if not empty, false otherwise
 */
export const validateRequired = (value: string): boolean => {
  return !!(value && value.trim().length > 0);
};

/**
 * Validates minimum length
 * @param value - Value to validate
 * @param minLength - Minimum required length
 * @returns true if meets minimum, false otherwise
 */
export const validateMinLength = (value: string, minLength: number): boolean => {
  return !!(value && value.trim().length >= minLength);
};

/**
 * Validates maximum length
 * @param value - Value to validate
 * @param maxLength - Maximum allowed length
 * @returns true if within limit, false otherwise
 */
export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return !!(value && value.trim().length <= maxLength);
};

/**
 * Get validation error message for email
 * @param email - Email to validate
 * @returns Error message or empty string if valid
 */
export const getEmailError = (email: string): string => {
  if (!email || !email.trim()) {
    return VALIDATION_MESSAGES.email.required;
  }
  if (!validateEmail(email)) {
    return VALIDATION_MESSAGES.email.invalid;
  }
  return "";
};

/**
 * Get validation error message for phone
 * @param phone - Phone number to validate
 * @returns Error message or empty string if valid
 */
export const getPhoneError = (phone: string): string => {
  if (!phone || !phone.trim()) {
    return VALIDATION_MESSAGES.phone.required;
  }
  if (!validatePhone(phone)) {
    return VALIDATION_MESSAGES.phone.invalid;
  }
  return "";
};

/**
 * Get validation error message for name
 * @param name - Name to validate
 * @returns Error message or empty string if valid
 */
export const getNameError = (name: string): string => {
  if (!name || !name.trim()) {
    return VALIDATION_MESSAGES.name.required;
  }
  if (!validateMinLength(name, 2)) {
    return VALIDATION_MESSAGES.name.minLength;
  }
  return "";
};

/**
 * Get validation error message for required field
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message
 * @returns Error message or empty string if valid
 */
export const getRequiredError = (value: string, fieldName?: string): string => {
  if (!validateRequired(value)) {
    return fieldName ? `${fieldName} este obligatoriu` : VALIDATION_MESSAGES.required;
  }
  return "";
};
