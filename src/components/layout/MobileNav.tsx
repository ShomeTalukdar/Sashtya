import React from 'react';
import { Home, ShieldCheck, FileText, Pill, AlertTriangle } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenEmergency: () => void;
  onOpenAssistant: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onNavigate,
  onOpenEmergency
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 px-3 py-1.5">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 py-1 text-[10px] font-medium transition-colors ${
            activeTab === 'home' ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        {/* Preventive */}
        <button
          onClick={() => onNavigate('preventive_care')}
          className={`flex flex-col items-center gap-1 py-1 text-[10px] font-medium transition-colors ${
            activeTab === 'preventive_care' ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Preventive</span>
        </button>

        {/* Records */}
        <button
          onClick={() => onNavigate('records')}
          className={`flex flex-col items-center gap-1 py-1 text-[10px] font-medium transition-colors ${
            activeTab === 'records' ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Records</span>
        </button>

        {/* Medicines */}
        <button
          onClick={() => onNavigate('medicines')}
          className={`flex flex-col items-center gap-1 py-1 text-[10px] font-medium transition-colors ${
            activeTab === 'medicines' ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Medicines</span>
        </button>

        {/* Emergency */}
        <button
          onClick={onOpenEmergency}
          aria-label="Emergency"
          className="flex flex-col items-center gap-1 py-1 text-[10px] font-medium text-red-600 dark:text-red-400 transition-colors"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Emergency</span>
        </button>

      </div>
    </div>
  );
};

export default MobileNav;
