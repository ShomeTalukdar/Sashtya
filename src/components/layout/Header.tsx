import React from 'react';
import {
  Heart,
  AlertTriangle,
  Globe,
  Wifi,
  WifiOff,
  RefreshCw,
  Bot,
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
  isDarkMode,
  onToggleDarkMode,
  syncStatus,
  onOpenEmergency,
  onOpenAssistant,
  activeTab,
  onNavigate
}) => {
  const navTabs = [
    { id: 'home', label: 'Home' },
    { id: 'preventive_care', label: 'Preventive Care' },
    { id: 'records', label: 'Records' },
    { id: 'medicines', label: 'Medicines' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'family', label: 'Family' },
    { id: 'insurance', label: 'Insurance' },
    { id: 'bills', label: 'Bills' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 cursor-pointer select-none shrink-0 group"
        >
          <Heart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
            SWASTYA
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`px-2.5 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? 'text-zinc-900 dark:text-zinc-100 font-medium bg-zinc-100 dark:bg-zinc-900'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sync Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium text-zinc-400">
            {syncStatus === 'Synced' && (
              <>
                <Wifi className="w-3 h-3 text-zinc-400" />
                <span className="hidden xl:inline">Synced</span>
              </>
            )}
            {syncStatus === 'Syncing' && (
              <>
                <RefreshCw className="w-3 h-3 text-indigo-500 animate-spin" />
                <span className="hidden xl:inline">Syncing</span>
              </>
            )}
            {syncStatus === 'Offline' && (
              <>
                <WifiOff className="w-3 h-3 text-zinc-400" />
                <span className="hidden xl:inline">Offline</span>
              </>
            )}
          </div>

          {/* Simple Mode Toggle */}
          <button
            onClick={onToggleSimpleMode}
            title={isSimpleMode ? "Standard Mode" : "Simple Mode"}
            className={`px-2 py-1 rounded-md text-xs font-medium transition-colors border ${
              isSimpleMode 
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white' 
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            {isSimpleMode ? 'Simple' : 'Simple'}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
            aria-label={isDarkMode ? "Light Mode" : "Dark Mode"}
            className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center border border-zinc-200 dark:border-zinc-800 rounded-md px-1.5 py-1 text-xs">
            <Globe className="w-3 h-3 text-zinc-400 mr-1" />
            <select
              value={currentLang}
              onChange={(e) => onLangChange(e.target.value as any)}
              className="bg-transparent text-xs text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer pr-1"
            >
              <option value="en" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">EN</option>
              <option value="hi" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">HI</option>
              <option value="bn" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">BN</option>
              <option value="or" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">OR</option>
            </select>
          </div>

          {/* Assistant Launcher Button */}
          <button
            onClick={onOpenAssistant}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>Assistant</span>
          </button>

          {/* 🚨 Clean Outlined Emergency Button */}
          <button
            onClick={onOpenEmergency}
            aria-label="Emergency Assistance"
            className="border border-red-200 dark:border-red-900/60 hover:border-red-400 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span>Emergency</span>
          </button>

        </div>

      </div>
    </header>
  );
};

export default Header;
