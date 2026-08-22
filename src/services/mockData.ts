import { 
  PatientProfile, 
  NearbyHospital, 
  HealthRecord, 
  MedicationSchedule, 
  Appointment, 
  FamilyMember, 
  InsurancePolicy, 
  MedicalBill, 
  HealthcareScheme, 
  HealthTimelineEvent,
  HealthcareReview,
  EmergencyCard
} from '../types';

export const initialPatientProfile: PatientProfile = {
  id: 'pat_101',
  fullName: 'Aarav Sharma',
  dob: '1984-05-14',
  age: 42,
  gender: 'Male',
  bloodGroup: 'O+',
  phone: '+91 98765 43210',
  address: 'Plot 42, Green Park Avenue, Dist. Cuttack, Odisha - 753001',
  emergencyContact: {
    name: 'Priya Sharma',
    relationship: 'Spouse',
    phone: '+91 98765 43211'
  },
  allergies: ['Penicillin', 'Dust / Pollen'],
  existingConditions: ['Type 2 Diabetes', 'Hypertension'],
  currentMedicationsCount: 3,
  insurancePolicyNumber: 'AB-PMJAY-8849201',
  accessibilityRequirements: ['Large Text', 'Voice Prompts'],
  preferredLanguage: 'en',
  emergencyCardAuthorized: true
};

export const initialEmergencyCard: EmergencyCard = {
  patientId: 'pat_101',
  fullName: 'Aarav Sharma',
  age: 42,
  bloodGroup: 'O+',
  allergies: ['Penicillin', 'Dust / Pollen'],
  emergencyContact: {
    name: 'Priya Sharma',
    relationship: 'Spouse',
    phone: '+91 98765 43211'
  },
  criticalNotes: 'Patient has Type 2 Diabetes & Hypertension. Requires insulin monitoring in trauma situations.',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SWASTYA_EMERGENCY_PROFILE_PAT101_BLOOD_O_POS_ALLERGY_PENICILLIN',
  updatedAt: '2026-08-20'
};

export const initialNearbyHospitals: NearbyHospital[] = [
  {
    id: 'hosp_1',
    name: 'SCB Medical College & Hospital (Emergency Trauma Care)',
    distanceKm: 1.8,
    estimatedTravelTimeMinutes: 6,
    address: 'Mangalabag, Cuttack, Odisha 753007',
    phone: '+91 671 2414080',
    hasEmergencyICU: true,
    isOpen24x7: true,
    latitude: 20.4705,
    longitude: 85.8792,
    rating: 4.8,
    specialties: ['Cardiology', 'Trauma Unit', 'Pediatrics', 'ICU'],
    isAyushmanEmpanelled: true,
    availableBedsCount: 14
  },
  {
    id: 'hosp_2',
    name: 'City Community Health Centre (CHC)',
    distanceKm: 3.2,
    estimatedTravelTimeMinutes: 10,
    address: 'Main Road, Sector 6, Cuttack 753014',
    phone: '+91 671 2304912',
    hasEmergencyICU: false,
    isOpen24x7: true,
    latitude: 20.4625,
    longitude: 85.8642,
    rating: 4.3,
    specialties: ['General OPD', 'Maternal Care', 'Vaccination'],
    isAyushmanEmpanelled: true,
    availableBedsCount: 6
  },
  {
    id: 'hosp_3',
    name: 'Sun Hospital & Trauma Care Unit',
    distanceKm: 4.5,
    estimatedTravelTimeMinutes: 14,
    address: 'Tulasipur, Cuttack, Odisha 753008',
    phone: '+91 671 2301540',
    hasEmergencyICU: true,
    isOpen24x7: true,
    latitude: 20.4789,
    longitude: 85.8511,
    rating: 4.6,
    specialties: ['Orthopedics', 'Neurology', 'ICU Care'],
    isAyushmanEmpanelled: false,
    availableBedsCount: 8
  }
];

