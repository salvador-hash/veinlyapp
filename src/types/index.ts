export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type UserRole = 'donor' | 'hospital';
export type UrgencyLevel = 'Normal' | 'Urgent' | 'Critical';
export type EmergencyStatus = 'open' | 'in_progress' | 'completed';
export type DonationStatus = 'pending' | 'completed' | 'cancelled';

export interface User {
  id: string;
  full_name: string;
  email: string;
  blood_type: BloodType;
  country: string;
  city: string;
  phone: string;
  role: UserRole;
  available: boolean;
  created_at: string;
}

export interface EmergencyRequest {
  id: string;
  patient_name: string;
  blood_type_needed: BloodType;
  units_needed: number;
  hospital: string;
  address: string;
  urgency_level: UrgencyLevel;
  contact_number: string;
  status: EmergencyStatus;
  city: string;
  lat?: number;
  lon?: number;
  created_by: string;
  created_at: string;
}

export interface DonationHistory {
  id: string;
  donor_id: string;
  emergency_id: string;
  status: DonationStatus;
  date: string;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  read: boolean;
  created_at: string;
  emergency_id?: string;
}

export const BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BLOOD_COMPATIBILITY: Record<BloodType, BloodType[]> = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'],
};
