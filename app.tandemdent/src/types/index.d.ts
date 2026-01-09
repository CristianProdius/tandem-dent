/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Gender = "male" | "female" | "other";
declare type Status = "pending" | "scheduled" | "cancelled";

declare interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
}
declare interface User extends CreateUserParams {
  $id: string;
}

declare interface RegisterUserParams extends CreateUserParams {
  userId: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string | undefined;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
}

declare type CreateAppointmentParams = {
  userId: string;
  patient: string;
  primaryPhysician: string;
  reason: string;
  schedule: Date;
  status: Status;
  note: string | undefined;
  doctorId?: string;
};

declare type UpdateAppointmentParams = {
  appointmentId: string;
  userId: string;
  timeZone?: string;
  appointment: Appointment;
  type: string;
};

// Doctor params
declare interface CreateDoctorParams {
  name: string;
  email: string;
  phone?: string;
  specialty?: string;
  image?: string;
  googleCalendarConnected?: boolean;
}

declare interface UpdateDoctorParams extends Partial<CreateDoctorParams> {
  googleCalendarConnected?: boolean;
  googleRefreshToken?: string;
  googleCalendarId?: string;
}

// Admin appointment creation (with patient search/select)
declare type CreateAppointmentAdminParams = {
  patientId: string;
  doctorId: string;
  primaryPhysician: string;
  reason: string;
  schedule: Date;
  note?: string;
  createdBy: string;
};

// Calendar link types
declare interface CalendarLinks {
  google: string;
  outlook: string;
  icsUrl: string;
}

// Email types
declare type EmailRecipientType = "patient" | "doctor";
declare type EmailType = "confirmation" | "reminder" | "cancellation";
declare type EmailStatus = "sent" | "delivered" | "failed";

// User roles
declare type UserRole = "admin" | "doctor" | "patient";

// Auth-related params
declare interface BaseAuthFields {
  passwordHash?: string;
  devices?: string; // JSON stringified DeviceFingerprint[]
}

declare interface CreateAdminParams extends BaseAuthFields {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

declare interface RegisterAdminParams {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

declare interface RegisterDoctorParams {
  name: string;
  email: string;
  password: string;
  phone?: string;
  specialty?: string;
}

declare interface RegisterPatientParams {
  name: string;
  email: string;
  phone: string;
  password: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  allergies?: string;
  currentMedication?: string;
  familyMedicalHistory?: string;
  pastMedicalHistory?: string;
  privacyConsent: boolean;
}

declare interface LoginResult {
  success: boolean;
  requiresOTP: boolean;
  userId?: string;
  userType?: UserRole;
  error?: string;
}

declare interface RegistrationResult {
  success: boolean;
  requiresOTP: boolean;
  userId?: string;
  userType?: UserRole;
  error?: string;
}
