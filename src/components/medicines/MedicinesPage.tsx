import React, { useState } from 'react';
import { Pill, CheckCircle2, Clock, Sparkles, AlertCircle, History } from 'lucide-react';
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
    setDoseActionMessage(`Dose logged as "${action}"`);
    setTimeout(() => setDoseActionMessage(''), 3000);
  };

  const activeMedicines = schedules.filter(s => s.status === 'Active');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
            Prescription Schedule
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
            My Medicines
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Daily dose reminders, schedule timings, and adherence logs.
          </p>
        </div>

        <button
          onClick={onOpenScanModal}
          className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Add via OCR</span>
        </button>
      </div>

      {doseActionMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{doseActionMessage}</span>
        </div>
      )}

      {/* Tab Controls: Active Medicines vs Dose History */}
      <div className="flex items-center gap-1 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'active'
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
              : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
          }`}
        >
          Active Medicines ({activeMedicines.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
              : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
          }`}
        >
          Adherence Logs
        </button>
      </div>

      {/* ACTIVE MEDICINES VIEW */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          
          {/* Safety Disclaimer */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-lg text-xs text-zinc-500 dark:text-zinc-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <div>
              <strong>Safety Guardrail:</strong> SWASTYA organizes schedules based strictly on your confirmed doctor prescriptions.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMedicines.map((med) => (
              <div 
                key={med.id}
                className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-medium text-zinc-400 uppercase">
                        {med.dosage}
                      </span>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5">{med.medicineName}</h3>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {med.specificTimes.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 bg-zinc-50 dark:bg-zinc-800/60 p-2 rounded-lg">
                    {med.instructions}
                  </p>

                  <div className="flex items-center justify-between text-xs text-zinc-400 mt-3">
                    <span>Duration: {med.durationDays} Days</span>
                    <span>Ends: {med.endDate}</span>
                  </div>
                </div>

                {/* Dose Action Buttons */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                  <button
                    onClick={() => handleLogDose(med.id, 'Taken')}
                    className="flex-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-medium text-xs py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Taken</span>
                  </button>

                  <button
                    onClick={() => handleLogDose(med.id, 'Skipped')}
                    className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-xs rounded-lg transition-colors"
                  >
                    Skipped
                  </button>

                  <button
                    onClick={() => handleLogDose(med.id, 'Snoozed')}
                    className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-xs rounded-lg transition-colors"
                  >
                    Snooze
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ADHERENCE LOGS VIEW */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Medication Adherence History</h3>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {schedules.flatMap(s => s.historyLogs.map(l => ({ ...l, medName: s.medicineName }))).map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">{log.medName}</div>
                  <span className="text-zinc-400">{log.date} at {log.time}</span>
                </div>

                <span className={`px-2 py-0.5 rounded-md font-medium text-xs ${
                  log.action === 'Taken'
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    : log.action === 'Skipped'
                    ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40'
                    : 'text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800'
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

export default MedicinesPage;
