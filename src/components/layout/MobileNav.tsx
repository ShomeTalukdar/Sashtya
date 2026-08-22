import React from 'react';
import { Home, FileText, Pill, Bot, AlertTriangle } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenEmergency: () => void;
  onOpenAssistant: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onNavigate,
  onOpenEmergency,
  onOpenAssistant
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-lg px-2 py-2">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-bold transition-colors ${
            activeTab === 'home' ? 'text-[#0057B8]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        {/* Records */}
        <button
          onClick={() => onNavigate('records')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-bold transition-colors ${
            activeTab === 'records' ? 'text-[#0057B8]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Records</span>
        </button>

        {/* 🚨 Emergency Floating Center Action */}
        <button
          onClick={onOpenEmergency}
          aria-label="Emergency"
          className="flex flex-col items-center justify-center -mt-5 bg-[#D92D20] text-white p-3 rounded-full shadow-emergency border-2 border-white active:scale-95 transition-transform"
        >
          <AlertTriangle className="w-6 h-6 fill-white text-[#D92D20]" />
        </button>

        {/* Medicines */}
        <button
          onClick={() => onNavigate('medicines')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-bold transition-colors ${
            activeTab === 'medicines' ? 'text-[#0057B8]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Pill className="w-5 h-5" />
          <span>Medicines</span>
        </button>

        {/* Assistant */}
        <button
          onClick={onOpenAssistant}
          className="flex flex-col items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-bold text-[#0057B8] hover:text-blue-800"
        >
          <Bot className="w-5 h-5" />
          <span>Assistant</span>
        </button>

      </div>
    </div>
  );
};
