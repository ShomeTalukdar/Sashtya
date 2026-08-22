import { FamilyMember, FamilyPermission, FamilyMedicalHistoryItem } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { initialFamilyMembers } from './mockData';

const initialFamilyHistory: FamilyMedicalHistoryItem[] = [
  {
    id: 'hist_1',
    conditionName: 'Hypertension / High Blood Pressure',
    affectedMembers: ['Father', 'Grandmother'],
    notes: 'Monitored with daily BP checks & low sodium diet'
  },
  {
    id: 'hist_2',
    conditionName: 'Type 2 Diabetes Mellitus',
    affectedMembers: ['Mother'],
    notes: 'Managed with Metformin 500mg daily'
  }
];

export class FamilyService {
  static getFamilyMembers(): FamilyMember[] {
    return StorageService.getItem<FamilyMember[]>(STORAGE_KEYS.FAMILY, initialFamilyMembers);
  }

  static updatePermissions(memberId: string, permissions: Partial<FamilyPermission>): FamilyMember[] {
    const members = this.getFamilyMembers();
    const updated = members.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          permissions: { ...m.permissions, ...permissions }
        };
      }
      return m;
    });
    StorageService.setItem(STORAGE_KEYS.FAMILY, updated);
    return updated;
  }

  static addFamilyMember(memberData: {
    fullName: string;
    relationship: 'Father' | 'Mother' | 'Spouse' | 'Child' | 'Sibling' | 'Grandparent' | 'Caregiver';
    age: number;
    phone: string;
    permissions?: Partial<FamilyPermission>;
  }): FamilyMember[] {
    const members = this.getFamilyMembers();
    const newMember: FamilyMember = {
      id: `fam_${Date.now()}`,
      fullName: memberData.fullName,
      relationship: memberData.relationship,
      age: memberData.age,
      phone: memberData.phone,
      permissions: {
        canViewAppointments: true,
        canManageMedications: true,
        canViewEmergencyCard: true,
        canViewMedicalDocuments: false,
        canViewInsurance: false,
        ...memberData.permissions
      },
      healthSummary: {
        activeMedicinesCount: 0,
        upcomingAppointmentsCount: 0,
        lastCheckupDate: 'Recently Added'
      }
    };
    const updated = [newMember, ...members];
    StorageService.setItem(STORAGE_KEYS.FAMILY, updated);
    return updated;
  }

  static deleteFamilyMember(memberId: string): FamilyMember[] {
    const members = this.getFamilyMembers().filter(m => m.id !== memberId);
    StorageService.setItem(STORAGE_KEYS.FAMILY, members);
    return members;
  }

  static getFamilyHistory(): FamilyMedicalHistoryItem[] {
    return StorageService.getItem<FamilyMedicalHistoryItem[]>(STORAGE_KEYS.FAMILY_HISTORY, initialFamilyHistory);
  }

  static addFamilyHistory(historyData: {
    conditionName: string;
    affectedMembers: string[];
    notes: string;
  }): FamilyMedicalHistoryItem[] {
    const historyList = this.getFamilyHistory();
    const newItem: FamilyMedicalHistoryItem = {
      id: `hist_${Date.now()}`,
      conditionName: historyData.conditionName,
      affectedMembers: historyData.affectedMembers,
      notes: historyData.notes || 'Recorded in family health vault'
    };
    const updated = [newItem, ...historyList];
    StorageService.setItem(STORAGE_KEYS.FAMILY_HISTORY, updated);
    return updated;
  }

  static deleteFamilyHistory(historyId: string): FamilyMedicalHistoryItem[] {
    const updated = this.getFamilyHistory().filter(h => h.id !== historyId);
    StorageService.setItem(STORAGE_KEYS.FAMILY_HISTORY, updated);
    return updated;
  }
}
