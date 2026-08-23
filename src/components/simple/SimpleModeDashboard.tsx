import React from 'react';
import { 
  Pill, 
  Stethoscope, 
  FileText, 
  Hospital, 
  Mic, 
  AlertTriangle,
  Volume2,
  ShieldCheck
} from 'lucide-react';
import { VoiceService } from '../../services/voiceService';

interface SimpleModeDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenEmergency: () => void;
  onOpenAssistant: () => void;
}

export const SimpleModeDashboard: React.FC<SimpleModeDashboardProps> = ({
  onNavigate,
  onOpenEmergency,
  onOpenAssistant
}) => {

  const speakPrompt = (text: string) => {
    VoiceService.speakText(text);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      
      {/* Voice Instruction Header */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl text-center space-y-1">
        <div className="flex items-center justify-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold text-sm">
          <Volume2 className="w-4 h-4 text-zinc-500" />
          <span>Simple Mode</span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Tap any button or tap "Voice Assistant" to speak.
        </p>
      </div>

      {/* Emergency Outlined Alert Button */}
      <button
        onClick={onOpenEmergency}
        onMouseEnter={() => speakPrompt("Emergency Help")}
        className="w-full border-2 border-red-200 dark:border-red-900/80 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 p-5 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-xs"
      >
        <AlertTriangle className="w-6 h-6 shrink-0 text-red-600 dark:text-red-400" />
        <div className="text-left">
          <span className="text-base font-semibold block">Emergency Assistance</span>
          <span className="text-xs text-red-700/80 dark:text-red-400/80">Call 108 ambulance & emergency services</span>
        </div>
      </button>

      {/* Grid of Large Clean Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* MY MEDICINES */}
        <button
          onClick={() => {
            speakPrompt("My Medicines");
            onNavigate('medicines');
          }}
          className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-xs flex flex-col items-start gap-2 transition-colors text-left"
        >
          <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 block">My Medicines</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Daily dose schedule & reminders</span>
          </div>
        </button>

        {/* DOCTOR APPOINTMENTS */}
        <button
          onClick={() => {
            speakPrompt("Doctor Appointments");
            onNavigate('appointments');
          }}
          className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-xs flex flex-col items-start gap-2 transition-colors text-left"
        >
          <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 block">Doctor Visits</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">OPD queue & booked appointments</span>
          </div>
        </button>

        {/* MY REPORTS */}
        <button
          onClick={() => {
            speakPrompt("My Health Reports");
            onNavigate('records');
          }}
          className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-xs flex flex-col items-start gap-2 transition-colors text-left"
        >
          <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 block">Health Records</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Scanned files & test reports</span>
          </div>
        </button>

        {/* FIND HOSPITAL */}
        <button
          onClick={() => {
            speakPrompt("Find Hospital");
            onNavigate('hospitals');
          }}
          className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-xs flex flex-col items-start gap-2 transition-colors text-left"
        >
          <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            <Hospital className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 block">Find Hospital</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Nearby ICU beds & phone routing</span>
          </div>
        </button>

        {/* PREVENTIVE CARE */}
        <button
          onClick={() => {
            speakPrompt("Preventive Care and Vaccines");
            onNavigate('preventive_care');
          }}
          className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-xs flex flex-col items-start gap-2 transition-colors text-left sm:col-span-2"
        >
          <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 block">Preventive Care & Vaccines</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Immunization schedule, checkups, and care gaps</span>
          </div>
        </button>

      </div>

      {/* TALK TO ASSISTANT */}
      <button
        onClick={() => {
          speakPrompt("Talk to Assistant");
          onOpenAssistant();
        }}
        className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 p-4 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
      >
        <Mic className="w-4 h-4" />
        <span className="text-xs font-semibold">Speak with SWASTYA Assistant</span>
      </button>

    </div>
  );
};

export default SimpleModeDashboard;
