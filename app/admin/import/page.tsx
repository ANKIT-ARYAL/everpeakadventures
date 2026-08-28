'use client';

import React, { useState } from 'react';
import { Upload, AlertCircle, Database, RefreshCw, PlusCircle, CheckCircle2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const IMPORT_TYPES = [
  { id: 'all', label: 'All Data (Auto-Detect)' },
  { id: 'trek', label: 'Trekking Packages' },
  { id: 'tour', label: 'Tour Packages' },
  { id: 'blog', label: 'Blog Posts' },
  { id: 'faq', label: 'FAQs' },
  { id: 'media', label: 'Media Gallery (Attachments)' },
];

export default function DataImportPage() {
  const [loading, setLoading] = useState(false);
  const [dataType, setDataType] = useState('all');
  const [mode, setMode] = useState<'overwrite' | 'append'>('append');
  const [file, setFile] = useState<File | null>(null);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a JSON file to upload.');
      return;
    }

    setLoading(true);
    try {
      const text = await file.text();

      const res = await fetch(`/api/admin/import?dataType=${dataType}&mode=${mode}&fileName=${encodeURIComponent(file.name)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'text/plain' },
        body: text,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Import failed');

      toast.success(result.message || 'Data imported successfully!');
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-lg pb-20">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#112233] uppercase tracking-wide flex items-center gap-3">
            <Database className="w-6 h-6 text-[#24a0ed]" /> Data Importer
          </h1>
          <p className="text-gray-500 mt-1">
            Import bulk data from WordPress or other JSON exports into the system.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-8">
        
        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-bold text-gray-800 mb-2 uppercase tracking-wider">Target Data Type</label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
              className="w-full p-3 border rounded-lg text-lg font-medium focus:border-[#24a0ed] outline-none bg-gray-50"
            >
              {IMPORT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <p className="text-md text-gray-400 mt-2">Only the selected table will be modified.</p>
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-2 uppercase tracking-wider">Import Mode</label>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                className={`flex-1 py-2 rounded-md font-bold transition-colors flex items-center justify-center gap-2 ${
                  mode === 'append' ? 'bg-white shadow-sm text-[#24a0ed]' : 'text-gray-500 hover:text-gray-800'
                }`}
                onClick={() => setMode('append')}
              >
                <PlusCircle className="w-4 h-4" /> Append Data
              </button>
              <button
                className={`flex-1 py-2 rounded-md font-bold transition-colors flex items-center justify-center gap-2 ${
                  mode === 'overwrite' ? 'bg-red-500 shadow-sm text-white' : 'text-gray-500 hover:text-gray-800'
                }`}
                onClick={() => setMode('overwrite')}
              >
                <RefreshCw className="w-4 h-4" /> Overwrite All
              </button>
            </div>
            <p className="text-md text-gray-400 mt-2">
              {mode === 'overwrite' ? 'Warning: All existing records for this type will be deleted.' : 'New records will be added alongside existing ones.'}
            </p>
          </div>
        </div>

        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
          <input
            type="file"
            id="file-upload"
            accept=".json,.xml"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              {file ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> : <Upload className="w-8 h-8" />}
            </div>
            <div>
              <span className="block font-bold text-lg text-gray-800 mb-1">
                {file ? file.name : 'Click to select JSON file'}
              </span>
              <span className="text-gray-500">
                {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Only JSON format is currently supported'}
              </span>
            </div>
          </label>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-1">Data Schema Mapping</p>
            <p className="text-md">
              The keys in your JSON file must match our database schema. If you are uploading a WordPress export for the first time, you may need your developer to align the mapping first. 
              If the schema does not match, the import will fail to prevent data corruption.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t">
          <button
            suppressHydrationWarning
            onClick={handleImport}
            disabled={!mounted || loading || !file}
            className="w-full bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-base"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" /> Processing...
              </>
            ) : (
              <>
                <Database className="w-5 h-5" /> Execute Import
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
