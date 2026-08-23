import React, { useState } from 'react';
import { ShieldCheck, Plus, X } from 'lucide-react';
import { InsurancePolicy } from '../../types';
import { InsuranceService } from '../../services/insuranceService';

export const InsurancePage: React.FC = () => {
  const [policy, setPolicy] = useState<InsurancePolicy>(InsuranceService.getPolicy());
  const [isSubmitClaimOpen, setIsSubmitClaimOpen] = useState(false);
  const [hospitalName, setHospitalName] = useState('Sun Hospital & Diagnostics');
  const [treatmentName, setTreatmentName] = useState('Diagnostic Scans & Lab Investigations');
  const [amountClaimed, setAmountClaimed] = useState(14500);

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    InsuranceService.submitClaim({ hospitalName, treatmentName, amountClaimed });
    setPolicy(InsuranceService.getPolicy());
    setIsSubmitClaimOpen(false);
  };

  const steps = ['Created', 'Uploaded', 'Verified', 'Submitted', 'Under Review', 'Approved'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
            Coverage & Claims
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
            Insurance Hub
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Ayushman Bharat PM-JAY policy wallet and cashless claim tracker.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitClaimOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>File Claim</span>
        </button>
      </div>

      {/* Policy Dashboard Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">Empanelled Policy</span>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">{policy.providerName}</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Policy #{policy.policyNumber} • Holder: {policy.policyHolderName}
            </p>
          </div>
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-md px-2.5 py-1">
            {policy.networkHospitalsCount.toLocaleString()} Network Hospitals
          </span>
        </div>

        {/* Coverage Meter Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40">
            <span className="text-xs text-zinc-400 block">Total Coverage</span>
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">₹{policy.totalCoverageAmount.toLocaleString('en-IN')}</span>
          </div>

          <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40">
            <span className="text-xs text-zinc-400 block">Used Amount</span>
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">₹{policy.usedAmount.toLocaleString('en-IN')}</span>
          </div>

          <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40">
            <span className="text-xs text-zinc-400 block">Remaining Balance</span>
            <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 block">₹{policy.remainingAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Claim Status Workflow Tracker */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
          Active Claims ({policy.claims.length})
        </h3>

        <div className="space-y-3">
          {policy.claims.map((claim) => (
            <div 
              key={claim.id}
              className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div>
                  <span className="text-[11px] font-medium text-zinc-400 uppercase">Claim #{claim.claimNumber}</span>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5">{claim.treatmentName}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{claim.hospitalName} • Submitted {claim.dateSubmitted}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 uppercase block">Amount</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">₹{claim.amountClaimed.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Progress Stage */}
              <div className="space-y-1.5">
                <span className="text-xs text-zinc-400 block">Progress Stage:</span>
                <div className="grid grid-cols-6 gap-1">
                  {steps.map((stepName, index) => {
                    const isPassed = index + 1 <= claim.statusStep;
                    const isCurrent = index + 1 === claim.statusStep;
                    return (
                      <div key={index} className="flex flex-col items-center gap-1 text-center">
                        <div className={`w-full h-1 rounded-full ${
                          isPassed ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-800'
                        }`} />
                        <span className={`text-[10px] ${
                          isCurrent ? 'text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-400'
                        }`}>
                          {stepName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {claim.remarks && (
                <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-400">
                  <strong>Remark:</strong> {claim.remarks}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* File Claim Modal */}
      {isSubmitClaimOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleClaimSubmit} className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">File Insurance Claim</h3>
              <button type="button" onClick={() => setIsSubmitClaimOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Empanelled Hospital</label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Treatment / Procedure</label>
                <input
                  type="text"
                  value={treatmentName}
                  onChange={(e) => setTreatmentName(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Claim Amount (₹)</label>
                <input
                  type="number"
                  value={amountClaimed}
                  onChange={(e) => setAmountClaimed(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsSubmitClaimOpen(false)}
                className="px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default InsurancePage;
