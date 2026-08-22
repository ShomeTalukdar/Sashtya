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
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-700" />
            <span>Insurance Hub & Claim Tracker</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Ayushman Bharat PM-JAY policy coverage wallet & live claim status.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitClaimOpen(true)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm px-4 py-3 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>File New Claim</span>
        </button>
      </div>

      {/* POLICY DASHBOARD COVERAGE METER (SECTION 21) */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase text-emerald-200 tracking-wider">Empanelled Policy</span>
            <h2 className="text-2xl sm:text-3xl font-black">{policy.providerName}</h2>
            <p className="text-xs font-semibold text-emerald-100 mt-1">
              Policy #: <strong>{policy.policyNumber}</strong> • Holder: {policy.policyHolderName}
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-white/20 text-white text-xs font-extrabold self-start sm:self-center">
            {policy.networkHospitalsCount.toLocaleString()} Network Hospitals
          </span>
        </div>

        {/* Coverage Meter Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
            <span className="text-xs font-semibold text-emerald-200 block">Total Annual Coverage</span>
            <span className="text-2xl font-black">₹{policy.totalCoverageAmount.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
            <span className="text-xs font-semibold text-emerald-200 block">Used Amount</span>
            <span className="text-2xl font-black text-amber-300">₹{policy.usedAmount.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
            <span className="text-xs font-semibold text-emerald-200 block">Remaining Balance</span>
            <span className="text-2xl font-black text-emerald-300">₹{policy.remainingAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* CLAIM STATUS WORKFLOW TRACKER (SECTION 22) */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
          Active Insurance Claims ({policy.claims.length})
        </h3>

        <div className="space-y-4">
          {policy.claims.map((claim) => (
            <div 
              key={claim.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-extrabold uppercase text-slate-400">Claim #{claim.claimNumber}</span>
                  <h4 className="font-extrabold text-slate-900 text-lg">{claim.treatmentName}</h4>
                  <p className="text-xs text-slate-600 font-medium">{claim.hospitalName} • Submitted {claim.dateSubmitted}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-500 block">Claim Amount</span>
                  <span className="text-xl font-black text-[#0057B8]">₹{claim.amountClaimed.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Visual Step Indicator (Section 22) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 block">Claim Progress Stage:</span>
                <div className="grid grid-cols-6 gap-1 sm:gap-2">
                  {steps.map((stepName, index) => {
                    const isPassed = index + 1 <= claim.statusStep;
                    const isCurrent = index + 1 === claim.statusStep;
                    return (
                      <div key={index} className="flex flex-col items-center gap-1 text-center">
                        <div className={`w-full h-2 rounded-full transition-all ${
                          isPassed ? 'bg-emerald-600' : 'bg-slate-200'
                        }`} />
                        <span className={`text-[10px] font-extrabold line-clamp-1 ${
                          isCurrent ? 'text-emerald-700' : isPassed ? 'text-slate-800' : 'text-slate-400'
                        }`}>
                          {stepName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {claim.remarks && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700">
                  <strong>Status Remark:</strong> {claim.remarks}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FILE NEW CLAIM MODAL */}
      {isSubmitClaimOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleClaimSubmit} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900">File Cashless / Reimbursement Claim</h3>
              <button type="button" onClick={() => setIsSubmitClaimOpen(false)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Empanelled Hospital</label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Treatment / Procedure</label>
                <input
                  type="text"
                  value={treatmentName}
                  onChange={(e) => setTreatmentName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Claim Amount (₹)</label>
                <input
                  type="number"
                  value={amountClaimed}
                  onChange={(e) => setAmountClaimed(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none font-semibold text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSubmitClaimOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md"
              >
                Submit Claim
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
