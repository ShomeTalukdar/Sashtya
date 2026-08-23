import {
  PreventiveCareActivity,
  PreventiveCareLifecycleStage,
  PreventiveCareCategory,
  PreventiveCareStatus,
  PreventiveCareMetrics
} from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { AppointmentService } from './appointmentService';

export interface LifecycleStageMeta {
  key: PreventiveCareLifecycleStage;
  label: string;
  labelHi: string;
  labelBn: string;
  labelOr: string;
  icon: string;
  description: string;
}

export const PREVENTIVE_LIFECYCLE_STAGES: LifecycleStageMeta[] = [
  {
    key: 'recommended',
    label: 'Recommended',
    labelHi: 'सलाह दी गई',
    labelBn: 'পরামর্শ দেওয়া হয়েছে',
    labelOr: 'ପରାମର୍ଶ ଦିଆଯାଇଛି',
    icon: '💡',
    description: 'Health worker identified and logged preventive care need'
  },
  {
    key: 'due_date_set',
    label: 'Due Date Set',
    labelHi: 'तारीख तय',
    labelBn: 'তারিখ নির্ধারিত',
    labelOr: 'ତାରିଖ ନିର୍ଦ୍ଧାରିତ',
    icon: '📅',
    description: 'Target date scheduled for preventive activity'
  },
  {
    key: 'appointment_booked',
    label: 'Appointment Booked',
    labelHi: 'अपॉइंटमेंट बुक',
    labelBn: 'অ্যাপয়েন্টমেন্ট বুকড',
    labelOr: 'ଅପଏଣ୍ଟମେଣ୍ଟ ବୁକ୍ଡ୍',
    icon: '🎫',
    description: 'PHC clinic slot confirmed with live queue token'
  },
  {
    key: 'visit_completed',
    label: 'Visit Completed',
    labelHi: 'जांच पूर्ण',
    labelBn: 'পরীক্ষা সম্পন্ন',
    labelOr: 'ପରୀକ୍ଷା ସମ୍ପନ୍ନ',
    icon: '🩺',
    description: 'Patient attended PHC and received clinical checkup/vaccine'
  },
  {
    key: 'report_uploaded',
    label: 'Report Uploaded',
    labelHi: 'रिपोर्ट अपलोड',
    labelBn: 'রিপোর্ট আপলোড',
    labelOr: 'ରିପୋର୍ଟ ଅପଲୋଡ୍',
    icon: '📄',
    description: 'Paper OPD slip, lab report, or MCH card scanned into timeline'
  },
  {
    key: 'care_completed',
    label: 'Care Completed',
    labelHi: 'देखभाल पूर्ण',
    labelBn: 'সম্পূর্ণ সম্পন্ন',
    labelOr: 'ସମ୍ପୂର୍ଣ୍ଣ ସମାପ୍ତ',
    icon: '✅',
    description: 'Full preventive care lifecycle completed and verified'
  }
];

export const CATEGORY_DETAILS: Record<PreventiveCareCategory, { icon: string; labelEn: string; labelHi: string; labelBn: string; labelOr: string; color: string }> = {
  vaccination: {
    icon: '💉',
    labelEn: 'Vaccination',
    labelHi: 'टीकाकरण',
    labelBn: 'টিকা',
    labelOr: 'ଟିକାକରଣ',
    color: '#0057B8'
  },
  screening: {
    icon: '🔬',
    labelEn: 'Screening',
    labelHi: 'स्क्रीनिंग / जांच',
    labelBn: 'স্ক্রিনিং',
    labelOr: 'ସ୍କ୍ରିନିଂ / ପରୀକ୍ଷା',
    color: '#7C3AED'
  },
  checkup: {
    icon: '🩺',
    labelEn: 'Checkup',
    labelHi: 'स्वास्थ्य परीक्षण',
    labelBn: 'স্বাস্থ্য পরীক্ষা',
    labelOr: 'ସ୍ୱାସ୍ଥ୍ୟ ପରୀକ୍ଷା',
    color: '#059669'
  },
  follow_up: {
    icon: '📋',
    labelEn: 'Follow-up',
    labelHi: 'फॉलो-अप',
    labelBn: 'ফলো-আপ',
    labelOr: 'ଫଲୋ-ଅପ୍',
    color: '#D97706'
  }
};

const STORAGE_KEY = 'swastya_preventive_care_activities';

