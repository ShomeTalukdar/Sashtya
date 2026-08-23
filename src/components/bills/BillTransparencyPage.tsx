import React, { useState } from 'react';
import { Receipt, AlertTriangle, CheckCircle2, HelpCircle, Calculator } from 'lucide-react';
import { MedicalBill } from '../../types';
import { BillService } from '../../services/billService';

export const BillTransparencyPage: React.FC = () => {
  const [bill, setBill] = useState<MedicalBill>(BillService.getMedicalBill());

  const handleRunAudit = () => {
    const audited = BillService.auditBill(bill);
    setBill(audited);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
            Line-Item Auditing
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
            Medical Bill Transparency
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Verify hospital bills, review line-item calculations, and detect potential duplicate charges.
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          className="border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
        >
          <Calculator className="w-3.5 h-3.5 text-zinc-400" />
          <span>Verify Calculation</span>
        </button>
      </div>

      {/* Guidance Box */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-lg text-xs text-zinc-500 dark:text-zinc-400 flex items-start gap-2">
        <HelpCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
        <div>
          <strong>Verification Guidance:</strong> SWASTYA verifies line items and highlights potential calculation questions for patient review.
        </div>
      </div>

      {/* Bill Overview Header */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <span className="text-[11px] font-medium text-zinc-400 uppercase">Hospital Bill Audit</span>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">{bill.hospitalName}</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Bill Date: {bill.billDate} • Patient: {bill.patientName}</p>
          </div>

          <div className="flex items-center gap-2">
            {bill.discrepanciesCount > 0 ? (
              <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-zinc-500" />
                <span>{bill.discrepanciesCount} Item Flagged</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-md text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-xs font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Totals Match</span>
              </span>
            )}
          </div>
        </div>

        {/* Itemized Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-zinc-400 font-medium uppercase border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Cost</th>
                <th className="py-2.5 px-3 text-right">Billed Amount</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
              {bill.items.map((item) => (
                <tr key={item.id} className={item.requiresVerification ? 'bg-zinc-50 dark:bg-zinc-800/40' : ''}>
                  <td className="py-3 px-3">
                    <strong className="font-semibold text-zinc-900 dark:text-zinc-100 block">{item.chargeName}</strong>
                    {item.flaggedIssue && (
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                        {item.flaggedIssue}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center font-medium">{item.quantity}</td>
                  <td className="py-3 px-3 text-right text-zinc-500">₹{item.unitCost.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">₹{item.totalCost.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-center">
                    {item.requiresVerification ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                        Check Needed
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40">
                        Verified
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
          <div>
            <span className="text-xs text-zinc-400 block">Calculated Mathematical Total</span>
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">₹{bill.calculatedGrandTotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="sm:text-right">
            <span className="text-xs text-zinc-400 block">Billed Grand Total</span>
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">₹{bill.billedGrandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default BillTransparencyPage;
