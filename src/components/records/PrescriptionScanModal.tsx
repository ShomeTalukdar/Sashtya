import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Sparkles, CheckCircle2, Trash2, AlertCircle, FileText, Eye } from 'lucide-react';
import { OCRService } from '../../services/ocrService';
import { PrescriptionOCRResult, ExtractedMedication } from '../../types';
import { MedicationService } from '../../services/medicationService';

interface PrescriptionScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessScheduleAdded: () => void;
}

export const PrescriptionScanModal: React.FC<PrescriptionScanModalProps> = ({
  isOpen,
  onClose,
  onSuccessScheduleAdded
}) => {
  const [step, setStep] = useState<'upload' | 'scanning' | 'confirm'>('upload');
  const [ocrData, setOcrData] = useState<PrescriptionOCRResult | null>(null);
  const [editableMedicines, setEditableMedicines] = useState<ExtractedMedication[]>([]);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDesktopFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      if (file.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(file);
        setUploadedImagePreview(objectUrl);
      } else {
        setUploadedImagePreview(null);
      }
      handleStartScan(file.name, file);
    }
  };

  const handleStartScan = async (fileName: string = 'Prescription_Aug2026.jpg', fileObj?: File) => {
    setStep('scanning');
    setUploadedFileName(fileName);

    if (!uploadedImagePreview && !fileObj) {
      setUploadedImagePreview('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=60');
    }

    const result = await OCRService.simulatePrescriptionScan(fileName, fileObj);
    setOcrData(result);
    setEditableMedicines(result.extractedMedicines);
    setStep('confirm');
  };

  const handleUpdateMedicine = (index: number, updated: Partial<ExtractedMedication>) => {
    const list = [...editableMedicines];
    list[index] = { ...list[index], ...updated };
    setEditableMedicines(list);
  };

  const handleRemoveMedicine = (index: number) => {
    setEditableMedicines(editableMedicines.filter((_, i) => i !== index));
  };

  const handleConfirmAndSave = () => {
    editableMedicines.forEach((med) => {
      MedicationService.addSchedule({
        medicineName: med.name,
        dosage: med.dosageStrength,
        timeOfDay: med.timeOfDay,
        specificTimes: med.timeOfDay.map(t => t === 'Morning' ? '08:00 AM' : t === 'Afternoon' ? '02:00 PM' : '08:00 PM'),
        durationDays: med.durationDays,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + med.durationDays * 86400000).toISOString().split('T')[0],
        instructions: med.instructions,
        status: 'Active'
      });
    });

    onSuccessScheduleAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-zinc-200 dark:border-zinc-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Prescription OCR Scanner</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleDesktopFileSelect}
          className="hidden"
        />

        {/* STEP 1: Upload */}
        {step === 'upload' && (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-5 rounded-xl flex flex-col items-start gap-2 transition-colors text-left shadow-xs group"
              >
                <div className="p-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-sm block">Upload Photo / File</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Select prescription from device</span>
                </div>
              </button>

              <button
                onClick={() => handleStartScan('Doctor_Prescription_Scan.jpg')}
                className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-5 rounded-xl flex flex-col items-start gap-2 transition-colors text-left shadow-xs group"
              >
                <div className="p-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-sm block">Sample Prescription</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Test scan with demo Rx</span>
                </div>
              </button>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-lg text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <span>SWASTYA extracts medication names, dosage frequencies, and duration automatically to create your reminders.</span>
            </div>
          </div>
        )}

        {/* STEP 2: Scanning */}
        {step === 'scanning' && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            {uploadedImagePreview ? (
              <div className="relative w-56 h-36 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950">
                <img src={uploadedImagePreview} alt="Uploaded Rx" className="w-full h-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-indigo-500/10" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full border-2 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-100 animate-spin" />
            )}

            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">AI OCR Extraction in Progress...</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Extracting medicine names, dosage, and frequency instructions.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Confirm & Edit */}
        {step === 'confirm' && ocrData && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs">
              {uploadedImagePreview ? (
                <div className="rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-700 max-h-24 flex items-center justify-center">
                  <img src={uploadedImagePreview} alt="Rx Document" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 flex flex-col items-center justify-center text-zinc-400">
                  <FileText className="w-6 h-6 mb-1 text-zinc-400" />
                  <span className="text-[10px]">{uploadedFileName || 'Document'}</span>
                </div>
              )}

              <div className="sm:col-span-2 flex flex-col justify-center">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                    96% Confidence
                  </span>
                  <span className="text-[11px] text-zinc-400">{ocrData.date}</span>
                </div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mt-1">{ocrData.doctorName}</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{ocrData.clinicHospital}</p>
              </div>
            </div>

            {/* Extracted Medicines List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide block">
                Extracted Medicines
              </span>

              {editableMedicines.map((med, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) => handleUpdateMedicine(idx, { name: e.target.value })}
                      className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 flex-1 outline-none"
                    />
                    <button 
                      onClick={() => handleRemoveMedicine(idx)}
                      className="p-1 text-zinc-400 hover:text-red-600 rounded transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-0.5">Dosage</label>
                      <input
                        type="text"
                        value={med.dosageStrength}
                        onChange={(e) => handleUpdateMedicine(idx, { dosageStrength: e.target.value })}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-0.5">Duration (Days)</label>
                      <input
                        type="number"
                        value={med.durationDays}
                        onChange={(e) => handleUpdateMedicine(idx, { durationDays: parseInt(e.target.value) || 1 })}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 outline-none"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-[10px] text-zinc-400 block mb-0.5">Instructions</label>
                      <input
                        type="text"
                        value={med.instructions}
                        onChange={(e) => handleUpdateMedicine(idx, { instructions: e.target.value })}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => {
                  setStep('upload');
                  setUploadedImagePreview(null);
                }}
                className="px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Back
              </button>

              <button
                onClick={handleConfirmAndSave}
                className="px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Reminders</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default PrescriptionScanModal;
