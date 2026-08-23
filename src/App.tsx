import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { EmergencyModal } from './components/emergency/EmergencyModal';
import { EmergencyCardModal } from './components/emergency/EmergencyCardModal';
import { AssistantDrawer } from './components/assistant/AssistantDrawer';
import { HomeDashboard } from './components/home/HomeDashboard';
import { SimpleModeDashboard } from './components/simple/SimpleModeDashboard';
import { HealthRecordsPage } from './components/records/HealthRecordsPage';
import { PrescriptionScanModal } from './components/records/PrescriptionScanModal';
import { MedicinesPage } from './components/medicines/MedicinesPage';
import { AppointmentsPage } from './components/appointments/AppointmentsPage';
import { FamilyPage } from './components/family/FamilyPage';
import { InsurancePage } from './components/insurance/InsurancePage';
import { BillTransparencyPage } from './components/bills/BillTransparencyPage';
import { HospitalsPage } from './components/hospitals/HospitalsPage';
import { SchemesPage } from './components/schemes/SchemesPage';
import { SpecialCarePage } from './components/special/SpecialCarePage';
import { ReviewsPage } from './components/reviews/ReviewsPage';
import { Preventive_Care } from './components/Preventive_Care';

import { initialPatientProfile } from './services/mockData';
import { MedicationService } from './services/medicationService';
import { AppointmentService } from './services/appointmentService';
import { StorageService } from './services/storageService';
import { PatientProfile } from './types';

export const App: React.FC = () => {
  const [patientProfile, setPatientProfile] = useState<PatientProfile>(initialPatientProfile);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(false);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('swastya_dark_mode') === 'true';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('swastya_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('swastya_dark_mode', 'false');
    }
  }, [isDarkMode]);

  // Modals state
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isEmergencyCardOpen, setIsEmergencyCardOpen] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);

  // Offline status
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(StorageService.getSyncQueue().length);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      StorageService.processSyncQueue();
      setPendingSyncCount(0);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleMarkMedTaken = (medId: string) => {
    MedicationService.logDose(medId, 'Taken');
    setPatientProfile({ ...patientProfile });
  };

  const nextMed = MedicationService.getNextMedication();
  const nextApp = AppointmentService.getAppointments()[0];

  return (
    <div className={`min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased flex flex-col selection:bg-indigo-500 selection:text-white ${isHighContrast ? 'contrast-125' : ''}`}>
      
      {/* Header */}
      <Header
        currentLang={currentLanguage as any}
        onLangChange={setCurrentLanguage as any}
        isSimpleMode={isSimpleMode}
        onToggleSimpleMode={() => setIsSimpleMode(!isSimpleMode)}
        isHighContrast={isHighContrast}
        onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        syncStatus={isOnline ? 'Synced' : 'Offline'}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        activeTab={activeTab}
        onNavigate={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-16">
        {isSimpleMode ? (
          <SimpleModeDashboard
            onNavigate={(tab) => {
              setActiveTab(tab);
              setIsSimpleMode(false);
            }}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeDashboard
                patient={patientProfile}
                nextMedication={nextMed}
                nextAppointment={nextApp}
                onNavigate={setActiveTab}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
                onOpenAssistant={() => setIsAssistantOpen(true)}
                onOpenScanModal={() => setIsScanModalOpen(true)}
                onMarkMedTaken={handleMarkMedTaken}
              />
            )}

            {activeTab === 'records' && (
              <HealthRecordsPage onOpenScanModal={() => setIsScanModalOpen(true)} />
            )}

            {activeTab === 'medicines' && (
              <MedicinesPage onOpenScanModal={() => setIsScanModalOpen(true)} />
            )}

            {activeTab === 'appointments' && (
              <AppointmentsPage />
            )}

            {activeTab === 'family' && (
              <FamilyPage />
            )}

            {activeTab === 'insurance' && (
              <InsurancePage />
            )}

            {activeTab === 'bills' && (
              <BillTransparencyPage />
            )}

            {activeTab === 'hospitals' && (
              <HospitalsPage />
            )}

            {activeTab === 'schemes' && (
              <SchemesPage />
            )}

            {activeTab === 'special' && (
              <SpecialCarePage />
            )}

            {activeTab === 'reviews' && (
              <ReviewsPage />
            )}

            {activeTab === 'preventive_care' && (
              <Preventive_Care
                currentLang={currentLanguage as any}
                onNavigate={setActiveTab}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Touch-Friendly Bottom Mobile Navigation */}
      <MobileNav
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Modals & Drawers */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onOpenCard={() => {
          setIsEmergencyOpen(false);
          setIsEmergencyCardOpen(true);
        }}
      />

      <EmergencyCardModal
        isOpen={isEmergencyCardOpen}
        onClose={() => setIsEmergencyCardOpen(false)}
      />

      <AssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onNavigate={setActiveTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />

      <PrescriptionScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onSuccessScheduleAdded={() => {
          setActiveTab('medicines');
        }}
      />

    </div>
  );
};

export default App;