export const initialPreventiveActivities: PreventiveCareActivity[] = [
  {
    id: 'pca_101',
    patientId: 'pat_101',
    patientName: 'Aarav Sharma',
    patientAge: 42,
    patientVillage: 'Cuttack Sadar',
    patientPhone: '+91 98765 43210',
    activityName: 'Quarterly Diabetic Retinal & Foot Screening',
    category: 'screening',
    lifecycleStage: 'recommended',
    dueDate: '2026-08-28',
    recommendedDate: '2026-08-10',
    healthWorkerId: 'hw_1',
    healthWorkerName: 'Sunita Devi',
    healthWorkerRole: 'ASHA Worker',
    clinicId: 'clinic_1',
    clinicName: 'SCB Medical College OP Clinic',
    notes: 'Patient has Type 2 Diabetes; quarterly microvascular screening recommended to prevent neuropathy.',
    createdAt: '2026-08-10T10:00:00.000Z',
    status: 'due_soon',
    daysRemaining: 5,
    isCareGap: true,
    stageIndex: 0
  },
  {
    id: 'pca_102',
    patientId: 'pat_101',
    patientName: 'Aarav Sharma',
    patientAge: 42,
    patientVillage: 'Cuttack Sadar',
    patientPhone: '+91 98765 43210',
    activityName: 'Hypertension & Lipid Profile Review',
    category: 'checkup',
    lifecycleStage: 'appointment_booked',
    dueDate: '2026-08-25',
    recommendedDate: '2026-08-01',
    healthWorkerId: 'hw_1',
    healthWorkerName: 'Sunita Devi',
    healthWorkerRole: 'ASHA Worker',
    clinicId: 'clinic_1',
    clinicName: 'SCB Medical College OP Clinic',
    appointmentId: 'apt_prev_101',
    appointment: {
      id: 'apt_prev_101',
      tokenNumber: 1042,
      appointmentDate: '2026-08-25',
      slotTime: '10:30 AM',
      clinicName: 'SCB Medical College OP Clinic',
      status: 'Confirmed'
    },
    notes: 'Fasting lipid profile & BP trend review with Dr. Ananya Sen.',
    createdAt: '2026-08-01T09:30:00.000Z',
    status: 'due_soon',
    daysRemaining: 2,
    isCareGap: false,
    stageIndex: 2
  },
  {
    id: 'pca_103',
    patientId: 'pat_101',
    patientName: 'Aarav Sharma',
    patientAge: 42,
    patientVillage: 'Cuttack Sadar',
    patientPhone: '+91 98765 43210',
    activityName: 'Annual Influenza Booster Shot',
    category: 'vaccination',
    lifecycleStage: 'due_date_set',
    dueDate: '2026-08-18',
    recommendedDate: '2026-07-20',
    healthWorkerId: 'hw_1',
    healthWorkerName: 'Sunita Devi',
    healthWorkerRole: 'ASHA Worker',
    clinicId: 'clinic_2',
    clinicName: 'City Community Health Centre (CHC)',
    notes: 'Seasonal flu vaccination due for diabetic adult.',
    createdAt: '2026-07-20T11:15:00.000Z',
    status: 'overdue',
    daysRemaining: -5,
    isCareGap: true,
    stageIndex: 1
  },
  {
    id: 'pca_104',
    patientId: 'pat_101',
    patientName: 'Aarav Sharma',
    patientAge: 42,
    patientVillage: 'Cuttack Sadar',
    patientPhone: '+91 98765 43210',
    activityName: 'Renal Function & eGFR Blood Screening',
    category: 'screening',
    lifecycleStage: 'care_completed',
    dueDate: '2026-07-15',
    recommendedDate: '2026-06-20',
    healthWorkerId: 'hw_1',
    healthWorkerName: 'Sunita Devi',
    healthWorkerRole: 'ASHA Worker',
    clinicId: 'clinic_1',
    clinicName: 'SCB Medical College OP Clinic',
    appointmentId: 'apt_prev_098',
    appointment: {
      id: 'apt_prev_098',
      tokenNumber: 1018,
      appointmentDate: '2026-07-15',
      slotTime: '09:00 AM',
      clinicName: 'SCB Medical College OP Clinic',
      status: 'Completed'
    },
    medicalRecordId: 'rec_101',
    medicalRecordTitle: 'Renal Function Test (RFT) Report - July 2026',
    notes: 'eGFR within normal limits (92 mL/min). Serum creatinine 0.9 mg/dL.',
    completedAt: '2026-07-16T14:20:00.000Z',
    createdAt: '2026-06-20T08:00:00.000Z',
    status: 'completed',
    daysRemaining: -39,
    isCareGap: false,
    stageIndex: 5
  },
  {
    id: 'pca_201',
    patientId: 'pat_2',
    patientName: 'Shakuntala Devi',
    patientAge: 68,
    patientVillage: 'Sonarpur Sector 4',
    patientPhone: '+91 98765 11223',
    activityName: 'Post-Menopausal Bone Mineral Density (DEXA) Check',
    category: 'screening',
    lifecycleStage: 'due_date_set',
    dueDate: '2026-08-20',
    recommendedDate: '2026-08-01',
    healthWorkerId: 'hw_1',
    healthWorkerName: 'Sunita Devi',
    healthWorkerRole: 'ASHA Worker',
    clinicId: 'clinic_1',
    clinicName: 'SCB Medical College OP Clinic',
    notes: 'Evaluate osteopenia progression and calcium dosage calibration.',
    createdAt: '2026-08-01T12:00:00.000Z',
    status: 'overdue',
    daysRemaining: -3,
    isCareGap: true,
    stageIndex: 1
  },
  {
    id: 'pca_301',
    patientId: 'pat_3',
    patientName: 'Aarav Kumar (Child)',
    patientAge: 4,
    patientVillage: 'Sonarpur East',
    patientPhone: '+91 98765 33445',
    activityName: 'Measles-Rubella (MR-2) Booster Dose',
    category: 'vaccination',
    lifecycleStage: 'recommended',
    dueDate: '2026-08-30',
    recommendedDate: '2026-08-12',
    healthWorkerId: 'hw_1',
    healthWorkerName: 'Sunita Devi',
    healthWorkerRole: 'ASHA Worker',
    clinicId: 'clinic_2',
    clinicName: 'City Community Health Centre (CHC)',
    notes: 'Universal Immunization Programme (UIP) child booster immunization schedule.',
    createdAt: '2026-08-12T09:00:00.000Z',
    status: 'due_soon',
    daysRemaining: 7,
    isCareGap: true,
    stageIndex: 0
  },
  {
    id: 'pca_401',
    patientId: 'pat_4',
    patientName: 'Fatima Begum',
    patientAge: 29,
    patientVillage: 'Mangalabag Ward 12',
    patientPhone: '+91 98765 55667',
    activityName: 'Maternal Tetanus & Diphtheria (Td-2) Booster',
    category: 'vaccination',
    lifecycleStage: 'appointment_booked',
    dueDate: '2026-08-27',
    recommendedDate: '2026-08-05',
    healthWorkerId: 'hw_1',
    healthWorkerName: 'Sunita Devi',
    healthWorkerRole: 'ASHA Worker',
    clinicId: 'clinic_2',
    clinicName: 'City Community Health Centre (CHC)',
    appointmentId: 'apt_prev_401',
    appointment: {
      id: 'apt_prev_401',
      tokenNumber: 1058,
      appointmentDate: '2026-08-27',
      slotTime: '11:00 AM',
      clinicName: 'City Community Health Centre (CHC)',
      status: 'Confirmed'
    },
    notes: 'Maternal ANC immunization under Pradhan Mantri Surakshit Matritva Abhiyan.',
    createdAt: '2026-08-05T14:30:00.000Z',
    status: 'due_soon',
    daysRemaining: 4,
    isCareGap: false,
    stageIndex: 2
  },
  {
    id: 'pca_501',
    patientId: 'pat_5',
    patientName: 'Animesh Mondal',
    patientAge: 54,
    patientVillage: 'Chandi Road, Cuttack',
    patientPhone: '+91 98765 77889',
    activityName: 'DOTS 2-Month Sputum Microscopy Follow-Up',
    category: 'follow_up',
    lifecycleStage: 'visit_completed',
    dueDate: '2026-08-22',
    recommendedDate: '2026-08-02',
    healthWorkerId: 'hw_1',
    healthWorkerName: 'Sunita Devi',
    healthWorkerRole: 'ASHA Worker',
    clinicId: 'clinic_1',
    clinicName: 'SCB Medical College OP Clinic',
    notes: 'Intensive phase completion review for National TB Elimination Program (NTEP).',
    createdAt: '2026-08-02T10:00:00.000Z',
    status: 'completed',
    daysRemaining: -1,
    isCareGap: false,
    stageIndex: 3
  }
];

