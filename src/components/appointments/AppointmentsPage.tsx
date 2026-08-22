import React, { useState } from 'react';
import { Calendar, Clock, Plus, CheckCircle2, CalendarCheck, X } from 'lucide-react';
import { Appointment } from '../../types';
import { AppointmentService } from '../../services/appointmentService';

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(AppointmentService.getAppointments());
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

  // Form states for booking
  const [doctorName, setDoctorName] = useState('Dr. Ananya Sen');
  const [specialty, setSpecialty] = useState('Cardiologist');
  const [hospitalClinic, setHospitalClinic] = useState('SCB Medical College OP Clinic');
  const [appointmentDate, setAppointmentDate] = useState('2026-08-25');
  const [appointmentTime, setAppointmentTime] = useState('10:30 AM');
  const [purpose, setPurpose] = useState('General Cardiac Checkup');

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newApp = AppointmentService.bookAppointment({
      doctorName,
      specialty,
      hospitalClinic,
      appointmentDate,
      appointmentTime,
      purpose,
      syncedToGoogleCalendar: false
    });
    setAppointments([newApp, ...appointments]);
    setIsBookModalOpen(false);
  };

  const handleSyncCalendar = (id: string) => {
    AppointmentService.syncToGoogleCalendar(id);
    setAppointments(AppointmentService.getAppointments());
    setSyncStatusMsg('Synced appointment to Google Calendar!');
    setTimeout(() => setSyncStatusMsg(''), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-8 h-8 text-[#0057B8]" />
            <span>Doctor Appointments & Queue</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Book visits, track real-time queue position, and sync calendar reminders.
          </p>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="bg-[#0057B8] hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm px-4 py-3 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {syncStatusMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncStatusMsg}</span>
        </div>
      )}

      {/* LIVE QUEUE MANAGEMENT WIDGET (SECTION 17) */}
      {appointments.length > 0 && appointments[0].queuePosition && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 p-6 rounded-3xl shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500 text-white font-black text-xl">
                #{appointments[0].queuePosition}
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase text-amber-800">
                  LIVE OPD QUEUE STATUS ({appointments[0].doctorName})
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg">Your turn is approaching!</h3>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-amber-200 shadow-2xs text-xs font-extrabold">
              <div>
                <span className="block text-slate-400 font-medium">Currently Serving</span>
                <span className="text-amber-900 font-black">#{appointments[0].currentlyServing}</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="block text-slate-400 font-medium">Est. Wait</span>
                <span className="text-[#0057B8] font-black">~{appointments[0].estimatedWaitMinutes} mins</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APPOINTMENTS LIST */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
          Upcoming Appointments
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((app) => (
            <div 
              key={app.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card hover:shadow-cardHover transition-all space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase">
                      {app.specialty}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-lg mt-1">{app.doctorName}</h3>
                    <p className="text-xs text-slate-600 font-medium">{app.hospitalClinic}</p>
                  </div>

                  <div className="text-right">
                    <span className="block text-xs font-black text-[#0057B8]">{app.appointmentDate}</span>
                    <span className="text-xs text-slate-500 font-bold">{app.appointmentTime}</span>
                  </div>
                </div>

                <div className="mt-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs font-medium text-slate-700">
                  <strong>Purpose:</strong> {app.purpose}
                </div>

                {/* Follow-up care plan checklist (Section 18) */}
                {app.followUpTasks && app.followUpTasks.length > 0 && (
                  <div className="mt-3 p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs space-y-1">
                    <strong className="text-[#0057B8] font-extrabold block">CARE PLAN & PRE-VISIT TASKS:</strong>
                    {app.followUpTasks.map((task, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleSyncCalendar(app.id)}
                  disabled={app.syncedToGoogleCalendar}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
                    app.syncedToGoogleCalendar
                      ? 'bg-slate-100 text-slate-500 cursor-default'
                      : 'bg-[#EAF3FF] hover:bg-blue-100 text-[#0057B8]'
                  }`}
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>{app.syncedToGoogleCalendar ? 'Synced to Calendar' : 'Sync Google Calendar'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOOK APPOINTMENT MODAL */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleBookAppointment} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-xl text-slate-900">Book Doctor Appointment</h3>
              <button type="button" onClick={() => setIsBookModalOpen(false)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Specialty</label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hospital / Clinic</label>
                <input
                  type="text"
                  value={hospitalClinic}
                  onChange={(e) => setHospitalClinic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none font-semibold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none font-semibold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time</label>
                  <input
                    type="text"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none font-semibold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Visit Purpose</label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none font-semibold text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBookModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#0057B8] hover:bg-blue-800 text-white font-extrabold text-xs shadow-md"
              >
                Confirm Appointment
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
