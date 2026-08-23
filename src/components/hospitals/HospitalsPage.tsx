import React, { useState } from 'react';
import { Hospital, PhoneCall, Navigation, Search, ShieldCheck, Bed } from 'lucide-react';
import { NearbyHospital } from '../../types';
import { HospitalService } from '../../services/hospitalService';
import { EmergencyService } from '../../services/emergencyService';

export const HospitalsPage: React.FC = () => {
  const [hospitals] = useState<NearbyHospital[]>(HospitalService.getNearbyHospitals());
  const [filterEmergencyOnly, setFilterEmergencyOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHospitals = hospitals.filter(h => {
    const matchesEmergency = !filterEmergencyOnly || h.hasEmergencyICU;
    const matchesSearch = searchQuery === '' || 
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesEmergency && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
            Healthcare Facilities
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
            Nearby Hospitals
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Locate empanelled hospitals, 24x7 ICU emergency facilities, and live bed availability.
          </p>
        </div>

        <button
          onClick={() => setFilterEmergencyOnly(!filterEmergencyOnly)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors shrink-0 ${
            filterEmergencyOnly
              ? 'border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
              : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
          }`}
        >
          <span>24x7 ICU Only</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search hospitals by name, specialty, or location..."
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-400"
        />
      </div>

      {/* Hospital Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHospitals.map((hosp) => (
          <div 
            key={hosp.id}
            className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{hosp.name}</h3>
                    {hosp.isAyushmanEmpanelled && (
                      <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                        PM-JAY
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{hosp.address}</p>
                </div>

                {hosp.hasEmergencyICU && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 shrink-0">
                    24x7 ICU
                  </span>
                )}
              </div>

              {/* Distance & Beds */}
              <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400 mt-3 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60">
                <span>{hosp.distanceKm} km</span>
                <span>•</span>
                <span>~{hosp.estimatedTravelTimeMinutes} mins</span>
                <span>•</span>
                <span className="text-zinc-900 dark:text-zinc-100 font-medium flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{hosp.availableBedsCount} Beds</span>
                </span>
              </div>

              {/* Specialty Chips */}
              <div className="flex flex-wrap gap-1 mt-3">
                {hosp.specialties.map((spec, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded text-[10px] font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
              <button
                onClick={() => EmergencyService.triggerEmergencyCall(hosp.phone)}
                className="flex-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call ({hosp.phone})</span>
              </button>

              <a
                href={HospitalService.getDirectionsUrl(hosp.latitude, hosp.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-zinc-400" />
                <span>Directions</span>
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default HospitalsPage;