export class PreventiveCareService {
  private static stageKeys: PreventiveCareLifecycleStage[] = [
    'recommended',
    'due_date_set',
    'appointment_booked',
    'visit_completed',
    'report_uploaded',
    'care_completed'
  ];

  public static calculateStatus(
    stage: PreventiveCareLifecycleStage,
    dueDateStr: string,
    todayStr?: string
  ): { status: PreventiveCareStatus; daysRemaining: number } {
    const today = todayStr ? new Date(todayStr) : new Date();
    const todayYMD = today.toISOString().split('T')[0];

    if (stage === 'care_completed' || stage === 'visit_completed' || stage === 'report_uploaded') {
      const due = new Date(dueDateStr);
      const diffDays = Math.ceil((due.getTime() - new Date(todayYMD).getTime()) / (1000 * 60 * 60 * 24));
      return { status: 'completed', daysRemaining: diffDays };
    }

    const due = new Date(dueDateStr);
    const diffDays = Math.ceil((due.getTime() - new Date(todayYMD).getTime()) / (1000 * 60 * 60 * 24));

    if (dueDateStr < todayYMD) {
      return { status: 'overdue', daysRemaining: diffDays };
    }

    return { status: 'due_soon', daysRemaining: diffDays };
  }

  public static enrichActivity(act: PreventiveCareActivity): PreventiveCareActivity {
    const { status, daysRemaining } = this.calculateStatus(act.lifecycleStage, act.dueDate);
    const isCareGap = (act.lifecycleStage === 'recommended' || act.lifecycleStage === 'due_date_set') && !act.appointmentId;
    let stageIndex = this.stageKeys.indexOf(act.lifecycleStage);
    if (stageIndex === -1) stageIndex = 0;

    return {
      ...act,
      status,
      daysRemaining,
      isCareGap,
      stageIndex
    };
  }

