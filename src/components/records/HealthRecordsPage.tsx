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
  CheckCircle2,
  FileCheck
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
      
      // Generate instant preview Object URL for desktop photo uploads
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
        setUploadSuccess(`Successfully uploaded "${file.name}" from Desktop!`);
        setTimeout(() => setUploadSuccess(''), 4000);
      }, 600);
    }
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
    if (selectedRecord?.id === id) setSelectedRecord(null);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-8 h-8 text-[#0057B8]" />
            <span>Digital Health Records</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Upload medical photos & files directly from Desktop or scan prescriptions with AI OCR.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Prescription Scan + OCR Button */}
          <button
            onClick={onOpenScanModal}
            className="bg-gradient-to-r from-[#0057B8] to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-extrabold text-xs sm:text-sm px-4 py-3 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Scan Desktop Prescription OCR</span>
          </button>

          {/* Upload Desktop File Input */}
          <label className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm px-4 py-3 rounded-2xl flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading Desktop File...' : 'Upload Desktop Photo/File'}</span>
            <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*,.pdf" />
          </label>
        </div>
      </div>

      {uploadSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Search & Category Filter Pills */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-card space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records by title, doctor name, or tag (e.g. 'Blood test', 'Prescription')..."
            className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-900 outline-none focus:border-[#0057B8] focus:bg-white transition-all font-medium"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0057B8] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Health Records List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecords.map((rec) => (
          <div 
            key={rec.id}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <span className="px-3 py-1 rounded-full bg-[#EAF3FF] text-[#0057B8] text-xs font-black">
                  {rec.category}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{rec.dateUploaded}</span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base mt-2.5 flex items-center gap-2">
                <span>{rec.title}</span>
                {rec.tags.includes('Desktop Photo') && (
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Desktop Upload</span>
                )}
              </h3>

              {rec.doctorName && (
                <p className="text-xs text-slate-600 font-semibold mt-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{rec.doctorName} • {rec.hospitalName}</span>
                </p>
              )}

              {rec.notes && (
                <p className="text-xs text-slate-500 font-medium mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {rec.notes}
                </p>
              )}

              {/* Tag Chips */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {rec.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">
                {rec.fileType.toUpperCase()} • {rec.fileSizeMb} MB
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedRecord(rec)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0057B8] font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => handleDeleteRecord(rec.id)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-[#0057B8] uppercase">{selectedRecord.category}</span>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedRecord.title}</h3>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 max-h-96 flex items-center justify-center relative">
              <img src={selectedRecord.fileUrl} alt={selectedRecord.title} className="max-h-96 w-full object-contain" />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
              <span>Doctor: {selectedRecord.doctorName}</span>
              <a 
                href={selectedRecord.fileUrl} 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-[#0057B8] text-white font-bold flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>View Full Resolution</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