export const initialHealthRecords: HealthRecord[] = [
  {
    id: 'rec_101',
    title: 'Dr. Ananya Sen - Cardiology Prescription',
    category: 'Prescriptions',
    doctorName: 'Dr. Ananya Sen (MD, DM)',
    hospitalName: 'Apollo Hospital & Heart Institute',
    dateUploaded: '2026-08-18',
    fileUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=60',
    fileType: 'image',
    fileSizeMb: 1.4,
    tags: ['Cardiology', 'Hypertension', 'Daily Dosage'],
    notes: 'Prescribed Telmisartan 40mg and Amlodipine 5mg for 30 days.'
  },
  {
    id: 'rec_102',
    title: 'HbA1c & Fasting Lipid Profile Blood Report',
    category: 'Lab Reports',
    doctorName: 'Dr. R.K. Mishra (Pathologist)',
    hospitalName: 'Thyrocare / Max Lab Diagnostics',
    dateUploaded: '2026-08-15',
    fileUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=60',
    fileType: 'pdf',
    fileSizeMb: 2.8,
    tags: ['Blood Test', 'Diabetes', 'HbA1c 6.8%'],
    notes: 'Blood sugar controlled. HbA1c improved to 6.8%.'
  },
  {
    id: 'rec_103',
    title: 'Chest X-Ray & ECG Report',
    category: 'Scans',
    doctorName: 'Dr. S. Patnaik',
    hospitalName: 'Sun Hospital Imaging Centre',
    dateUploaded: '2026-08-02',
    fileUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=60',
    fileType: 'image',
    fileSizeMb: 3.1,
    tags: ['X-Ray', 'ECG', 'Normal Sinus Rhythm'],
    notes: 'Normal lung fields, clear costophrenic angles.'
  },
  {
    id: 'rec_104',
    title: 'Ayushman Bharat Cashless Admission Discharge Summary',
    category: 'Discharge',
    doctorName: 'Dr. Ananya Sen',
    hospitalName: 'SCB Medical College & Hospital',
    dateUploaded: '2026-07-10',
    fileUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60',
    fileType: 'pdf',
    fileSizeMb: 4.2,
    tags: ['Discharge', 'Cashless', 'In-Patient'],
    notes: 'Observation for mild chest discomfort. Discharged in stable condition.'
  }
];

export const initialMedicationSchedules: MedicationSchedule[] = [
  {
    id: 'med_1',
    medicineName: 'Telmisartan 40 mg',
    dosage: '1 Tablet',
    timeOfDay: ['Morning'],
    specificTimes: ['08:00 AM'],
    durationDays: 30,
    startDate: '2026-08-01',
    endDate: '2026-08-30',
    instructions: 'Take after breakfast with water',
    status: 'Active',
    historyLogs: [
      { id: 'log_1', date: '2026-08-21', time: '08:05 AM', action: 'Taken' },
      { id: 'log_2', date: '2026-08-20', time: '08:15 AM', action: 'Taken' }
    ]
  },
  {
    id: 'med_2',
    medicineName: 'Metformin SR 500 mg',
    dosage: '1 Tablet',
    timeOfDay: ['Morning', 'Night'],
    specificTimes: ['08:00 AM', '08:00 PM'],
    durationDays: 60,
    startDate: '2026-08-01',
    endDate: '2026-09-30',
    instructions: 'Take immediately after food to avoid stomach upset',
    status: 'Active',
    historyLogs: [
      { id: 'log_3', date: '2026-08-21', time: '08:05 AM', action: 'Taken' },
      { id: 'log_4', date: '2026-08-20', time: '08:00 PM', action: 'Taken' }
    ]
  },
  {
    id: 'med_3',
    medicineName: 'Atorvastatin 10 mg',
    dosage: '1 Tablet',
    timeOfDay: ['Night'],
    specificTimes: ['09:30 PM'],
    durationDays: 30,
    startDate: '2026-08-05',
    endDate: '2026-09-05',
    instructions: 'Take at bedtime',
    status: 'Active',
    historyLogs: [
      { id: 'log_5', date: '2026-08-20', time: '09:30 PM', action: 'Taken' }
    ]
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: 'app_1',
    doctorName: 'Dr. Ananya Sen',
    specialty: 'Cardiologist',
    hospitalClinic: 'SCB Medical College OP Clinic #4',
    appointmentDate: '2026-08-22',
    appointmentTime: '10:30 AM',
    purpose: 'Routine Hypertension & Cardiac Follow-up',
    status: 'Upcoming',
    queuePosition: 7,
    currentlyServing: 4,
    estimatedWaitMinutes: 25,
    followUpDate: '2026-09-20',
    followUpTasks: ['Repeat HbA1c test 2 days prior', 'Bring current medicine strip'],
    syncedToGoogleCalendar: true
  },
  {
    id: 'app_2',
    doctorName: 'Dr. Subhashish Mohanty',
    specialty: 'Diabetologist & General Physician',
    hospitalClinic: 'City Health Clinic, Cuttack',
    appointmentDate: '2026-09-05',
    appointmentTime: '05:00 PM',
    purpose: 'Monthly Diabetes Checkup',
    status: 'Upcoming',
    queuePosition: 12,
    currentlyServing: 2,
    estimatedWaitMinutes: 50,
    syncedToGoogleCalendar: false
  }
];

