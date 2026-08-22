import React, { useState } from 'react';
import { Baby, Accessibility, Heart, PhoneCall } from 'lucide-react';
import { EmergencyService } from '../../services/emergencyService';

export const SpecialCarePage: React.FC = () => {
  const [careType, setCareType] = useState<'maternal' | 'disability'>('maternal');
  const [pregnancyWeek, setPregnancyWeek] = useState(24);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Heart className="w-8 h-8 text-pink-600" />
            <span>Special Care & Vulnerable Support</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Dedicated maternal tracking, ANC schedule, & disability accessibility guidance.
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl shrink-0">
          <button
            onClick={() => setCareType('maternal')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              careType === 'maternal'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Baby className="w-4 h-4" />
            <span>Maternal / Pregnancy Care</span>
          </button>

          <button
            onClick={() => setCareType('disability')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              careType === 'disability'
                ? 'bg-[#0057B8] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Accessibility className="w-4 h-4" />
            <span>Disability Support</span>
          </button>
        </div>
      </div>

      {/* MATERNAL CARE VIEW */}
      {careType === 'maternal' && (
        <div className="space-y-6">
          
          {/* Pregnancy Tracker Banner */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase text-pink-200 tracking-wider">Maternal Journey</span>
                <h2 className="text-2xl sm:text-3xl font-black mt-0.5">Week {pregnancyWeek} — 2nd Trimester</h2>
                <p className="text-xs font-semibold text-pink-100 mt-1">
                  Expected Delivery Date (EDD): <strong>24th November 2026</strong>
                </p>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center font-black text-2xl">
                🤰
              </div>
            </div>

            <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
              <div className="bg-white h-full rounded-full transition-all" style={{ width: `${(pregnancyWeek / 40) * 100}%` }} />
            </div>
          </div>

          {/* Antenatal Care (ANC) Milestones */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Recommended ANC Checkup Timeline</h3>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 font-extrabold text-sm">1st ANC Visit (Within 12 Weeks)</strong>
                  <p className="text-slate-600 font-medium">Completed: Hemoglobin, Blood Grouping & TT Vaccination</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-700 text-white font-black">DONE</span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 font-extrabold text-sm">2nd ANC Visit (14 - 26 Weeks)</strong>
                  <p className="text-slate-600 font-medium">Scheduled: Ultrasound Anomaly Scan & Iron Folic Acid Tabs</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#0057B8] text-white font-black">UPCOMING</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 font-extrabold text-sm">3rd & 4th ANC Visits (28 - 36 Weeks)</strong>
                  <p className="text-slate-600 font-medium">Blood Pressure monitoring & Hospital Delivery planning</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-300 text-slate-700 font-bold">PLANNED</span>
              </div>
            </div>
          </div>

          {/* 102 / 108 Pregnant Women Ambulance Hotline */}
          <div className="bg-red-50 border border-red-200 p-5 rounded-3xl flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-[#D92D20] text-base">Janani Shishu Suraksha Karyakram (JSSK)</h4>
              <p className="text-xs text-slate-600 font-medium">Free ambulance transport for pregnant women & newborns</p>
            </div>
            <button 
              onClick={() => EmergencyService.triggerEmergencyCall('102')}
              className="px-4 py-2.5 rounded-xl bg-[#D92D20] text-white font-extrabold text-xs flex items-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 102 Ambulance</span>
            </button>
          </div>

        </div>
      )}

      {/* DISABILITY SUPPORT VIEW */}
      {careType === 'disability' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-3xl space-y-3">
            <h3 className="font-extrabold text-[#0057B8] text-xl flex items-center gap-2">
              <Accessibility className="w-6 h-6" />
              <span>Accessibility Assistance & UDID Card Support</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              SWASTYA includes screen-reader optimizations, voice-guided navigation, ultra-high contrast modes, and direct links to the Unique Disability ID (UDID) portal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card space-y-2">
              <h4 className="font-extrabold text-slate-900 text-base">Wheelchair Accessible Hospitals</h4>
              <p className="text-xs text-slate-500 font-medium">Verified ramps, elevator access, & specialized OPD counters.</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card space-y-2">
              <h4 className="font-extrabold text-slate-900 text-base">Voice Navigation Assistance</h4>
              <p className="text-xs text-slate-500 font-medium">Full spoken prompt support for visual or cognitive impairments.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