  public static getAllActivities(): PreventiveCareActivity[] {
    const data = StorageService.getItem<PreventiveCareActivity[]>(STORAGE_KEY, initialPreventiveActivities);
    return data.map((a) => this.enrichActivity(a));
  }

  public static saveActivities(activities: PreventiveCareActivity[]): void {
    StorageService.setItem(STORAGE_KEY, activities);
  }

  public static getPatientActivities(patientId: string = 'pat_101'): PreventiveCareActivity[] {
    const all = this.getAllActivities();
    const filtered = all.filter((a) => a.patientId === patientId);
    return filtered.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }

  public static getActivityById(id: string): PreventiveCareActivity | undefined {
    const all = this.getAllActivities();
    const found = all.find((a) => a.id === id);
    return found ? this.enrichActivity(found) : undefined;
  }

  public static getMetrics(patientId?: string): PreventiveCareMetrics {
    const activities = patientId ? this.getPatientActivities(patientId) : this.getAllActivities();
    const completed = activities.filter((a) => a.status === 'completed').length;
    const dueSoon = activities.filter((a) => a.status === 'due_soon').length;
    const overdue = activities.filter((a) => a.status === 'overdue').length;
    const careGapsCount = activities.filter((a) => a.isCareGap).length;

    return {
      total: activities.length,
      completed,
      dueSoon,
      overdue,
      careGapsCount
    };
  }

  public static getCareGaps(patientId?: string): PreventiveCareActivity[] {
    const activities = patientId ? this.getPatientActivities(patientId) : this.getAllActivities();
    return activities.filter((a) => a.isCareGap);
  }