export const initialFamilyMembers: FamilyMember[] = [
  {
    id: 'fam_1',
    fullName: 'Ramesh Sharma',
    relationship: 'Father',
    age: 71,
    phone: '+91 98765 00112',
    permissions: {
      canViewAppointments: true,
      canManageMedications: true,
      canViewEmergencyCard: true,
      canViewMedicalDocuments: false,
      canViewInsurance: true
    },
    healthSummary: {
      activeMedicinesCount: 4,
      upcomingAppointmentsCount: 1,
      lastCheckupDate: '2026-08-10'
    }
  },
  {
    id: 'fam_2',
    fullName: 'Sunita Sharma',
    relationship: 'Mother',
    age: 66,
    phone: '+91 98765 00113',
    permissions: {
      canViewAppointments: true,
      canManageMedications: true,
      canViewEmergencyCard: true,
      canViewMedicalDocuments: false,
      canViewInsurance: false
    },
    healthSummary: {
      activeMedicinesCount: 2,
      upcomingAppointmentsCount: 0,
      lastCheckupDate: '2026-07-28'
    }
  }
];

export const initialInsurancePolicy: InsurancePolicy = {
  policyNumber: 'AB-PMJAY-8849201',
  providerName: 'Ayushman Bharat National Health Authority',
  policyHolderName: 'Aarav Sharma',
  totalCoverageAmount: 500000,
  usedAmount: 120000,
  remainingAmount: 380000,
  expiryDate: '2027-03-31',
  networkHospitalsCount: 14200,
  documents: [
    { title: 'PM-JAY Health Card PDF', url: '#' },
    { title: 'Policy Terms & Hospital List', url: '#' }
  ],
  claims: [
    {
      id: 'claim_901',
      claimNumber: 'CLM-2026-7819',
      hospitalName: 'SCB Medical College Hospital',
      treatmentName: 'Cashless In-Patient Cardiac Monitoring & Observation',
      amountClaimed: 120000,
      amountApproved: 120000,
      dateSubmitted: '2026-07-11',
      status: 'Approved',
      statusStep: 6,
      supportingDocumentCount: 4,
      remarks: 'Full cashless claim settled directly to empanelled hospital under PM-JAY.'
    },
    {
      id: 'claim_902',
      claimNumber: 'CLM-2026-8942',
      hospitalName: 'Sun Hospital & Diagnostics',
      treatmentName: 'Diagnostic Scans & Lab Investigations Reimbursable Claim',
      amountClaimed: 14500,
      dateSubmitted: '2026-08-16',
      status: 'Under Review',
      statusStep: 4,
      supportingDocumentCount: 3,
      remarks: 'Documents verified by TPA agent. Under final authorization review.'
    }
  ]
};

export const initialMedicalBill: MedicalBill = {
  id: 'bill_404',
  hospitalName: 'Sun Hospital Trauma & Multi-specialty',
  billDate: '2026-08-19',
  patientName: 'Aarav Sharma',
  items: [
    {
      id: 'b1',
      chargeName: 'Emergency Consultation Fee',
      quantity: 1,
      unitCost: 800,
      totalCost: 800,
      requiresVerification: false
    },
    {
      id: 'b2',
      chargeName: 'High Resolution ECG & Cardiac Monitor',
      quantity: 1,
      unitCost: 1500,
      totalCost: 1500,
      requiresVerification: false
    },
    {
      id: 'b3',
      chargeName: 'Intravenous Saline Infusion Set (2 x 500ml)',
      quantity: 2,
      unitCost: 250,
      totalCost: 500,
      requiresVerification: false
    },
    {
      id: 'b4',
      chargeName: 'Specialized Nursing Care Charge',
      quantity: 2,
      unitCost: 1200,
      totalCost: 3400,
      flaggedIssue: 'Calculated line total (₹2,400) differs from billed item total (₹3,400). Requires verification.',
      requiresVerification: true
    },
    {
      id: 'b5',
      chargeName: 'Pharmacy Supplies & Disposable Syringes',
      quantity: 1,
      unitCost: 650,
      totalCost: 650,
      requiresVerification: false
    }
  ],
  subtotal: 6850,
  taxAmount: 0,
  calculatedGrandTotal: 5850,
  billedGrandTotal: 6850,
  discrepanciesCount: 1,
  status: 'Discrepancy Found'
};

