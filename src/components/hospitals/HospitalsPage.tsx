import React, { useState } from 'react';
import { Hospital, MapPin, PhoneCall, Navigation, Search, ShieldCheck, Bed } from 'lucide-react';
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
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Hospital className="w-8 h-8 text-[#0057B8]" />
            <span>Hospital Finder & 24x7 Emergency</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Locate empanelled hospitals, real-time ICU beds, & navigation routing.
          </p>
        </div>

        <button
          onClick={() => setFilterEmergencyOnly(!filterEmergencyOnly)}
          className={`px-4 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
            filterEmergencyOnly
              ? 'bg-[#D92D20] text-white shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span>🚨 24x7 ICU Emergency Only</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-card">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hospitals by name, specialty, or location (e.g. 'Trauma', 'SCB Medical')..."
            className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-900 outline-none focus:border-[#0057B8] focus:bg-white transition-all font-medium"
          />
        </div>
      </div>

      {/* Hospital Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHospitals.map((hosp) => (
          <div 
            key={hosp.id}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-lg">{hosp.name}</h3>
                    {hosp.isAyushmanEmpanelled && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>PM-JAY</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1">{hosp.address}</p>
                </div>

                {hosp.hasEmergencyICU && (
                  <span className="px-2.5 py-1 rounded-full bg-red-100 text-[#D92D20] text-[10px] font-black shrink-0">
                    24x7 ICU
                  </span>
                )}
              </div>

              {/* Distance & Beds */}
              <div className="flex items-center gap-4 text-xs font-extrabold text-slate-700 mt-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                <span className="text-[#0057B8]">📍 {hosp.distanceKm} km away</span>
                <span className="text-slate-500">⏱ ~{hosp.estimatedTravelTimeMinutes} mins</span>
                <span className="text-emerald-700 flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  <span>{hosp.availableBedsCount} Beds Free</span>
                </span>
              </div>

              {/* Specialty Chips */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {hosp.specialties.map((spec, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0057B8] text-[10px] font-bold">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => EmergencyService.triggerEmergencyCall(hosp.phone)}
                className="flex-1 bg-[#0057B8] hover:bg-blue-800 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Hospital ({hosp.phone})</span>
              </button>

              <a
                href={HospitalService.getDirectionsUrl(hosp.latitude, hosp.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Map Directions</span>
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
