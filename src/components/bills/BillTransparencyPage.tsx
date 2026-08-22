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
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-8 h-8 text-amber-700" />
            <span>Medical Bill Transparency</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Upload hospital bills to independently verify line items & calculate total charges.
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          className="bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-xs sm:text-sm px-4 py-3 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
        >
          <Calculator className="w-4 h-4" />
          <span>Re-verify Bill Calculations</span>
        </button>
      </div>

      {/* Respectful Guidance Disclaimer (Section 23) */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-3xl text-xs font-semibold text-amber-900 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong>Tone & Language Principle (Section 23):</strong> SWASTYA uses respectful verification language (e.g. <em>"This charge may require verification"</em>) rather than accusing healthcare providers.
        </div>
      </div>

      {/* Bill Overview Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase">Hospital Bill Transparency Audit</span>
            <h2 className="text-2xl font-black text-slate-900">{bill.hospitalName}</h2>
            <p className="text-xs text-slate-500 font-medium">Bill Date: {bill.billDate} • Patient: {bill.patientName}</p>
          </div>

          <div className="flex items-center gap-2">
            {bill.discrepanciesCount > 0 ? (
              <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>{bill.discrepanciesCount} Line Flagged for Verification</span>
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Totals Match Calculated Rate</span>
              </span>
            )}
          </div>
        </div>

        {/* Itemized Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase border-y border-slate-200">
              <tr>
                <th className="py-3 px-3">Item Description</th>
                <th className="py-3 px-3 text-center">Qty</th>
                <th className="py-3 px-3 text-right">Unit Cost</th>
                <th className="py-3 px-3 text-right">Billed Amount</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {bill.items.map((item) => (
                <tr key={item.id} className={item.requiresVerification ? 'bg-amber-50/60' : ''}>
                  <td className="py-3 px-3">
                    <strong className="font-extrabold text-slate-900 block">{item.chargeName}</strong>
                    {item.flaggedIssue && (
                      <span className="text-[11px] text-amber-800 font-bold block mt-1">
                        ⚠️ {item.flaggedIssue}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center font-bold">{item.quantity}</td>
                  <td className="py-3 px-3 text-right">₹{item.unitCost.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right font-black">₹{item.totalCost.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-center">
                    {item.requiresVerification ? (
                      <span className="px-2.5 py-1 rounded-md bg-amber-200 text-amber-900 text-[10px] font-black">
                        Requires Verification
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
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
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Calculated Mathematical Total</span>
            <span className="text-2xl font-black text-slate-900">₹{bill.calculatedGrandTotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500 block">Billed Grand Total</span>
            <span className="text-2xl font-black text-amber-900">₹{bill.billedGrandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
