// User & Patient Profile
export interface PatientProfile {
  id: string;
  fullName: string;
  dob: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  existingConditions: string[];
  currentMedicationsCount: number;
  insurancePolicyNumber?: string;
  accessibilityRequirements?: string[];
  preferredLanguage: 'en' | 'hi' | 'bn' | 'or';
  emergencyCardAuthorized: boolean;
}

// Emergency Incident & Card
export interface EmergencyCard {
  patientId: string;
  fullName: string;
  age: number;
  bloodGroup: string;
  allergies: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  criticalNotes: string;
  qrCodeUrl: string;
  updatedAt: string;
}

export interface NearbyHospital {
  id: string;
  name: string;
  distanceKm: number;
  estimatedTravelTimeMinutes: number;
  address: string;
  phone: string;
  hasEmergencyICU: boolean;
  isOpen24x7: boolean;
  latitude: number;
  longitude: number;
  rating: number;
  specialties: string[];
  isAyushmanEmpanelled: boolean;
  availableBedsCount: number;
}

// Digital Health Records
export type RecordCategory = 
  | 'Prescriptions'
  | 'Lab Reports'
  | 'Scans'
  | 'Bills'
  | 'Insurance'
  | 'Discharge'
  | 'Other';

export interface HealthRecord {
  id: string;
  title: string;
  category: RecordCategory;
  doctorName?: string;
  hospitalName?: string;
  dateUploaded: string;
  fileUrl: string;
  fileType: 'pdf' | 'image' | 'doc';
  fileSizeMb: number;
  tags: string[];
  notes?: string;
  ocrExtractedData?: PrescriptionOCRResult;
}

// Prescription OCR
export interface ExtractedMedication {
  id: string;
  name: string;
  dosageStrength: string; // e.g. "500 mg"
  frequency: string; // e.g. "Twice a day"
  timeOfDay: ('Morning' | 'Afternoon' | 'Night')[];
  durationDays: number;
  instructions: string; // e.g. "After food"
}

export interface PrescriptionOCRResult {
  prescriptionId: string;
  doctorName: string;
  clinicHospital: string;
  date: string;
  extractedMedicines: ExtractedMedication[];
  rawText: string;
  confidenceScore: number;
}

// Medication Schedule & Dashboard
export interface MedicationSchedule {
  id: string;
  medicineName: string;
  dosage: string;
  timeOfDay: ('Morning' | 'Afternoon' | 'Night')[];
  specificTimes: string[]; // e.g. ["08:00 AM", "08:00 PM"]
  durationDays: number;
  startDate: string;
  endDate: string;
  instructions: string;
  status: 'Active' | 'Completed' | 'Paused';
  historyLogs: {
    id: string;
    date: string;
    time: string;
    action: 'Taken' | 'Skipped' | 'Snoozed';
  }[];
}

// Health Timeline Event
export interface HealthTimelineEvent {
  id: string;
  date: string;
  title: string;
  type: 'Appointment' | 'Prescription' | 'LabReport' | 'InsuranceClaim' | 'HospitalVisit' | 'MedicationStarted';
  description: string;
  relatedRecordId?: string;
  providerName?: string;
}

// Appointments & Queue
export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  hospitalClinic: string;
  appointmentDate: string;
  appointmentTime: string;
  purpose: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  queuePosition?: number;
  currentlyServing?: number;
  estimatedWaitMinutes?: number;
  followUpDate?: string;
  followUpTasks?: string[];
  syncedToGoogleCalendar?: boolean;
}

// Family Members & Permission Consent
export type FamilyRelationship = 'Father' | 'Mother' | 'Spouse' | 'Child' | 'Sibling' | 'Grandparent' | 'Caregiver';

export interface FamilyPermission {
  canViewAppointments: boolean;
  canManageMedications: boolean;
  canViewEmergencyCard: boolean;
  canViewMedicalDocuments: boolean;
  canViewInsurance: boolean;
}

export interface FamilyMember {
  id: string;
  fullName: string;
  relationship: FamilyRelationship;
  age: number;
  phone: string;
  avatarUrl?: string;
  permissions: FamilyPermission;
  healthSummary: {
    activeMedicinesCount: number;
    upcomingAppointmentsCount: number;
    lastCheckupDate: string;
  };
}

