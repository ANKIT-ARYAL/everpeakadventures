'use client';

import React from 'react';
import { Plus, Trash2, GripVertical, Video, Clock } from 'lucide-react';
import SectionCard from './SectionCard';
import FieldGrid from './FieldGrid';
import NumberInput from '@/app/components/NumberInput';

export interface ElevationPoint {
  day: number;
  location: string;
  elevation: number;
  videoTime?: number;
  note?: string;
}

interface Props {
  value: ElevationPoint[];
  onChange: (v: ElevationPoint[]) => void;
}

const inputCls =
  'w-full px-3 py-2 border border-gray-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-100';

const labelCls = 'block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider';

const trashBtn = (onClick: () => void) => (
  <button type="button" onClick={onClick} className="text-red-500 hover:bg-red-50 p-2 rounded self-end">
    <Trash2 className="w-4 h-4" />
  </button>
);

const addBtn = (onClick: () => void, label: string) => (
  <button type="button" onClick={onClick} className="bg-[#112233] text-white px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-1">
    <Plus className="w-3.5 h-3.5" /> {label}
  </button>
);

const dragBtn = () => (
  <button type="button" className="text-gray-400 hover:text-gray-600 p-2 cursor-grab active:cursor-grabbing" aria-label="Drag to reorder">
    <GripVertical className="w-4 h-4" />
  </button>
);

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function parseTime(timeStr: string): number | undefined {
  if (!timeStr) return undefined;
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  const num = Number(timeStr);
  return Number.isFinite(num) ? num : undefined;
}

export default function ElevationProfileEditor({ value = [], onChange }: Props) {
  const data = value;

  const setPoint = (i: number, patch: Partial<ElevationPoint>) =>
    onChange(data.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  const removePoint = (i: number) =>
    onChange(data.filter((_, idx) => idx !== i).map((p, idx) => ({ ...p, day: idx + 1 })));

  const addPoint = () =>
    onChange([...data, { day: data.length + 1, location: '', elevation: 0 }]);

  const movePoint = (fromIndex: number, toIndex: number) => {
    const newData = [...data];
    const [removed] = newData.splice(fromIndex, 1);
    newData.splice(toIndex, 0, removed);
    onChange(newData.map((p, idx) => ({ ...p, day: idx + 1 })));
  };

  return (
    <SectionCard
      title="Elevation Profile (Video Synced)"
      subtitle={data.length === 0 ? 'No elevation points defined' : `${data.length} point${data.length > 1 ? 's' : ''} defined`}
      action={addBtn(addPoint, 'Add Point')}
      defaultOpen
    >
      {data.length === 0 && <p className="text-[11px] text-gray-400 italic">No elevation points defined. Add points to create the elevation profile.</p>}
      
      <div className="space-y-3">
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
          <strong>How it works:</strong> Add elevation points for each day/location. Optionally set a video timestamp (MM:SS format) for each point. 
          When a video is added to the trek, the elevation chart will automatically sync with video playback - highlighting the current location as the video plays. 
          Users can also click on any point to jump to that moment in the video.
        </div>

        {data.map((point, i) => (
          <div
            key={i}
            className="border border-gray-100 rounded-lg p-3 bg-gray-50/50 space-y-2 relative"
            style={{ borderLeft: '3px solid #24a0ed' }}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700 w-20">Day {point.day || i + 1}</span>
              {dragBtn()}
              {trashBtn(() => removePoint(i))}
            </div>
            
            <FieldGrid cols={4}>
              <div className="sm:col-span-2">
                <label className={labelCls}>Location Name</label>
                <input
                  className={inputCls}
                  placeholder="e.g. Namche Bazaar, Everest Base Camp"
                  value={point.location}
                  onChange={(e) => setPoint(i, { location: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Elevation (m)</label>
                <NumberInput
                  type="number"
                  className={inputCls}
                  placeholder="3440"
                  value={point.elevation || ''}
                  onChange={(e) => setPoint(i, { elevation: Number(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className={labelCls}>Video Time (MM:SS)</label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    className={`${inputCls} pl-10`}
                    placeholder="00:00"
                    value={point.videoTime ? formatTime(point.videoTime) : ''}
                    onChange={(e) => setPoint(i, { videoTime: parseTime(e.target.value) })}
                    title="Enter timestamp in MM:SS format (e.g., 2:30 for 2 minutes 30 seconds)"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label className={labelCls}>Note (optional)</label>
                <input
                  className={inputCls}
                  placeholder="Optional description for this elevation point"
                  value={point.note || ''}
                  onChange={(e) => setPoint(i, { note: e.target.value })}
                />
              </div>
            </FieldGrid>

            {point.videoTime !== undefined && (
              <div className="pt-2 border-t border-gray-100">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Video timestamp: <strong>{formatTime(point.videoTime)}</strong> - This point will highlight when video reaches this time</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}