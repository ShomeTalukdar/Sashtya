import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Search,
  Sparkles,
  Download,
  Eye,
  Trash2,
  User,
  X,
  CheckCircle2
} from 'lucide-react';
import { HealthRecord, RecordCategory } from '../../types';
import { initialHealthRecords } from '../../services/mockData';

interface HealthRecordsPageProps {
  onOpenScanModal: () => void;
}

export const HealthRecordsPage: React.FC<HealthRecordsPageProps> = ({
  onOpenScanModal
}) => {
  const [records, setRecords] = useState<HealthRecord[]>(initialHealthRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  const categories: string[] = [
    'All',
    'Prescriptions',
    'Lab Reports',
    'Scans',
    'Bills',
    'Insurance',
    'Discharge',
    'Other'
  ];

  const filteredRecords = records.filter(rec => {
    const matchesCategory = selectedCategory === 'All' || rec.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.doctorName && rec.doctorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rec.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      const fileUrl = file.type.startsWith('image/') 
        ? URL.createObjectURL(file) 
        : 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=60';

      setTimeout(() => {
        const newRecord: HealthRecord = {
          id: `rec_${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, ""),
          category: (selectedCategory === 'All' ? 'Prescriptions' : selectedCategory) as RecordCategory,
          doctorName: 'Uploaded Document',
          hospitalName: 'Patient Digital Vault',
          dateUploaded: new Date().toISOString().split('T')[0],
          fileUrl: fileUrl,
          fileType: file.type.includes('pdf') ? 'pdf' : 'image',
          fileSizeMb: parseFloat((file.size / (1024 * 1024)).toFixed(2)) || 0.8,
          tags: ['Desktop Photo', 'User Document'],
          notes: `Direct upload from Desktop (${file.name})`
        };
        setRecords([newRecord, ...records]);
        setIsUploading(false);
        setUploadSuccess(`Uploaded "${file.name}"`);
        setTimeout(() => setUploadSuccess(''), 4000);
      }, 500);
    }
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
    if (selectedRecord?.id === id) setSelectedRecord(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
            Digital Health Records
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
            Medical Documents & Scans
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Upload prescriptions, lab reports, and imaging scans for AI OCR processing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenScanModal}
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scan OCR</span>
          </button>

          <label className="border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs">
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
            <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*,.pdf" />
          </label>
        </div>
      </div>

      {uploadSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Search & Category Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative sm:w-60">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records..."
            className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-400"
          />
        </div>
      </div>

      {/* Health Records List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecords.map((rec) => (
          <div 
            key={rec.id}
            className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-medium text-zinc-400 uppercase">
                  {rec.category}
                </span>
                <span className="text-[11px] text-zinc-400">{rec.dateUploaded}</span>
              </div>

              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mt-1">
                {rec.title}
              </h3>

              {rec.doctorName && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-zinc-400" />
                  <span>{rec.doctorName} • {rec.hospitalName}</span>
                </p>
              )}

              {rec.notes && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 bg-zinc-50 dark:bg-zinc-800/60 p-2.5 rounded-lg">
                  {rec.notes}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">
                {rec.fileType.toUpperCase()} • {rec.fileSizeMb} MB
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedRecord(rec)}
                  className="px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3 h-3 text-zinc-400" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => handleDeleteRecord(rec.id)}
                  className="p-1 rounded-md text-zinc-400 hover:text-red-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  title="Delete Record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <span className="text-[11px] font-medium text-zinc-400 uppercase">{selectedRecord.category}</span>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{selectedRecord.title}</h3>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 max-h-80 flex items-center justify-center">
              <img src={selectedRecord.fileUrl} alt={selectedRecord.title} className="max-h-80 w-full object-contain" />
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <span>Doctor: {selectedRecord.doctorName}</span>
              <a 
                href={selectedRecord.fileUrl} 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1.5 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Full Resolution</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HealthRecordsPage;
