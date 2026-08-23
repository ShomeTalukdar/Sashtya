import React, { useState } from 'react';
import { Calendar, Clock, Plus, CheckCircle2, CalendarCheck, X } from 'lucide-react';
import { Appointment } from '../../types';
import { AppointmentService } from '../../services/appointmentService';

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(AppointmentService.getAppointments());
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

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
    setSyncStatusMsg('Synced appointment to Google Calendar');
    setTimeout(() => setSyncStatusMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
            Clinic Visits & OPD
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
            Doctor Appointments
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage scheduled consultations, OPD queue tokens, and follow-up plans.
          </p>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Book Appointment</span>
        </button>
      </div>

      {syncStatusMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncStatusMsg}</span>
        </div>
      )}

      {/* Live Queue Box */}
      {appointments.length > 0 && appointments[0].queuePosition && (
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold flex items-center justify-center text-sm shrink-0">
              #{appointments[0].queuePosition}
            </div>
            <div>
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">
                Live OPD Queue ({appointments[0].doctorName})
              </span>
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5">
                Token #{appointments[0].queuePosition} • Turn Approaching
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-zinc-600 dark:text-zinc-300">
            <div>
              <span className="block text-[10px] text-zinc-400 uppercase">Serving</span>
              <span>#{appointments[0].currentlyServing}</span>
            </div>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div>
              <span className="block text-[10px] text-zinc-400 uppercase">Est. Wait</span>
              <span>~{appointments[0].estimatedWaitMinutes} mins</span>
            </div>
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div className="space-y-3">
        <h2 className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
          Upcoming Schedule
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((app) => (
            <div 
              key={app.id}
              className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-medium text-zinc-400 uppercase">
                      {app.specialty}
                    </span>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5">{app.doctorName}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{app.hospitalClinic}</p>
                  </div>

                  <div className="text-right">
                    <span className="block text-xs font-medium text-zinc-900 dark:text-zinc-100">{app.appointmentDate}</span>
                    <span className="text-xs text-zinc-400">{app.appointmentTime}</span>
                  </div>
                </div>

                <div className="mt-3 bg-zinc-50 dark:bg-zinc-800/60 p-2.5 rounded-lg text-xs text-zinc-600 dark:text-zinc-300">
                  <strong className="text-zinc-800 dark:text-zinc-200">Purpose:</strong> {app.purpose}
                </div>

                {app.followUpTasks && app.followUpTasks.length > 0 && (
                  <div className="mt-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs space-y-1.5">
                    <span className="text-[11px] font-medium text-zinc-400 uppercase block">Pre-Visit Tasks:</span>
                    {app.followUpTasks.map((task, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <button
                  onClick={() => handleSyncCalendar(app.id)}
                  disabled={app.syncedToGoogleCalendar}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    app.syncedToGoogleCalendar
                      ? 'text-zinc-400 cursor-default'
                      : 'border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{app.syncedToGoogleCalendar ? 'Synced to Calendar' : 'Sync Calendar'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Book Appointment Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleBookAppointment} className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Book Doctor Appointment</h3>
              <button type="button" onClick={() => setIsBookModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Specialty</label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Hospital / Clinic</label>
                <input
                  type="text"
                  value={hospitalClinic}
                  onChange={(e) => setHospitalClinic(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Date</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Time</label>
                  <input
                    type="text"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Purpose</label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={2}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsBookModalOpen(false)}
                className="px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default AppointmentsPage;
