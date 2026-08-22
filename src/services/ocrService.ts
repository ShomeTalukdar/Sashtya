import { PrescriptionOCRResult } from '../types';

export class OCRService {
  static simulatePrescriptionScan(fileName: string = 'Desktop_Prescription.jpg', imageFile?: File): Promise<PrescriptionOCRResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleanName = imageFile ? imageFile.name.replace(/\.[^/.]+$/, "") : fileName;
        resolve({
          prescriptionId: `presc_ocr_${Date.now().toString().slice(-4)}`,
          doctorName: 'Dr. Ananya Sen (MD, DM)',
          clinicHospital: 'SCB Cardiology OP Clinic',
          date: new Date().toISOString().split('T')[0],
          rawText: `
          SCB MEDICAL COLLEGE & HOSPITAL - OP DEPARTMENT
          Prescription Document: ${cleanName}
          Patient: Aarav Sharma (Age: 42, Male) Date: ${new Date().toLocaleDateString()}
          
          Rx:
          1. Tab. Paracetamol 500mg -- 1-0-1 (3 days) after food
          2. Tab. Pantoprazole 40mg -- 1-0-0 (7 days) 30 min before breakfast
          3. Tab. Telmisartan 40mg -- 1-0-0 (30 days) morning
          
          Follow up after 15 days.
          Dr. Ananya Sen (Reg No: 58921)
          `,
          confidenceScore: 0.96,
          extractedMedicines: [
            {
              id: `ocr_med_1_${Date.now()}`,
              name: 'Paracetamol 500 mg',
              dosageStrength: '500 mg',
              frequency: 'Twice daily',
              timeOfDay: ['Morning', 'Night'],
              durationDays: 3,
              instructions: 'Take after meals for fever or pain'
            },
            {
              id: `ocr_med_2_${Date.now()}`,
              name: 'Pantoprazole 40 mg',
              dosageStrength: '40 mg',
              frequency: 'Once daily',
              timeOfDay: ['Morning'],
              durationDays: 7,
              instructions: 'Take 30 minutes before breakfast'
            },
            {
              id: `ocr_med_3_${Date.now()}`,
              name: 'Telmisartan 40 mg',
              dosageStrength: '40 mg',
              frequency: 'Once daily',
              timeOfDay: ['Morning'],
              durationDays: 30,
              instructions: 'Take after morning breakfast'
            }
          ]
        });
      }, 1400); // Realistic AI OCR scanning delay
    });
  }
}
