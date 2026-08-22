import React, { useState } from 'react';
import { X, ShieldCheck, QrCode, Lock, CheckCircle2 } from 'lucide-react';
import { EmergencyCard } from '../../types';
import { EmergencyService } from '../../services/emergencyService';

interface EmergencyCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyCardModal: React.FC<EmergencyCardModalProps> = ({
  isOpen,
  onClose
}) => {
  const [card, setCard] = useState<EmergencyCard>(EmergencyService.getEmergencyCard());
  const [authorized, setAuthorized] = useState<boolean>(true);

  if (!isOpen) return null;

  const toggleAuth = () => {
    setAuthorized(!authorized);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-[#0057B8] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-white" />
            <div>
              <h3 className="font-extrabold text-lg">EMERGENCY MEDICAL CARD</h3>
              <p className="text-xs font-medium text-white/80">Authorized Restricted Emergency Profile</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Privacy Notice Alert */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-start gap-2.5">
            <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Restricted Privacy Protected:</strong> This QR card exposes ONLY user-authorized emergency information (Blood group, allergies, contact). Full medical records remain private.
            </div>
          </div>

          {/* QR Code Container */}
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-5 flex flex-col items-center justify-center text-center">
            <img 
              src={card.qrCodeUrl} 
              alt="Emergency QR Code" 
              className="w-48 h-48 rounded-xl shadow-md border border-slate-200 bg-white p-2"
            />
            <span className="text-[11px] font-bold text-slate-500 mt-2">
              Scan with any phone camera or QR reader for emergency access
            </span>
          </div>

          {/* Patient Card Details */}
          <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs text-slate-800">
            <div className="flex items-center justify-between font-extrabold text-sm text-[#0057B8] pb-2 border-b border-slate-200">
              <span>{card.fullName} ({card.age} yrs)</span>
              <span className="px-2.5 py-1 rounded-full bg-[#D92D20] text-white text-xs">
                BLOOD: {card.bloodGroup}
              </span>
            </div>

            <div>
              <strong className="text-slate-600">Known Allergies:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {card.allergies.map((alg, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 font-extrabold text-[11px]">
                    ⚠️ {alg}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <strong className="text-slate-600">Emergency Contact:</strong>
              <p className="font-extrabold text-slate-900 mt-0.5">
                {card.emergencyContact.name} ({card.emergencyContact.relationship}) — {card.emergencyContact.phone}
              </p>
            </div>

            <div>
              <strong className="text-slate-600">Critical Emergency Notes:</strong>
              <p className="font-medium text-slate-800 mt-0.5 bg-white p-2 rounded-lg border border-slate-200">
                {card.criticalNotes}
              </p>
            </div>
          </div>

          {/* Toggle Consent Controls */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">Emergency QR Active</span>
            </div>
            <button 
              onClick={toggleAuth}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-colors ${
                authorized ? 'bg-emerald-700 text-white' : 'bg-slate-400 text-white'
              }`}
            >
              {authorized ? 'Authorized' : 'Paused'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
