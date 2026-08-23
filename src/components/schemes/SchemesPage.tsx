import React, { useState } from 'react';
import { Award, CheckCircle2, ExternalLink, ChevronRight } from 'lucide-react';
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
        setEligibilityResult(`✓ You are eligible for ${selectedScheme.schemeName}.`);
      } else {
        setEligibilityResult(`⚠️ Annual income exceeds nominal threshold for ${selectedScheme.schemeName}, but state specific exemptions may apply.`);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
            Government Programs
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
            Healthcare Benefits & Schemes
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Ayushman Bharat PM-JAY, Jan Aushadhi Pariyojana, and state health benefits.
          </p>
        </div>
      </div>

      {/* Grid of Scheme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {schemes.map((sch) => (
          <div 
            key={sch.id}
            onClick={() => {
              setSelectedScheme(sch);
              setEligibilityResult(null);
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-colors space-y-2 ${
              selectedScheme?.id === sch.id
                ? 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-900 dark:border-zinc-100 shadow-xs'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            <span className="text-[10px] font-medium text-zinc-400 uppercase">
              {sch.category}
            </span>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{sch.schemeName}</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{sch.shortDescription}</p>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-medium text-indigo-600 dark:text-indigo-400">
              <span>View details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Selected Scheme Details & Eligibility Checker */}
      {selectedScheme && (
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div>
              <span className="text-[11px] font-medium text-zinc-400 uppercase">{selectedScheme.category}</span>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">{selectedScheme.schemeName}</h2>
            </div>

            <a
              href={selectedScheme.officialPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-xs flex items-center gap-1.5 transition-colors self-start sm:self-center"
            >
              <span>Official Portal</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>
          </div>

          {/* Key Benefits List */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Key Benefits</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {selectedScheme.keyBenefits.map((ben, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>{ben}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility Checker */}
          <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Eligibility Checker</h4>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2 text-xs text-zinc-400">₹</span>
                <input
                  type="number"
                  value={incomeInput}
                  onChange={(e) => setIncomeInput(parseFloat(e.target.value) || 0)}
                  placeholder="Annual Family Income"
                  className="w-full pl-6 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 outline-none"
                />
              </div>
              <button
                onClick={handleCheckEligibility}
                className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium px-3.5 py-1.5 rounded-md transition-colors"
              >
                Check Eligibility
              </button>
            </div>

            {eligibilityResult && (
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 font-medium">
                {eligibilityResult}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default SchemesPage;
