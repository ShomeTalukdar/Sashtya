import { SyncStatus } from '../types';

const STORAGE_KEYS = {
  PATIENT: 'swastya_patient_profile',
  EMERGENCY_CARD: 'swastya_emergency_card',
  RECORDS: 'swastya_records',
  MEDICATIONS: 'swastya_medications',
  APPOINTMENTS: 'swastya_appointments',
  FAMILY: 'swastya_family',
  FAMILY_HISTORY: 'swastya_family_history',
  INSURANCE: 'swastya_insurance',
  BILL: 'swastya_bill',
  SYNC_QUEUE: 'swastya_sync_queue',
  SYNC_STATUS: 'swastya_sync_status'
};

export class StorageService {
  private static isBrowser = typeof window !== 'undefined';

  static getItem<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser) return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Error reading key ${key} from storage:`, e);
      return defaultValue;
    }
  }

  static setItem<T>(key: string, value: T): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.enqueueSyncChange(key, value);
    } catch (e) {
      console.warn(`Error saving key ${key} to storage:`, e);
    }
  }

  static getSyncStatus(): SyncStatus {
    return this.getItem<SyncStatus>(STORAGE_KEYS.SYNC_STATUS, 'Synced');
  }

  static setSyncStatus(status: SyncStatus): void {
    if (!this.isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.SYNC_STATUS, JSON.stringify(status));
  }

  static getSyncQueue(): Array<{ key: string; timestamp: number }> {
    return this.getItem<Array<{ key: string; timestamp: number }>>(STORAGE_KEYS.SYNC_QUEUE, []);
  }

  static processSyncQueue(): void {
    if (!this.isBrowser) return;
    this.setSyncStatus('Syncing');
    setTimeout(() => {
      this.setSyncStatus('Synced');
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
    }, 1000);
  }

  private static enqueueSyncChange(key: string, data: any): void {
    const queue = this.getItem<Array<{ key: string; timestamp: number }>>(STORAGE_KEYS.SYNC_QUEUE, []);
    queue.push({ key, timestamp: Date.now() });
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    
    // Simulate auto sync queue processing
    if (navigator.onLine) {
      this.setSyncStatus('Syncing');
      setTimeout(() => {
        this.setSyncStatus('Synced');
        localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
      }, 1200);
    } else {
      this.setSyncStatus('Offline');
    }
  }
}

export { STORAGE_KEYS };
