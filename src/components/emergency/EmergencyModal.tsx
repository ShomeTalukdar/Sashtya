import React, { useState, useEffect } from 'react';
import { 
  X, 
  PhoneCall, 
  UserCheck, 
  MapPin, 
  QrCode, 
  Hospital, 
  AlertTriangle,
  Share2,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { EmergencyService } from '../../services/emergencyService';
import { HospitalService } from '../../services/hospitalService';
import { NearbyHospital } from '../../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCard: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onOpenCard
}) => {
  const [hospitals, setHospitals] = useState<NearbyHospital[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
  const [locationSharingStatus, setLocationSharingStatus] = useState<string>('');
  const emergencyCard = EmergencyService.getEmergencyCard();

  useEffect(() => {
    if (isOpen) {
      setHospitals(HospitalService.getNearbyHospitals(true));
      EmergencyService.getCurrentLocation().then(loc => setLocation(loc));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleShareLocation = () => {
    if (location) {
      const text = `EMERGENCY: Located at ${location.address} (GPS: ${location.latitude}, ${location.longitude}). Blood Group: ${emergencyCard.bloodGroup}. Emergency Contact: ${emergencyCard.emergencyContact.phone}`;
      if (navigator.share) {
        navigator.share({ title: 'Emergency Location', text });
      } else {
        navigator.clipboard.writeText(text);
        setLocationSharingStatus('Emergency location copied to clipboard');
        setTimeout(() => setLocationSharingStatus(''), 3000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-xl w-full border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
        
        {/* Clean Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Emergency Assistance</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          
          {/* Quick Call Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Call 108 Ambulance */}
            <button
              onClick={() => EmergencyService.triggerEmergencyCall('108')}
              className="border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <span className="text-[10px] font-medium uppercase text-red-700/70 dark:text-red-400/70 block">National Hotline</span>
                <h3 className="text-sm font-semibold">Call 108 Ambulance</h3>
              </div>
            </button>

            {/* Call Emergency Contact */}
            <button
              onClick={() => EmergencyService.triggerEmergencyCall(emergencyCard.emergencyContact.phone)}
              className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 p-4 rounded-xl flex items-center gap-3 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
              </div>
              <div>
                <span className="text-[10px] font-medium text-zinc-400 uppercase block">
                  {emergencyCard.emergencyContact.name} ({emergencyCard.emergencyContact.relationship})
                </span>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{emergencyCard.emergencyContact.phone}</h3>
              </div>
            </button>

          </div>

          {/* Emergency Medical Card & Share Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={onOpenCard}
              className="border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 p-3 rounded-lg flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300 transition-colors text-left"
            >
              <QrCode className="w-4 h-4 text-zinc-400 shrink-0" />
              <div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">Emergency Medical Card</div>
                <div className="text-[11px] text-zinc-400">View allergies & QR code</div>
              </div>
            </button>

            <button
              onClick={handleShareLocation}
              className="border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 p-3 rounded-lg flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300 transition-colors text-left"
            >
              <Share2 className="w-4 h-4 text-zinc-400 shrink-0" />
              <div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">Share GPS Location</div>
                <div className="text-[11px] text-zinc-400">Broadcast coordinates</div>
              </div>
            </button>
          </div>

          {locationSharingStatus && (
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{locationSharingStatus}</span>
            </div>
          )}

          {location && (
            <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 flex items-center gap-2 text-zinc-600 dark:text-zinc-400 text-xs">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span><strong>Location:</strong> {location.address}</span>
            </div>
          )}

          {/* Nearest Emergency Hospitals */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
              Nearby ICU Facilities ({hospitals.length})
            </h4>

            <div className="space-y-2">
              {hospitals.map(hosp => (
                <div key={hosp.id} className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">{hosp.name}</h5>
                      <span className="text-[10px] text-red-600 dark:text-red-400">24x7 ICU</span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{hosp.address}</p>
                    <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                      <span>{hosp.distanceKm} km</span>
                      <span>•</span>
                      <span>~{hosp.estimatedTravelTimeMinutes} mins</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => EmergencyService.triggerEmergencyCall(hosp.phone)}
                      className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium flex items-center gap-1"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>Call</span>
                    </button>
                    <a
                      href={HospitalService.getDirectionsUrl(hosp.latitude, hosp.longitude)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 text-zinc-700 dark:text-zinc-300 text-xs font-medium flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3 text-zinc-400" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default EmergencyModal;
