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
  const [card] = useState<EmergencyCard>(EmergencyService.getEmergencyCard());
  const [authorized, setAuthorized] = useState<boolean>(true);

  if (!isOpen) return null;

  const toggleAuth = () => {
    setAuthorized(!authorized);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Emergency Medical Card</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* Privacy Notice */}
          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
            <Lock className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
            <div>
              <strong>Privacy Protected:</strong> Exposes only user-authorized emergency essentials (blood group, allergies, emergency contact).
            </div>
          </div>

          {/* QR Code Container */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-950">
            <img 
              src={card.qrCodeUrl} 
              alt="Emergency QR Code" 
              className="w-40 h-40 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-white p-1"
            />
            <span className="text-[11px] text-zinc-400 mt-2">
              Scan with camera for verified emergency profile
            </span>
          </div>

          {/* Patient Card Details */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2.5 text-zinc-700 dark:text-zinc-300">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{card.fullName} ({card.age}y)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40">
                Blood: {card.bloodGroup}
              </span>
            </div>

            <div>
              <span className="text-zinc-400 block text-[11px]">Known Allergies:</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {card.allergies.map((alg, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-[10px]">
                    {alg}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-zinc-400 block text-[11px]">Emergency Contact:</span>
              <p className="font-medium text-zinc-900 dark:text-zinc-100 mt-0.5">
                {card.emergencyContact.name} ({card.emergencyContact.relationship}) — {card.emergencyContact.phone}
              </p>
            </div>

            <div>
              <span className="text-zinc-400 block text-[11px]">Critical Notes:</span>
              <p className="mt-0.5 p-2 rounded bg-zinc-50 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400">
                {card.criticalNotes}
              </p>
            </div>
          </div>

          {/* Toggle Consent Controls */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">QR Broadcast Status</span>
            </div>
            <button 
              onClick={toggleAuth}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                authorized ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'border border-zinc-200 text-zinc-400'
              }`}
            >
              {authorized ? 'Active' : 'Paused'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default EmergencyCardModal;
