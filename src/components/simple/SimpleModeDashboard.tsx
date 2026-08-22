import React from 'react';
import { 
  Pill, 
  Stethoscope, 
  FileText, 
  Hospital, 
  Mic, 
  AlertTriangle,
  Volume2
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
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Voice Instruction Header */}
      <div className="bg-amber-50 border-2 border-amber-300 p-5 rounded-3xl text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-amber-900 font-extrabold text-lg sm:text-xl">
          <Volume2 className="w-6 h-6 text-amber-700 animate-pulse" />
          <span>SIMPLE MODE — BIG BUTTONS</span>
        </div>
        <p className="text-sm font-bold text-amber-800">
          Tap any big icon below or tap "TALK" to speak.
        </p>
      </div>

      {/* 🚨 Emergency Ultra-Large Button */}
      <button
        onClick={onOpenEmergency}
        onMouseEnter={() => speakPrompt("Emergency Help")}
        className="w-full bg-[#D92D20] hover:bg-red-700 text-white p-6 sm:p-8 rounded-3xl shadow-emergency border-4 border-white flex flex-col items-center justify-center gap-3 transition-transform active:scale-95 group"
      >
        <AlertTriangle className="w-16 h-16 fill-white text-[#D92D20] group-hover:animate-bounce" />
        <span className="text-3xl sm:text-4xl font-black tracking-wider">🚨 EMERGENCY</span>
        <span className="text-base sm:text-lg font-bold text-white/90">Call Ambulance & Help</span>
      </button>

      {/* Grid of 5 Ultra-Large Cards (Section 26) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        
        {/* 💊 MY MEDICINES */}
        <button
          onClick={() => {
            speakPrompt("My Medicines");
            onNavigate('medicines');
          }}
          className="bg-white hover:bg-blue-50 border-3 border-[#0057B8] text-[#0057B8] p-6 sm:p-8 rounded-3xl shadow-md flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group"
        >
          <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Pill className="w-12 h-12 text-[#0057B8]" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">💊 MY MEDICINES</span>
          <span className="text-sm font-bold text-slate-600">See Dawa Schedule</span>
        </button>

        {/* 🩺 DOCTOR */}
        <button
          onClick={() => {
            speakPrompt("Doctor Appointments");
            onNavigate('appointments');
          }}
          className="bg-white hover:bg-emerald-50 border-3 border-emerald-600 text-emerald-800 p-6 sm:p-8 rounded-3xl shadow-md flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group"
        >
          <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Stethoscope className="w-12 h-12 text-emerald-700" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">🩺 DOCTOR</span>
          <span className="text-sm font-bold text-slate-600">Check Appointment Queue</span>
        </button>

        {/* 📄 MY REPORTS */}
        <button
          onClick={() => {
            speakPrompt("My Health Reports");
            onNavigate('records');
          }}
          className="bg-white hover:bg-purple-50 border-3 border-purple-600 text-purple-800 p-6 sm:p-8 rounded-3xl shadow-md flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group"
        >
          <div className="w-20 h-20 rounded-2xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-12 h-12 text-purple-700" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">📄 MY REPORTS</span>
          <span className="text-sm font-bold text-slate-600">Scan Prescription / Files</span>
        </button>

        {/* 🏥 FIND HOSPITAL */}
        <button
          onClick={() => {
            speakPrompt("Find Hospital");
            onNavigate('hospitals');
          }}
          className="bg-white hover:bg-red-50 border-3 border-red-500 text-red-800 p-6 sm:p-8 rounded-3xl shadow-md flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group"
        >
          <div className="w-20 h-20 rounded-2xl bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Hospital className="w-12 h-12 text-red-700" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">🏥 FIND HOSPITAL</span>
          <span className="text-sm font-bold text-slate-600">Nearby ICU & Emergency</span>
        </button>

      </div>

      {/* 🎤 TALK TO ASSISTANT */}
      <button
        onClick={() => {
          speakPrompt("Talk to Assistant");
          onOpenAssistant();
        }}
        className="w-full bg-[#0057B8] hover:bg-blue-800 text-white p-6 sm:p-8 rounded-3xl shadow-lg border-4 border-blue-300 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group"
      >
        <Mic className="w-14 h-14 text-white group-hover:scale-110 transition-transform" />
        <span className="text-2xl sm:text-3xl font-extrabold">🎤 TALK TO SWASTYA</span>
        <span className="text-base font-bold text-blue-100">Speak in Hindi, Bengali, Odia, English</span>
      </button>

    </div>
  );
};
