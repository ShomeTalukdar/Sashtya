import React, { useState } from 'react';
import { Baby, Accessibility, Heart, PhoneCall } from 'lucide-react';
import { EmergencyService } from '../../services/emergencyService';

export const SpecialCarePage: React.FC = () => {
  const [careType, setCareType] = useState<'maternal' | 'disability'>('maternal');
  const [pregnancyWeek] = useState(24);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
            Specialized Care
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
            Special Care & Support
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Maternal checkup timeline, antenatal care tracking, and disability accessibility.
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 bg-zinc-50 dark:bg-zinc-900 shrink-0">
          <button
            onClick={() => setCareType('maternal')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              careType === 'maternal'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
            }`}
          >
            Maternal Care
          </button>

          <button
            onClick={() => setCareType('disability')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              careType === 'disability'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
            }`}
          >
            Disability Support
          </button>
        </div>
      </div>

      {/* MATERNAL CARE VIEW */}
      {careType === 'maternal' && (
        <div className="space-y-6">
          
          {/* Pregnancy Tracker Card */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">Maternal Journey</span>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">Week {pregnancyWeek} — 2nd Trimester</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Expected Delivery Date (EDD): 24th November 2026
                </p>
              </div>

              <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-lg">
                🤰
              </div>
            </div>

            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-zinc-900 dark:bg-zinc-100 h-full rounded-full transition-all" style={{ width: `${(pregnancyWeek / 40) * 100}%` }} />
            </div>
          </div>

          {/* Antenatal Care (ANC) Milestones */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">ANC Checkup Timeline</h3>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100 block">1st ANC Visit (Within 12 Weeks)</strong>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">Hemoglobin, Blood Grouping & TT Vaccination</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40">DONE</span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100 block">2nd ANC Visit (14 - 26 Weeks)</strong>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">Ultrasound Anomaly Scan & Iron Folic Acid Tabs</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40">UPCOMING</span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100 block">3rd & 4th ANC Visits (28 - 36 Weeks)</strong>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">BP monitoring & Hospital Delivery planning</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800">PLANNED</span>
              </div>
            </div>
          </div>

          {/* 102 Pregnant Women Ambulance Callout */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl flex items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Janani Shishu Suraksha (JSSK)</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Free ambulance transport for pregnant mothers & newborns</p>
            </div>
            <button 
              onClick={() => EmergencyService.triggerEmergencyCall('102')}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-medium text-xs flex items-center gap-1.5 transition-colors shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 102</span>
            </button>
          </div>

        </div>
      )}

      {/* DISABILITY SUPPORT VIEW */}
      {careType === 'disability' && (
        <div className="space-y-4">
          <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-xl space-y-2">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm flex items-center gap-2">
              <Accessibility className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <span>Accessibility Assistance & UDID Support</span>
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              SWASTYA includes screen-reader optimizations, voice-guided navigation, high contrast modes, and links to the Unique Disability ID (UDID) portal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Wheelchair Accessible Hospitals</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Verified ramps, elevator access, and specialized OPD counters.</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Voice Navigation Assistance</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Full spoken prompt support for visual or cognitive accessibility.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SpecialCarePage;
