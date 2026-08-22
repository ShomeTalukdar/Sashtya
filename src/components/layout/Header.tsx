import React from 'react';
import {
  Heart,
  AlertTriangle,
  Globe,
  Wifi,
  WifiOff,
  RefreshCw,
  Bot,
  Sparkles,
  Moon,
  Sun
} from 'lucide-react';
import { SyncStatus } from '../../types';

interface HeaderProps {
  currentLang: 'en' | 'hi' | 'bn' | 'or';
  onLangChange: (lang: 'en' | 'hi' | 'bn' | 'or') => void;
  isSimpleMode: boolean;
  onToggleSimpleMode: () => void;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  syncStatus: SyncStatus;
  onOpenEmergency: () => void;
  onOpenAssistant: () => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLangChange,
  isSimpleMode,
  onToggleSimpleMode,
  isHighContrast,
  onToggleHighContrast,
  isDarkMode,
  onToggleDarkMode,
  syncStatus,
  onOpenEmergency,
  onOpenAssistant,
  activeTab,
  onNavigate
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F0]/95 dark:bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#0057B8] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Heart className="w-6 h-6 fill-white text-[#0057B8]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#0057B8] dark:text-blue-400">SWASTYA</span>
              <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EAF3FF] dark:bg-blue-950/80 text-[#0057B8] dark:text-blue-300 dark:border dark:border-blue-800 hidden sm:inline-block">
                PATIENT & FAMILY
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 hidden md:block">
              Your health. Your family. One place.
            </p>
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-2xs">
          {syncStatus === 'Synced' && (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Synced</span>
            </>
          )}
          {syncStatus === 'Syncing' && (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-[#0057B8] dark:text-blue-400 animate-spin" />
              <span className="text-[#0057B8] dark:text-blue-400 font-semibold">Syncing...</span>
            </>
          )}
          {syncStatus === 'Offline' && (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-700 dark:text-amber-400 font-semibold">Offline Mode</span>
            </>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
          {[
            { id: 'home', label: 'Home' },
            { id: 'records', label: 'Records' },
            { id: 'medicines', label: 'Medicines' },
            { id: 'appointments', label: 'Appointments' },
            { id: 'family', label: 'Family' },
            { id: 'insurance', label: 'Insurance' },
            { id: 'bills', label: 'Bills' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`px-3 py-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-[#0057B8] text-white shadow-xs font-bold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right Action Controls: Lang Picker, Mode Toggles, Assistant, 🚨 EMERGENCY */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Simple Mode Toggle */}
          <button
            onClick={onToggleSimpleMode}
            title={isSimpleMode ? "Switch to Standard Mode" : "Switch to Simple Mode for low digital literacy / elderly"}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all border ${
              isSimpleMode 
                ? 'bg-amber-500 text-white border-amber-600 shadow-md' 
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400 fill-amber-400" />
            <span className="hidden xs:inline">{isSimpleMode ? 'Simple Mode' : 'Simple Mode'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all border ${
              isDarkMode
                ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700 fill-slate-700" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-1 sm:px-2.5 sm:py-1.5 shadow-2xs">
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 dark:text-slate-400 mr-1" />
            <select
              value={currentLang}
              onChange={(e) => onLangChange(e.target.value as any)}
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer pr-1"
            >
              <option value="en" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">English</option>
              <option value="hi" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">हिंदी (Hindi)</option>
              <option value="bn" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">বাংলা (Bengali)</option>
              <option value="or" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">ଓଡ଼ିଆ (Odia)</option>
            </select>
          </div>

          {/* Assistant Launcher Button */}
          <button
            onClick={onOpenAssistant}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EAF3FF] dark:bg-blue-950/90 hover:bg-blue-100 dark:hover:bg-blue-900 text-[#0057B8] dark:text-blue-300 font-bold text-xs sm:text-sm transition-colors border border-blue-200 dark:border-blue-800"
          >
            <Bot className="w-4 h-4 text-[#0057B8] dark:text-blue-400" />
            <span>Assistant</span>
          </button>

          {/* 🚨 ALWAYS VISIBLE EMERGENCY BUTTON (SECTION 7 & 58) */}
          <button
            onClick={onOpenEmergency}
            aria-label="Emergency Assistance"
            className="emergency-pulse-btn bg-[#D92D20] hover:bg-[#B42318] active:scale-95 text-white font-extrabold text-xs sm:text-sm px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl flex items-center gap-1.5 sm:gap-2 shadow-emergency transition-all border-2 border-white/20"
          >
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-[#D92D20] animate-bounce" />
            <span className="tracking-wide">EMERGENCY</span>
          </button>

        </div>

      </div>
    </header>
  );
};
