import React, { useState } from 'react';
import { Award, CheckCircle2, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';
import { HealthcareScheme } from '../../types';
import { SchemeService } from '../../services/schemeService';

export const SchemesPage: React.FC = () => {
  const [schemes] = useState<HealthcareScheme[]>(SchemeService.getSchemes());
  const [selectedScheme, setSelectedScheme] = useState<HealthcareScheme | null>(schemes[0]);
  const [incomeInput, setIncomeInput] = useState(180000);
  const [eligibilityResult, setEligibilityResult] = useState<string | null>(null);

  const handleCheckEligibility = () => {
    if (selectedScheme) {
      const isEligible = incomeInput <= selectedScheme.maxIncomeCriteria;
      if (isEligible) {
        setEligibilityResult(`✅ You are ELIGIBLE for ${selectedScheme.schemeName}!`);
      } else {
        setEligibilityResult(`⚠️ Annual income exceeds nominal threshold for ${selectedScheme.schemeName}, but state specific exemptions may apply.`);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-8 h-8 text-[#0057B8]" />
            <span>Government Healthcare Benefits</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Ayushman Bharat PM-JAY, Pradhan Mantri Jan Aushadhi Pariyojana, & BSKY.
          </p>
        </div>
      </div>

      {/* Grid of Scheme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {schemes.map((sch) => (
          <div 
            key={sch.id}
            onClick={() => {
              setSelectedScheme(sch);
              setEligibilityResult(null);
            }}
            className={`p-5 rounded-3xl border cursor-pointer transition-all ${
              selectedScheme?.id === sch.id
                ? 'bg-blue-50/60 border-2 border-[#0057B8] shadow-md'
                : 'bg-white border-slate-200 shadow-card hover:border-blue-300'
            }`}
          >
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0057B8] text-[10px] font-black uppercase">
              {sch.category}
            </span>
            <h3 className="font-extrabold text-slate-900 text-lg mt-2">{sch.schemeName}</h3>
            <p className="text-xs text-slate-600 font-medium mt-1 line-clamp-2">{sch.shortDescription}</p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0057B8]">
              <span>Check Eligibility</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Selected Scheme Details & Eligibility Checker */}
      {selectedScheme && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-[#0057B8] uppercase">{selectedScheme.category}</span>
              <h2 className="text-2xl font-black text-slate-900">{selectedScheme.schemeName}</h2>
            </div>

            <a
              href={selectedScheme.officialPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#0057B8] text-white font-extrabold text-xs flex items-center gap-1.5 self-start sm:self-center"
            >
              <span>Official Government Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Key Benefits List */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Key Benefits</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {selectedScheme.keyBenefits.map((ben, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2 font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{ben}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Income Eligibility Calculator */}
          <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Instant Eligibility Check
            </h4>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full text-xs">
                <label className="font-bold text-slate-700 block mb-1">Enter Annual Household Income (₹)</label>
                <input
                  type="number"
                  value={incomeInput}
                  onChange={(e) => setIncomeInput(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold outline-none text-slate-900"
                />
              </div>

              <button
                onClick={handleCheckEligibility}
                className="w-full sm:w-auto bg-[#0057B8] hover:bg-blue-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs self-end mt-2 sm:mt-0"
              >
                Check Eligibility
              </button>
            </div>

            {eligibilityResult && (
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800">
                {eligibilityResult}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