export const initialHealthcareSchemes: HealthcareScheme[] = [
  {
    id: 'sch_1',
    schemeName: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    shortDescription: 'Free health coverage up to ₹5 Lakh per family per year for secondary & tertiary hospital care.',
    fullDescription: 'PM-JAY provides cashless and paperless access to services for the beneficiary at the point of service in empaneled public and private hospitals.',
    coverageBenefit: '₹5,00,000 / year per family',
    maxIncomeCriteria: 250000,
    officialPortalUrl: 'https://pmjay.gov.in',
    keyBenefits: [
      'Cashless hospital admission',
      'Free pre and post-hospitalization',
      'Secondary & tertiary surgeries covered',
      'No cap on family size'
    ],
    eligibilityCriteria: [
      'Identified under SECC 2011 database',
      'Families with active PM-JAY Health Card / Ration Card linkage',
      'Low income / informal sector workers'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Ration Card / Ayushman Card Number',
      'Mobile phone for OTP verification'
    ],
    howToApply: 'Visit nearest PM-JAY empanelled hospital or Common Service Centre (CSC) for card generation.',
    officialSourceUrl: 'https://pmjay.gov.in',
    category: 'National'
  },
  {
    id: 'sch_2',
    schemeName: 'Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)',
    shortDescription: 'Quality generic medicines available at 50% to 90% lower prices than branded medicines.',
    fullDescription: 'Jan Aushadhi Kendras provide unbranded generic drugs of verified high quality across all therapeutic categories.',
    coverageBenefit: 'Up to 90% discount on 1,800+ medicines',
    maxIncomeCriteria: 1000000,
    officialPortalUrl: 'http://janaushadhi.gov.in',
    keyBenefits: [
      'Over 1,800 bioequivalent generic drugs',
      '50% - 90% cost savings over branded drugs',
      'Strict WHO-GMP certified manufacturing'
    ],
    eligibilityCriteria: ['Open to all Indian citizens'],
    requiredDocuments: ['Doctor Prescription for prescription drugs'],
    howToApply: 'Visit any nearest Jan Aushadhi Kendra with your prescription.',
    officialSourceUrl: 'http://janaushadhi.gov.in',
    category: 'National'
  },
  {
    id: 'sch_3',
    schemeName: 'Biju Swasthya Kalyan Yojana (BSKY Odisha)',
    shortDescription: 'Comprehensive health coverage for all BSKY smart card holders in Odisha.',
    fullDescription: 'Provides universal health coverage up to ₹5 Lakh for male and ₹10 Lakh for female family members per year in empanelled private hospitals.',
    coverageBenefit: '₹5 Lakh (Male) / ₹10 Lakh (Female)',
    maxIncomeCriteria: 300000,
    officialPortalUrl: 'https://bsky.odisha.gov.in',
    keyBenefits: [
      '₹10 Lakh coverage for female family head',
      'Cashless care in premier super-specialty hospitals',
      'Free diagnostics & medicine at all state government hospitals'
    ],
    eligibilityCriteria: ['Resident of Odisha state holding BSKY Smart Card or NFSA/SFSS Ration Card'],
    requiredDocuments: ['BSKY Smart Card', 'Aadhaar Card'],
    howToApply: 'Automatic enrollment for eligible ration card holders in Odisha state.',
    officialSourceUrl: 'https://bsky.odisha.gov.in',
    category: 'State'
  }
];

export const initialTimelineEvents: HealthTimelineEvent[] = [
  {
    id: 'evt_1',
    date: 'AUG 18, 2026',
    title: 'Doctor Appointment & Prescription Updated',
    type: 'Prescription',
    description: 'Follow-up with Dr. Ananya Sen. Added Telmisartan 40mg daily.',
    relatedRecordId: 'rec_101',
    providerName: 'Apollo Heart Institute'
  },
  {
    id: 'evt_2',
    date: 'AUG 15, 2026',
    title: 'Blood Report Uploaded',
    type: 'LabReport',
    description: 'Thyrocare Fasting HbA1c test report uploaded. HbA1c 6.8%.',
    relatedRecordId: 'rec_102',
    providerName: 'Max Lab Diagnostics'
  },
  {
    id: 'evt_3',
    date: 'AUG 02, 2026',
    title: 'Chest X-Ray & ECG Investigation',
    type: 'HospitalVisit',
    description: 'Outpatient imaging performed at Sun Hospital.',
    relatedRecordId: 'rec_103',
    providerName: 'Sun Hospital'
  },
  {
    id: 'evt_4',
    date: 'JUL 11, 2026',
    title: 'PM-JAY Insurance Cashless Claim Approved',
    type: 'InsuranceClaim',
    description: 'Claim #CLM-2026-7819 for ₹1,20,000 settled cashless.',
    providerName: 'SCB Medical College'
  }
];

export const initialReviews: HealthcareReview[] = [
  {
    id: 'rev_1',
    targetType: 'Hospital',
    targetName: 'SCB Medical College & Hospital Emergency',
    overallRating: 5,
    communicationRating: 4,
    waitTimeRating: 4,
    facilityRating: 5,
    reviewerName: 'Subhash C.',
    comment: 'Extremely quick emergency intake response during night. Doctors were very reassuring.',
    date: '2026-08-14'
  },
  {
    id: 'rev_2',
    targetType: 'Doctor',
    targetName: 'Dr. Ananya Sen (Cardiologist)',
    overallRating: 5,
    communicationRating: 5,
    waitTimeRating: 4,
    facilityRating: 5,
    reviewerName: 'Pooja R.',
    comment: 'Listens patiently and explains dosages in simple regional language.',
    date: '2026-08-10'
  }
];
