import React from 'react';
import {
  Pill,
  Calendar,
  FileText,
  Users,
  ShieldCheck,
  Receipt,
  Hospital,
  Bot,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  Baby,
  Award
} from 'lucide-react';
import { PatientProfile, MedicationSchedule, Appointment } from '../../types';

interface HomeDashboardProps {
  patient: PatientProfile;
  nextMedication: { medication: MedicationSchedule; nextTime: string } | null;
  nextAppointment: Appointment | undefined;
  onNavigate: (tab: string) => void;
  onOpenEmergency: () => void;
  onOpenAssistant: () => void;
  onOpenScanModal: () => void;
  onMarkMedTaken: (medId: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  patient,
  nextMedication,
  nextAppointment,
  onNavigate,
  onOpenEmergency,
  onOpenAssistant,
  onOpenScanModal,
  onMarkMedTaken
}) => {
  return (
    <div className="space-y-8">
      
      {/* Header & Overview */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
              Patient Overview
            </span>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
              Good morning, {patient.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Here is your healthcare summary for today.
            </p>
          </div>

          <button
            onClick={onOpenScanModal}
            className="self-start sm:self-auto bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scan Prescription</span>
          </button>
        </div>

        {/* Minimalist Stats Row with Dividers */}
        <div className="grid grid-cols-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/60 p-4 divide-x divide-zinc-200 dark:divide-zinc-800 text-center shadow-xs">
          <div className="px-2">
            <span className="block text-xl font-semibold text-zinc-900 dark:text-zinc-100">{patient.currentMedicationsCount}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Medicines Today</span>
          </div>
          <div className="px-2">
            <span className="block text-xl font-semibold text-zinc-900 dark:text-zinc-100">1</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Upcoming Visit</span>
          </div>
          <div className="px-2">
            <span className="block text-xl font-semibold text-zinc-900 dark:text-zinc-100">1</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Care Follow-up</span>
          </div>
        </div>
      </div>

      {/* Clean Outlined Emergency Alert Card */}
      <div 
        onClick={onOpenEmergency}
        className="border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 rounded-xl p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-red-50/70 dark:hover:bg-red-950/30 transition-colors shadow-xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-red-900 dark:text-red-300">
              Emergency Assistance & 108 Hotline
            </h2>
            <p className="text-xs text-red-700/80 dark:text-red-400/80 mt-0.5">
              Instant ambulance call, emergency contact dial, GPS sharing & QR medical card.
            </p>
          </div>
        </div>

        <button className="text-xs font-medium text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0 transition-colors">
          <span>Get Help</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* TODAY'S SCHEDULE */}
      <div className="space-y-3">
        <h2 className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
          Today's Schedule
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Next Medication Card */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-zinc-400 uppercase">Scheduled Dose</span>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5">
                    {nextMedication ? nextMedication.medication.medicineName : 'Telmisartan 40 mg'}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {nextMedication ? nextMedication.medication.instructions : '1 Tablet after morning breakfast'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md shrink-0">
                {nextMedication ? nextMedication.nextTime : '08:00 AM'}
              </span>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Today</span>
              </span>
              <button
                onClick={() => nextMedication && onMarkMedTaken(nextMedication.medication.id)}
                className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Taken</span>
              </button>
            </div>
          </div>

          {/* Next Appointment Card */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-zinc-400 uppercase">Upcoming Visit</span>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5">
                    {nextAppointment ? nextAppointment.doctorName : 'Dr. Ananya Sen (Cardiologist)'}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {nextAppointment ? nextAppointment.hospitalClinic : 'SCB Medical College OP Clinic'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md shrink-0">
                Tomorrow, 10:30 AM
              </span>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Queue: #7 in line (~25m wait)
              </span>
              <button
                onClick={() => onNavigate('appointments')}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View Queue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* HEALTHCARE MANAGEMENT MODULES */}
      <div className="space-y-3">
        <h2 className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
          Healthcare Management
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Preventive Care Tracker */}
          <div 
            onClick={() => onNavigate('preventive_care')}
            className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer transition-colors space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <ShieldCheck className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-600 transition-colors" />
              <span className="text-[10px] font-medium text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">6-Stage</span>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Preventive Care</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Vaccines, Screenings & Gaps</p>
            </div>
          </div>

          {/* Health Records */}
          <div 
            onClick={() => onNavigate('records')}
            className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer transition-colors space-y-2 group"
          >
            <FileText className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-600 transition-colors" />
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Health Records</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Scans, Reports, OCR</p>
            </div>
          </div>

          {/* Family Health */}
          <div 
            onClick={() => onNavigate('family')}
            className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer transition-colors space-y-2 group"
          >
            <Users className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-600 transition-colors" />
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">My Family</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Caregivers & Permissions</p>
            </div>
          </div>

          {/* Insurance */}
          <div 
            onClick={() => onNavigate('insurance')}
            className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer transition-colors space-y-2 group"
          >
            <Receipt className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-600 transition-colors" />
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Insurance Hub</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">PM-JAY & Claim Tracker</p>
            </div>
          </div>

        </div>
      </div>

      {/* FIND CARE & SPECIAL SUPPORT */}
      <div className="space-y-3">
        <h2 className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
          Find Care & Support
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Nearby Hospitals */}
          <div 
            onClick={() => onNavigate('hospitals')}
            className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer transition-colors flex items-center gap-3 group"
          >
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 group-hover:text-indigo-600 transition-colors">
              <Hospital className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Nearby Hospitals</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">24x7 ICU & Routing</p>
            </div>
          </div>

          {/* Government Schemes */}
          <div 
            onClick={() => onNavigate('schemes')}
            className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer transition-colors flex items-center gap-3 group"
          >
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 group-hover:text-indigo-600 transition-colors">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Healthcare Schemes</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">PM-JAY & Jan Aushadhi</p>
            </div>
          </div>

          {/* Special Care */}
          <div 
            onClick={() => onNavigate('special')}
            className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer transition-colors flex items-center gap-3 group"
          >
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 group-hover:text-indigo-600 transition-colors">
              <Baby className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Special Care</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Maternal & Disability</p>
            </div>
          </div>

        </div>
      </div>

      {/* SWASTYA Assistant Callout */}
      <div 
        onClick={onOpenAssistant}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Healthcare Assistant</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Ask symptom questions or navigate hospital services in English, Hindi, Bengali, or Odia.
            </p>
          </div>
        </div>

        <button className="text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition-colors">
          <span>Open Assistant</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};

export default HomeDashboard;