// Family Medical History
export interface FamilyMedicalHistoryItem {
  id: string;
  conditionName: string;
  affectedMembers: string[]; // e.g. ["Father", "Grandmother"]
  notes: string;
}

// Insurance Hub
export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  hospitalName: string;
  treatmentName: string;
  amountClaimed: number;
  amountApproved?: number;
  dateSubmitted: string;
  status: 'Created' | 'Documents Uploaded' | 'Verified' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  statusStep: number; // 1 to 6
  supportingDocumentCount: number;
  remarks?: string;
}

export interface InsurancePolicy {
  policyNumber: string;
  providerName: string;
  policyHolderName: string;
  totalCoverageAmount: number;
  usedAmount: number;
  remainingAmount: number;
  expiryDate: string;
  networkHospitalsCount: number;
  documents: { title: string; url: string }[];
  claims: InsuranceClaim[];
}

// Medical Bill Transparency & Charge Calculator
export interface BillLineItem {
  id: string;
  chargeName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  flaggedIssue?: string; // e.g., "Math mismatch", "Higher than estimated standard rate", "Duplicate entry"
  requiresVerification: boolean;
}

export interface MedicalBill {
  id: string;
  hospitalName: string;
  billDate: string;
  patientName: string;
  items: BillLineItem[];
  subtotal: number;
  taxAmount: number;
  calculatedGrandTotal: number;
  billedGrandTotal: number;
  discrepanciesCount: number;
  status: 'Audited' | 'Pending Verification' | 'Discrepancy Found';
}

// Assistant & Voice
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
}

// Government Healthcare Schemes
export interface HealthcareScheme {
  id: string;
  schemeName: string;
  shortDescription: string;
  fullDescription: string;
  coverageBenefit: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  howToApply: string;
  officialSourceUrl: string;
  officialPortalUrl?: string;
  maxIncomeCriteria: number;
  keyBenefits: string[];
  category: 'National' | 'State' | 'Maternal' | 'Elderly' | 'Insurance';
}

// Doctor & Hospital Review
export interface DoctorReview {
  id: string;
  doctorName: string;
  hospitalName: string;
  rating: number;
  waitingTimeRating: number;
  listeningSkillRating: number;
  cleanlinessRating: number;
  reviewText: string;
  authorName: string;
  date: string;
  verifiedPatient: boolean;
  helpfulVotesCount: number;
}

// Reviews & Ratings
export interface HealthcareReview {
  id: string;
  targetType: 'Doctor' | 'Hospital' | 'Clinic';
  targetName: string;
  overallRating: number; // 1-5
  communicationRating: number;
  waitTimeRating: number;
  facilityRating: number;
  reviewerName: string;
  comment: string;
  date: string;
}

// Preventive Care Tracker Types & Lifecycle
export type PreventiveCareLifecycleStage = 
  | 'recommended'
  | 'due_date_set'
  | 'appointment_booked'
  | 'visit_completed'
  | 'report_uploaded'
  | 'care_completed';

export type PreventiveCareCategory = 'vaccination' | 'screening' | 'checkup' | 'follow_up';

export type PreventiveCareStatus = 'completed' | 'due_soon' | 'overdue';

export interface PreventiveCareActivity {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientVillage: string;
  patientPhone?: string;
  activityName: string;
  category: PreventiveCareCategory;
  lifecycleStage: PreventiveCareLifecycleStage;
  dueDate: string; // YYYY-MM-DD
  recommendedDate: string; // YYYY-MM-DD
  healthWorkerId?: string;
  healthWorkerName?: string;
  healthWorkerRole?: string;
  clinicId?: string;
  clinicName?: string;
  appointmentId?: string;
  appointment?: {
    id: string;
    tokenNumber: number;
    appointmentDate: string;
    slotTime: string;
    clinicName: string;
    status: string;
  };
  medicalRecordId?: string;
  medicalRecordTitle?: string;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  status: PreventiveCareStatus;
  daysRemaining: number;
  isCareGap: boolean;
  stageIndex: number;
}

export interface PreventiveCareMetrics {
  total: number;
  completed: number;
  dueSoon: number;
  overdue: number;
  careGapsCount: number;
}

// Offline Sync State
export type SyncStatus = 'Synced' | 'Syncing' | 'Offline' | 'Sync Failed';

