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
  Heart,
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
    <div className="space-y-6 pb-12">
      
      {/* Welcome Header & Today Overview (Section 6 & 59) */}
      <div className="bg-gradient-to-r from-[#0057B8] to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-200">Patient Dashboard</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
                Good morning, {patient.fullName} 👋
              </h1>
              <p className="text-sm sm:text-base font-medium text-blue-100 mt-1">
                Here's what needs your health attention today.
              </p>
            </div>

            {/* Quick Prescription Scan Launch Button */}
            <button
              onClick={onOpenScanModal}
              className="bg-white text-[#0057B8] hover:bg-blue-50 font-extrabold text-xs sm:text-sm px-4 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Scan Prescription OCR</span>
            </button>
          </div>

          {/* Today Snapshot Metrics */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/15 text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
              <span className="block text-xl sm:text-2xl font-black">{patient.currentMedicationsCount}</span>
              <span className="text-[11px] sm:text-xs font-semibold text-blue-100">Medicines Today</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
              <span className="block text-xl sm:text-2xl font-black">1</span>
              <span className="text-[11px] sm:text-xs font-semibold text-blue-100">Upcoming Visit</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
              <span className="block text-xl sm:text-2xl font-black">1</span>
              <span className="text-[11px] sm:text-xs font-semibold text-blue-100">Pending Follow-up</span>
            </div>
          </div>
        </div>
      </div>

      {/* LEVEL 1 — IMMEDIATE DANGER: 🚨 ALWAYS-VISIBLE EMERGENCY BANNER */}
      <div 
        onClick={onOpenEmergency}
        className="bg-gradient-to-r from-[#D92D20] to-red-700 text-white rounded-3xl p-5 sm:p-6 shadow-emergency border-2 border-white/20 cursor-pointer hover:scale-[1.01] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group select-none"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-white/20 group-hover:rotate-12 transition-transform">
            <AlertTriangle className="w-8 h-8 text-white fill-white animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-white text-[#D92D20] font-black text-[10px] uppercase px-2 py-0.5 rounded-full">
                PRIORITY LEVEL 1
              </span>
              <span className="text-xs font-semibold text-white/90">24x7 Ambulance & Hospital Routing</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-wide mt-0.5">
              🚨 EMERGENCY ASSISTANCE
            </h2>
            <p className="text-xs sm:text-sm font-medium text-white/90">
              Instant 108 call, emergency contact dial, GPS sharing & QR emergency card
            </p>
          </div>
        </div>

        <button className="bg-white text-[#D92D20] font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md group-hover:bg-red-50 transition-colors flex items-center justify-center gap-2 shrink-0">
          <span>Get Help Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* LEVEL 2 — WHAT NEEDS ATTENTION TODAY */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 px-1">
          TODAY'S SCHEDULE
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Next Medication Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-50 text-[#0057B8]">
                  <Pill className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#0057B8] uppercase">Next Scheduled Dose</span>
                  <h4 className="font-extrabold text-slate-900 text-lg">
                    {nextMedication ? nextMedication.medication.medicineName : 'Telmisartan 40 mg'}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {nextMedication ? nextMedication.medication.instructions : '1 Tablet after morning breakfast'}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-[#0057B8] text-xs font-black shrink-0">
                {nextMedication ? nextMedication.nextTime : '08:00 AM'}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Scheduled Today</span>
              </span>
              <button
                onClick={() => nextMedication && onMarkMedTaken(nextMedication.medication.id)}
                className="bg-[#0057B8] hover:bg-blue-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Taken</span>
              </button>
            </div>
          </div>

          {/* Next Appointment Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase">Upcoming Doctor Visit</span>
                  <h4 className="font-extrabold text-slate-900 text-lg">
                    {nextAppointment ? nextAppointment.doctorName : 'Dr. Ananya Sen (Cardiologist)'}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {nextAppointment ? nextAppointment.hospitalClinic : 'SCB Medical College OP Clinic'}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black shrink-0">
                Tomorrow, 10:30 AM
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                Queue est: #7 in line (~25m wait)
              </span>
              <button
                onClick={() => onNavigate('appointments')}
                className="text-[#0057B8] hover:text-blue-800 font-extrabold text-xs flex items-center gap-1"
              >
                <span>Manage Queue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* LEVEL 3 — YOUR HEALTHCARE MANAGEMENT MODULES */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 px-1">
          YOUR HEALTHCARE MANAGEMENT
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Health Records */}
          <div 
            onClick={() => onNavigate('records')}
            className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-cardHover cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0057B8] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">Health Records</h4>
            <p className="text-xs text-slate-500 mt-0.5">Scans, Reports, OCR</p>
          </div>

          {/* Family Health */}
          <div 
            onClick={() => onNavigate('family')}
            className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-cardHover cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">My Family</h4>
            <p className="text-xs text-slate-500 mt-0.5">Caregivers & Permissions</p>
          </div>

          {/* Insurance */}
          <div 
            onClick={() => onNavigate('insurance')}
            className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-cardHover cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">Insurance Hub</h4>
            <p className="text-xs text-slate-500 mt-0.5">PM-JAY & Claim Tracker</p>
          </div>

          {/* Bills */}
          <div 
            onClick={() => onNavigate('bills')}
            className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-cardHover cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Receipt className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">Medical Bills</h4>
            <p className="text-xs text-slate-500 mt-0.5">Transparency Calculator</p>
          </div>

        </div>
      </div>

      {/* LEVEL 4 — FIND CARE & SPECIAL CARE SERVICES */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 px-1">
          FIND CARE & SPECIAL SUPPORT
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Nearby Hospitals */}
          <div 
            onClick={() => onNavigate('hospitals')}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card hover:shadow-cardHover cursor-pointer transition-all flex items-center gap-4"
          >
            <div className="p-3 rounded-2xl bg-red-50 text-[#D92D20]">
              <Hospital className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">Nearby Hospitals</h4>
              <p className="text-xs text-slate-500">24x7 ICU & Emergency routing</p>
            </div>
          </div>

          {/* Government Schemes */}
          <div 
            onClick={() => onNavigate('schemes')}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card hover:shadow-cardHover cursor-pointer transition-all flex items-center gap-4"
          >
            <div className="p-3 rounded-2xl bg-blue-50 text-[#0057B8]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">Healthcare Benefits</h4>
              <p className="text-xs text-slate-500">PM-JAY & Jan Aushadhi</p>
            </div>
          </div>

          {/* Special Care (Pregnancy & Disability) */}
          <div 
            onClick={() => onNavigate('special')}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card hover:shadow-cardHover cursor-pointer transition-all flex items-center gap-4"
          >
            <div className="p-3 rounded-2xl bg-pink-50 text-pink-700">
              <Baby className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">Special Care</h4>
              <p className="text-xs text-slate-500">Maternal & Disability Support</p>
            </div>
          </div>

        </div>
      </div>

      {/* SWASTYA Assistant Banner */}
      <div 
        onClick={onOpenAssistant}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:border-[#0057B8] transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#0057B8] text-white shadow-md">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-lg">Have a healthcare question?</h4>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Talk or type with SWASTYA Multilingual Assistant in English, Hindi, Bengali, or Odia.
            </p>
          </div>
        </div>

        <button className="bg-[#0057B8] text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-xs hover:bg-blue-800 transition-colors flex items-center gap-2 shrink-0">
          <span>Talk to Assistant</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
