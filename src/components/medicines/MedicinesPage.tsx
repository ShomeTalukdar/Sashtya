import React, { useState } from 'react';
import { Pill, Plus, CheckCircle2, Clock, Sparkles, AlertCircle, History } from 'lucide-react';
import { MedicationSchedule } from '../../types';
import { MedicationService } from '../../services/medicationService';

interface MedicinesPageProps {
  onOpenScanModal: () => void;
}

export const MedicinesPage: React.FC<MedicinesPageProps> = ({
  onOpenScanModal
}) => {
  const [schedules, setSchedules] = useState<MedicationSchedule[]>(MedicationService.getSchedules());
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [doseActionMessage, setDoseActionMessage] = useState<string>('');

  const handleLogDose = (medId: string, action: 'Taken' | 'Skipped' | 'Snoozed') => {
    const updated = MedicationService.logDose(medId, action);
    setSchedules(updated);
    setDoseActionMessage(`Dose logged as "${action}"!`);
    setTimeout(() => setDoseActionMessage(''), 3000);
  };

  const activeMedicines = schedules.filter(s => s.status === 'Active');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Pill className="w-8 h-8 text-[#0057B8]" />
            <span>My Medicines</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Automated medication schedule, reminders, & dose adherence history.
          </p>
        </div>

        <button
          onClick={onOpenScanModal}
          className="bg-[#0057B8] hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm px-4 py-3 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>Add via Prescription OCR</span>
        </button>
      </div>

      {doseActionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{doseActionMessage}</span>
        </div>
      )}

      {/* Tab Controls: Active Medicines vs Dose History */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'active'
              ? 'bg-[#0057B8] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Active Medicines ({activeMedicines.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'history'
              ? 'bg-[#0057B8] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Adherence Logs</span>
        </button>
      </div>

      {/* ACTIVE MEDICINES VIEW */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          
          {/* Medical Safety Disclaimer (Section 13) */}
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-xs font-semibold text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Safety Guardrail:</strong> SWASTYA organizes schedules based on your confirmed doctor prescriptions. It does not alter prescribed doses or recommend unverified medicines.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMedicines.map((med) => (
              <div 
                key={med.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0057B8] text-[11px] font-black uppercase">
                        {med.dosage}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-lg mt-1.5">{med.medicineName}</h3>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {med.specificTimes.map((t, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-xl bg-slate-100 font-extrabold text-xs text-slate-700">
                          ⏰ {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    ℹ️ {med.instructions}
                  </p>

                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mt-3">
                    <span>Duration: {med.durationDays} Days</span>
                    <span>Ends: {med.endDate}</span>
                  </div>
                </div>

                {/* Dose Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleLogDose(med.id, 'Taken')}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Taken</span>
                  </button>

                  <button
                    onClick={() => handleLogDose(med.id, 'Skipped')}
                    className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Skipped
                  </button>

                  <button
                    onClick={() => handleLogDose(med.id, 'Snoozed')}
                    className="px-3 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl transition-colors"
                  >
                    Snooze 30m
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ADHERENCE LOGS VIEW */}
      {activeTab === 'history' && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Recent Medication Adherence Logs</h3>

          <div className="space-y-3">
            {schedules.flatMap(s => s.historyLogs.map(l => ({ ...l, medName: s.medicineName }))).map((log) => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-slate-900 font-extrabold text-sm">{log.medName}</strong>
                  <span className="block text-slate-500 font-medium">{log.date} at {log.time}</span>
                </div>

                <span className={`px-3 py-1 rounded-full font-black text-xs ${
                  log.action === 'Taken'
                    ? 'bg-emerald-100 text-emerald-800'
                    : log.action === 'Skipped'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {log.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
