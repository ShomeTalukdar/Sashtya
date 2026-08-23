import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Plus,
  Search,
  Volume2,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  FileText,
  X,
  ArrowRight,
  Stethoscope,
  Syringe,
  Eye,
  RefreshCw,
  Zap,
  Check,
  Building2,
  Info,
  Bell,
  CalendarClock,
  Activity
} from 'lucide-react';
import {
  PreventiveCareActivity,
  PreventiveCareLifecycleStage,
  PreventiveCareCategory,
  PreventiveCareStatus
} from '../types';
import {
  PreventiveCareService,
  PREVENTIVE_LIFECYCLE_STAGES,
  CATEGORY_DETAILS
} from '../services/preventiveCareService';

interface PreventiveCareProps {
  currentLang?: 'en' | 'hi' | 'bn' | 'or';
  onNavigate?: (tab: string) => void;
  onOpenEmergency?: () => void;
}

export const Preventive_Care: React.FC<PreventiveCareProps> = ({
  currentLang = 'en',
  onNavigate,
  onOpenEmergency
}) => {
  const [viewRole, setViewRole] = useState<'patient' | 'asha_worker'>('patient');
  const [activeTab, setActiveTab] = useState<'timeline' | 'calendar' | 'recommendations'>('timeline');

  const [statusFilter, setStatusFilter] = useState<'all' | PreventiveCareStatus | 'care_gaps'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | PreventiveCareCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [calYear, setCalYear] = useState<number>(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState<number>(new Date().getMonth() + 1);

  const [activities, setActivities] = useState<PreventiveCareActivity[]>([]);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const [selectedActivity, setSelectedActivity] = useState<PreventiveCareActivity | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState<boolean>(false);
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState<boolean>(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<{ date: string; items: PreventiveCareActivity[] } | null>(null);

  const [bookingClinic, setBookingClinic] = useState<string>('SCB Medical College OP Clinic');
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('10:00 AM');
  const [bookingPriority, setBookingPriority] = useState<string>('Regular');

  const [targetStage, setTargetStage] = useState<PreventiveCareLifecycleStage>('visit_completed');
  const [advanceNotes, setAdvanceNotes] = useState<string>('');
  const [advanceRecordTitle, setAdvanceRecordTitle] = useState<string>('');

  const [recPatient, setRecPatient] = useState<{ id: string; name: string; age: number; village: string; phone: string }>({
    id: 'pat_101',
    name: 'Aarav Sharma',
    age: 42,
    village: 'Cuttack Sadar',
    phone: '+91 98765 43210'
  });
  const [recCategory, setRecCategory] = useState<PreventiveCareCategory>('screening');
  const [recActivityName, setRecActivityName] = useState<string>('Quarterly Diabetic Retinal & Foot Screening');
  const [recDueDate, setRecDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [recNotes, setRecNotes] = useState<string>('');

  const loadData = () => {
    const data = PreventiveCareService.getAllActivities();
    setActivities(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const metrics = useMemo(() => {
    const dataset = viewRole === 'patient' 
      ? activities.filter(a => a.patientId === 'pat_101') 
      : activities;

    const overdue = dataset.filter(a => a.status === 'overdue').length;
    const dueSoon = dataset.filter(a => a.status === 'due_soon').length;
    const completed = dataset.filter(a => a.status === 'completed').length;
    const careGaps = dataset.filter(a => a.isCareGap).length;

    return {
      total: dataset.length,
      overdue,
      dueSoon,
      completed,
      careGaps
    };
  }, [activities, viewRole]);

  const patientCareGap = useMemo(() => {
    return activities.find(a => a.patientId === 'pat_101' && a.isCareGap);
  }, [activities]);

  const filteredActivities = useMemo(() => {
    let list = viewRole === 'patient'
      ? activities.filter(a => a.patientId === 'pat_101')
      : activities;

    if (statusFilter === 'care_gaps') {
      list = list.filter(a => a.isCareGap);
    } else if (statusFilter !== 'all') {
      list = list.filter(a => a.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      list = list.filter(a => a.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a =>
        a.activityName.toLowerCase().includes(q) ||
        a.patientName.toLowerCase().includes(q) ||
        a.patientVillage.toLowerCase().includes(q) ||
        (a.notes && a.notes.toLowerCase().includes(q))
      );
    }

    return list;
  }, [activities, viewRole, statusFilter, categoryFilter, searchQuery]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (currentLang === 'hi') utterance.lang = 'hi-IN';
      else if (currentLang === 'bn') utterance.lang = 'bn-IN';
      else utterance.lang = 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      triggerToast('Audio Readout', text);
    }
  };

  const handleSpeakSummary = () => {
    let summaryText = '';
    if (currentLang === 'hi') {
      summaryText = `स्वास्थ्य सुरक्षा स्थिति: ${metrics.overdue} जांच की तारीख बीत चुकी है, ${metrics.dueSoon} जांच अगले सात दिनों में हैं, और ${metrics.completed} जांच पूर्ण हो चुकी हैं।`;
    } else if (currentLang === 'bn') {
      summaryText = `প্রতিরোধমূলক স্বাস্থ্য সেবা: ${metrics.overdue}টি বকেয়া, ${metrics.dueSoon}টি আসন্ন, এবং ${metrics.completed}টি সম্পন্ন হয়েছে।`;
    } else if (currentLang === 'or') {
      summaryText = `ସ୍ୱାସ୍ଥ୍ୟ ସୁରକ୍ଷା ସ୍ଥିତି: ${metrics.overdue}ଟି ବକେୟା, ${metrics.dueSoon}ଟି ଆଗାମୀ, ଏବଂ ${metrics.completed}ଟି ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଛି।`;
    } else {
      summaryText = `Preventive Care Summary: You have ${metrics.overdue} overdue milestones, ${metrics.dueSoon} due soon within the upcoming week, and ${metrics.completed} completed care cycles.`;
    }
    speakText(summaryText);
  };

  const handleSpeakActivity = (act: PreventiveCareActivity) => {
    const stageMeta = PREVENTIVE_LIFECYCLE_STAGES.find(s => s.key === act.lifecycleStage);
    const stageName = stageMeta ? stageMeta.label : act.lifecycleStage;
    let text = `Preventive Care Activity: ${act.activityName}. Status is ${act.status.replace('_', ' ')}. Due date: ${act.dueDate}. Current lifecycle stage: ${stageName}. Notes: ${act.notes || 'None'}.`;
    if (currentLang === 'hi') {
      text = `रोकथाम गतिविधि: ${act.activityName}। स्थिति: ${act.status === 'completed' ? 'पूर्ण' : act.status === 'overdue' ? 'तारीख निकल गई' : 'जल्द देय'}। देय तारीख: ${act.dueDate}।`;
    }
    speakText(text);
  };

  const openBookingFor = (act: PreventiveCareActivity) => {
    setSelectedActivity(act);
    setBookingClinic(act.clinicName || 'SCB Medical College OP Clinic');
    setBookingDate(act.dueDate);
    setBookingTime('10:30 AM');
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedActivity) return;
    const res = PreventiveCareService.bookAppointmentForActivity(
      selectedActivity.id,
      'clinic_1',
      bookingClinic,
      bookingDate || selectedActivity.dueDate,
      bookingTime,
      bookingPriority
    );

    if (res) {
      loadData();
      setIsBookingModalOpen(false);
      triggerToast(
        '✓ Appointment Confirmed',
        `Token #${res.tokenNumber} assigned at ${bookingClinic} for ${bookingDate || selectedActivity.dueDate}.`
      );
    }
  };

  const openAdvanceFor = (act: PreventiveCareActivity) => {
    setSelectedActivity(act);
    const nextIdx = Math.min(act.stageIndex + 1, PREVENTIVE_LIFECYCLE_STAGES.length - 1);
    setTargetStage(PREVENTIVE_LIFECYCLE_STAGES[nextIdx].key);
    setAdvanceNotes(act.notes || '');
    setAdvanceRecordTitle(act.medicalRecordTitle || '');
    setIsAdvanceModalOpen(true);
  };

  const handleConfirmAdvance = () => {
    if (!selectedActivity) return;
    const updated = PreventiveCareService.advanceStage(
      selectedActivity.id,
      targetStage,
      advanceNotes,
      advanceRecordTitle
    );

    if (updated) {
      loadData();
      setIsAdvanceModalOpen(false);
      triggerToast(
        '✓ Stage Updated',
        `'${selectedActivity.activityName}' advanced to ${targetStage.replace('_', ' ')}.`
      );
    }
  };

  const handleSaveRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    PreventiveCareService.createRecommendation({
      patientId: recPatient.id,
      patientName: recPatient.name,
      patientAge: recPatient.age,
      patientVillage: recPatient.village,
      patientPhone: recPatient.phone,
      activityName: recActivityName,
      category: recCategory,
      dueDate: recDueDate,
      notes: recNotes,
      healthWorkerName: 'Sunita Devi',
      healthWorkerRole: 'ASHA Worker',
      clinicName: 'SCB Medical College OP Clinic'
    });

    loadData();
    setIsRecommendModalOpen(false);
    triggerToast(
      '✓ Recommendation Created',
      `Added '${recActivityName}' for ${recPatient.name} due on ${recDueDate}.`
    );
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (calMonth === 1) {
      setCalMonth(12);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 12) {
      setCalMonth(1);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const handleTodayMonth = () => {
    const now = new Date();
    setCalYear(now.getFullYear());
    setCalMonth(now.getMonth() + 1);
  };

  const calendarData = useMemo(() => {
    const firstDay = new Date(calYear, calMonth - 1, 1).getDay();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    const totalDays = new Date(calYear, calMonth, 0).getDate();
    const todayYMD = new Date().toISOString().split('T')[0];

    const actsForMonth = activities.filter(a => {
      if (viewRole === 'patient' && a.patientId !== 'pat_101') return false;
      const [y, m] = a.dueDate.split('-').map(Number);
      return y === calYear && m === calMonth;
    });

    const dateMap: Record<string, PreventiveCareActivity[]> = {};
    actsForMonth.forEach(a => {
      if (!dateMap[a.dueDate]) dateMap[a.dueDate] = [];
      dateMap[a.dueDate].push(a);
    });

    return {
      adjustedFirstDay,
      totalDays,
      todayYMD,
      dateMap
    };
  }, [activities, calYear, calMonth, viewRole]);

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-4 py-3 rounded-lg shadow-lg border border-zinc-800 dark:border-zinc-200 flex items-center gap-3 text-xs max-w-sm">
          <div>
            <div className="font-semibold">{toastMessage.title}</div>
            <div className="text-zinc-400 dark:text-zinc-600 mt-0.5">{toastMessage.desc}</div>
          </div>
          <button onClick={() => setToastMessage(null)} className="ml-auto text-zinc-400 hover:text-white p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
            Lifecycle Management
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
            Preventive Care Tracker
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Track immunizations, routine checkups, and diagnostic screenings end-to-end.
          </p>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeakSummary}
            className="border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Listen</span>
          </button>

          <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 bg-zinc-50 dark:bg-zinc-900">
            <button
              onClick={() => setViewRole('patient')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                viewRole === 'patient'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
              }`}
            >
              My Care
            </button>
            <button
              onClick={() => setViewRole('asha_worker')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                viewRole === 'asha_worker'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
              }`}
            >
              ASHA Desk
            </button>
          </div>

          <button
            onClick={() => setIsRecommendModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Recommend</span>
          </button>
        </div>
      </div>

      {/* Care Gap Alert Banner */}
      {viewRole === 'patient' && patientCareGap && (
        <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Bell className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                  Care Gap Detected • Target Due: {patientCareGap.dueDate}
                </span>
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5">
                {patientCareGap.activityName}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Recommended by ASHA {patientCareGap.healthWorkerName}. Book a clinic appointment to secure your queue token.
              </p>
            </div>
          </div>

          <button
            onClick={() => openBookingFor(patientCareGap)}
            className="self-start sm:self-auto text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
          >
            <CalendarClock className="w-3.5 h-3.5" />
            <span>Book Clinic Slot</span>
          </button>
        </div>
      )}

      {/* Clean Metric Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setStatusFilter(statusFilter === 'overdue' ? 'all' : 'overdue')}
          className={`p-3.5 rounded-xl border bg-white dark:bg-zinc-900 cursor-pointer transition-colors ${
            statusFilter === 'overdue'
              ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800'
              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
          }`}
        >
          <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{metrics.overdue}</div>
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">Overdue</div>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'due_soon' ? 'all' : 'due_soon')}
          className={`p-3.5 rounded-xl border bg-white dark:bg-zinc-900 cursor-pointer transition-colors ${
            statusFilter === 'due_soon'
              ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800'
              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
          }`}
        >
          <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{metrics.dueSoon}</div>
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">Due Next 7 Days</div>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
          className={`p-3.5 rounded-xl border bg-white dark:bg-zinc-900 cursor-pointer transition-colors ${
            statusFilter === 'completed'
              ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800'
              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
          }`}
        >
          <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{metrics.completed}</div>
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">Completed</div>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'care_gaps' ? 'all' : 'care_gaps')}
          className={`p-3.5 rounded-xl border bg-white dark:bg-zinc-900 cursor-pointer transition-colors ${
            statusFilter === 'care_gaps'
              ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800'
              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
          }`}
        >
          <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{metrics.careGaps}</div>
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">Care Gaps</div>
        </div>
      </div>

      {/* Navigation Sub-tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1 border-b border-zinc-200 dark:border-zinc-800 pb-2 sm:pb-0 sm:border-0">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'timeline'
                ? 'text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'calendar'
                ? 'text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'recommendations'
                ? 'text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
            }`}
          >
            Guidelines
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-400"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-2 py-1 rounded-md text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="vaccination">Vaccination</option>
            <option value="screening">Screening</option>
            <option value="checkup">Checkup</option>
            <option value="follow_up">Follow-Up</option>
          </select>
        </div>
      </div>

      {/* TAB 1: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-3">
          {filteredActivities.length === 0 ? (
            <div className="p-8 text-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 text-xs">
              No preventive care activities found.
            </div>
          ) : (
            filteredActivities.map((act) => {
              const isDone = act.status === 'completed';
              return (
                <div
                  key={act.id}
                  className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-zinc-400 uppercase">
                          {act.category} • Due: {act.dueDate}
                        </span>
                        {act.daysRemaining < 0 && !isDone && (
                          <span className="text-[10px] font-medium text-red-600 dark:text-red-400">
                            {Math.abs(act.daysRemaining)}d overdue
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5">
                        {act.activityName}
                      </h3>
                      {viewRole === 'asha_worker' && (
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {act.patientName} ({act.patientAge}y • {act.patientVillage})
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleSpeakActivity(act)}
                        className="p-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        title="Audio Readout"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                        isDone 
                          ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' 
                          : act.status === 'overdue'
                          ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40'
                          : 'text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800'
                      }`}>
                        {isDone ? 'Completed' : act.status === 'overdue' ? 'Overdue' : 'Due Soon'}
                      </span>
                    </div>
                  </div>

                  {/* 6-Stage Progress Stepper */}
                  <div className="border-t border-b border-zinc-100 dark:border-zinc-800/80 py-3">
                    <div className="flex items-center justify-between gap-1 overflow-x-auto">
                      {PREVENTIVE_LIFECYCLE_STAGES.map((st, idx) => {
                        const isPast = idx < act.stageIndex || (idx === act.stageIndex && isDone);
                        const isCurrent = idx === act.stageIndex && !isDone;

                        return (
                          <React.Fragment key={st.key}>
                            <div className="flex flex-col items-center text-center min-w-[55px] shrink-0">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium ${
                                isPast
                                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                                  : isCurrent
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                              }`}>
                                {isPast ? '✓' : idx + 1}
                              </div>
                              <span className={`text-[10px] mt-1 ${isCurrent ? 'text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-400'}`}>
                                {st.label}
                              </span>
                            </div>

                            {idx < PREVENTIVE_LIFECYCLE_STAGES.length - 1 && (
                              <div className={`flex-1 h-[1px] min-w-[10px] ${idx < act.stageIndex ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200 dark:border-zinc-800'}`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* Appointment / Record details */}
                  {act.appointment && (
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Token <strong>#{act.appointment.tokenNumber}</strong> for {act.appointment.appointmentDate} at {act.appointment.slotTime} ({act.appointment.clinicName})</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        setSelectedActivity(act);
                        setIsDetailModalOpen(true);
                      }}
                      className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                      View Details →
                    </button>

                    <div className="flex items-center gap-2">
                      {act.isCareGap && (
                        <button
                          onClick={() => openBookingFor(act)}
                          className="text-xs font-medium bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 px-2.5 py-1 rounded-md text-zinc-800 dark:text-zinc-200"
                        >
                          Book Slot
                        </button>
                      )}

                      <button
                        onClick={() => openAdvanceFor(act)}
                        className="text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 px-2.5 py-1 rounded-md transition-colors"
                      >
                        Advance Stage
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: MONTH CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {monthNames[calMonth - 1]} {calYear}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleTodayMonth}
                className="px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center font-medium text-[11px] text-zinc-400 uppercase tracking-wide">
            <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: calendarData.adjustedFirstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 rounded-md bg-zinc-50/50 dark:bg-zinc-950/30" />
            ))}

            {Array.from({ length: calendarData.totalDays }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${calYear}-${String(calMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayEvents = calendarData.dateMap[dateStr] || [];
              const isToday = dateStr === calendarData.todayYMD;

              return (
                <div
                  key={`day-${dayNum}`}
                  onClick={() => {
                    if (dayEvents.length > 0) {
                      setSelectedDayEvents({ date: dateStr, items: dayEvents });
                    }
                  }}
                  className={`h-16 rounded-md p-1.5 border text-xs transition-colors flex flex-col justify-between cursor-pointer ${
                    isToday
                      ? 'border-zinc-900 dark:border-zinc-100 font-semibold'
                      : dayEvents.length > 0
                      ? 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      : 'border-zinc-100 dark:border-zinc-800/60'
                  }`}
                >
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{dayNum}</div>
                  {dayEvents.length > 0 && (
                    <div className="text-[10px] font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {dayEvents.length} {dayEvents.length === 1 ? 'item' : 'items'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: GUIDELINES */}
      {activeTab === 'recommendations' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Diabetic & Renal Screening</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Quarterly microalbuminuria, HbA1c review, and dilated eye checkup.</p>
              <button
                onClick={() => {
                  setRecCategory('screening');
                  setRecActivityName('Quarterly Diabetic Retinal & Foot Screening');
                  setIsRecommendModalOpen(true);
                }}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
              >
                + Add Milestone
              </button>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Maternal Td Immunization</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Tetanus & adult diphtheria booster under maternal health protocols.</p>
              <button
                onClick={() => {
                  setRecCategory('vaccination');
                  setRecActivityName('Maternal Tetanus & Diphtheria (Td-2) Booster');
                  setIsRecommendModalOpen(true);
                }}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
              >
                + Add Milestone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {/* 1. Detail Modal */}
      {isDetailModalOpen && selectedActivity && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{selectedActivity.activityName}</h3>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <div><strong>Patient:</strong> {selectedActivity.patientName}</div>
              <div><strong>Due Date:</strong> {selectedActivity.dueDate}</div>
              <div><strong>Health Worker:</strong> {selectedActivity.healthWorkerName}</div>
              <div><strong>Clinic:</strong> {selectedActivity.clinicName}</div>
              {selectedActivity.notes && <div><strong>Notes:</strong> {selectedActivity.notes}</div>}
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 1-Click Booking Modal */}
      {isBookingModalOpen && selectedActivity && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Book Clinic Slot</h3>
              <button onClick={() => setIsBookingModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Clinic</label>
                <select
                  value={bookingClinic}
                  onChange={(e) => setBookingClinic(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="SCB Medical College OP Clinic">SCB Medical College OP Clinic</option>
                  <option value="City Community Health Centre (CHC)">City Community Health Centre (CHC)</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2">
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Advance Stage Modal */}
      {isAdvanceModalOpen && selectedActivity && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Advance Stage</h3>
              <button onClick={() => setIsAdvanceModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Target Lifecycle Stage</label>
                <select
                  value={targetStage}
                  onChange={(e) => setTargetStage(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-medium"
                >
                  {PREVENTIVE_LIFECYCLE_STAGES.map((st) => (
                    <option key={st.key} value={st.key}>{st.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={advanceNotes}
                  onChange={(e) => setAdvanceNotes(e.target.value)}
                  placeholder="Clinical visit or report notes..."
                  className="w-full px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2">
              <button
                onClick={() => setIsAdvanceModalOpen(false)}
                className="px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAdvance}
                className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Recommend Modal */}
      {isRecommendModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Recommend Preventive Activity</h3>
              <button onClick={() => setIsRecommendModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRecommendation} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Patient</label>
                <select
                  value={recPatient.id}
                  onChange={(e) => {
                    const id = e.target.value;
                    if (id === 'pat_101') setRecPatient({ id: 'pat_101', name: 'Aarav Sharma', age: 42, village: 'Cuttack Sadar', phone: '+91 98765 43210' });
                    else if (id === 'pat_2') setRecPatient({ id: 'pat_2', name: 'Shakuntala Devi', age: 68, village: 'Sonarpur Sector 4', phone: '+91 98765 11223' });
                    else if (id === 'pat_4') setRecPatient({ id: 'pat_4', name: 'Fatima Begum', age: 29, village: 'Mangalabag Ward 12', phone: '+91 98765 55667' });
                  }}
                  className="w-full px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="pat_101">Aarav Sharma (42y)</option>
                  <option value="pat_2">Shakuntala Devi (68y)</option>
                  <option value="pat_4">Fatima Begum (29y)</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Activity Name</label>
                <input
                  type="text"
                  required
                  value={recActivityName}
                  onChange={(e) => setRecActivityName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Type</label>
                  <select
                    value={recCategory}
                    onChange={(e) => setRecCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="screening">Screening</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="checkup">Checkup</option>
                    <option value="follow_up">Follow-Up</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={recDueDate}
                    onChange={(e) => setRecDueDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecommendModalOpen(false)}
                  className="px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Day Schedule Modal */}
      {selectedDayEvents && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Schedule for {selectedDayEvents.date}</h3>
              <button onClick={() => setSelectedDayEvents(null)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {selectedDayEvents.items.map((it) => (
                <div key={it.id} className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">{it.activityName}</div>
                  <div className="text-zinc-500">Patient: {it.patientName} • {it.clinicName}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDayEvents(null)}
                className="px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Preventive_Care;