  public static createRecommendation(input: {
    patientId: string;
    patientName: string;
    patientAge: number;
    patientVillage: string;
    patientPhone?: string;
    activityName: string;
    category: PreventiveCareCategory;
    dueDate: string;
    notes?: string;
    healthWorkerName?: string;
    healthWorkerRole?: string;
    clinicName?: string;
  }): PreventiveCareActivity {
    const all = this.getAllActivities();
    const todayYMD = new Date().toISOString().split('T')[0];

    const newActivity: PreventiveCareActivity = {
      id: `pca_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      patientId: input.patientId,
      patientName: input.patientName,
      patientAge: input.patientAge,
      patientVillage: input.patientVillage,
      patientPhone: input.patientPhone,
      activityName: input.activityName,
      category: input.category,
      lifecycleStage: 'due_date_set',
      dueDate: input.dueDate,
      recommendedDate: todayYMD,
      healthWorkerId: 'hw_1',
      healthWorkerName: input.healthWorkerName || 'Sunita Devi',
      healthWorkerRole: input.healthWorkerRole || 'ASHA Worker',
      clinicId: 'clinic_1',
      clinicName: input.clinicName || 'SCB Medical College OP Clinic',
      notes: input.notes || 'Preventive care activity recommended by health worker.',
      createdAt: new Date().toISOString(),
      status: 'due_soon',
      daysRemaining: Math.ceil((new Date(input.dueDate).getTime() - new Date(todayYMD).getTime()) / (1000 * 60 * 60 * 24)),
      isCareGap: true,
      stageIndex: 1
    };

    const enriched = this.enrichActivity(newActivity);
    all.unshift(enriched);
    this.saveActivities(all);

    return enriched;
  }

  public static advanceStage(
    activityId: string,
    newStage: PreventiveCareLifecycleStage,
    notes?: string,
    medicalRecordTitle?: string
  ): PreventiveCareActivity | null {
    const all = this.getAllActivities();
    const index = all.findIndex((a) => a.id === activityId);
    if (index === -1) return null;

    const existing = all[index];
    const isCompleted = newStage === 'care_completed' || newStage === 'visit_completed';

    const updated: PreventiveCareActivity = {
      ...existing,
      lifecycleStage: newStage,
      notes: notes !== undefined ? notes : existing.notes,
      completedAt: isCompleted ? (existing.completedAt || new Date().toISOString()) : existing.completedAt,
      medicalRecordTitle: medicalRecordTitle || existing.medicalRecordTitle
    };

    const enriched = this.enrichActivity(updated);
    all[index] = enriched;
    this.saveActivities(all);

    // Update linked appointment status if completed
    if (isCompleted && enriched.appointmentId) {
      try {
        const apts = AppointmentService.getAppointments();
        const aptIdx = apts.findIndex((a) => a.id === enriched.appointmentId);
        if (aptIdx !== -1) {
          apts[aptIdx].status = 'Completed';
          StorageService.setItem(STORAGE_KEYS.APPOINTMENTS, apts);
        }
      } catch (err) {
        console.error('Error updating linked appointment status:', err);
      }
    }

    return enriched;
  }

  public static bookAppointmentForActivity(
    activityId: string,
    clinicId: string,
    clinicName: string,
    appointmentDate: string,
    slotTime: string,
    priorityFlag: string = 'Regular'
  ): { activity: PreventiveCareActivity; tokenNumber: number } | null {
    const all = this.getAllActivities();
    const index = all.findIndex((a) => a.id === activityId);
    if (index === -1) return null;

    const existing = all[index];
    const tokenNumber = Math.floor(1000 + Math.random() * 900);
    const appointmentId = `apt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Add appointment into appointment service as well
    try {
      AppointmentService.bookAppointment({
        doctorName: `OPD Specialist (${clinicName})`,
        specialty: existing.category === 'vaccination' ? 'Immunization OPD' : 'General Medicine / Preventive OPD',
        hospitalClinic: clinicName,
        appointmentDate: appointmentDate,
        appointmentTime: slotTime,
        purpose: `Preventive: ${existing.activityName}`
      });
    } catch (err) {
      console.warn('Could not inject into AppointmentService:', err);
    }

    const updated: PreventiveCareActivity = {
      ...existing,
      clinicId,
      clinicName,
      appointmentId,
      appointment: {
        id: appointmentId,
        tokenNumber,
        appointmentDate,
        slotTime,
        clinicName,
        status: 'Confirmed'
      },
      lifecycleStage: 'appointment_booked'
    };

    const enriched = this.enrichActivity(updated);
    all[index] = enriched;
    this.saveActivities(all);

    return { activity: enriched, tokenNumber };
  }

  public static deleteActivity(activityId: string): boolean {
    const all = this.getAllActivities();
    const filtered = all.filter((a) => a.id !== activityId);
    if (filtered.length !== all.length) {
      this.saveActivities(filtered);
      return true;
    }
    return false;
  }

  public static resetToMockData(): PreventiveCareActivity[] {
    this.saveActivities(initialPreventiveActivities);
    return initialPreventiveActivities.map((a) => this.enrichActivity(a));
  }
}
