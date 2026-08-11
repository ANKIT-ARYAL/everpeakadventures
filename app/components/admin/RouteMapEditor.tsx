'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import SectionCard from './SectionCard';
import FieldGrid from './FieldGrid';

export type RoutePointType = 'start' | 'end' | 'trek' | 'acclimatization' | 'peak' | 'lake' | 'pass' | 'airport' | 'helipad';
export type SegmentType = 'trekking' | 'secondary' | 'driving' | 'flight';
export interface PeakData { name: string; elevation: number; x: number; y: number; }
export interface RoutePointData { id: string; name: string; elevation: number; x: number; y: number; type: RoutePointType; day?: number; }
export interface RouteSegmentData { from: string; to: string; type: SegmentType; }
export interface RouteMapData {
  title?: string;
  subtitle?: string;
  brandName?: string;
  brandTagline?: string;
  footerUrl?: string;
  maxAltitude?: number;
  peaks: PeakData[];
  routePoints: RoutePointData[];
  routeSegments: RouteSegmentData[];
}

export const EMPTY_ROUTE_MAP: RouteMapData = { peaks: [], routePoints: [], routeSegments: [] };

const POINT_TYPES: RoutePointType[] = ['start', 'end', 'trek', 'acclimatization', 'peak', 'lake', 'pass', 'airport', 'helipad'];
const SEGMENT_TYPES: SegmentType[] = ['trekking', 'secondary', 'driving', 'flight'];

const inputCls =
  'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100';

const labelCls = 'block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider';

interface Props {
  value?: RouteMapData;
  onChange: (v: RouteMapData) => void;
}

export default function RouteMapEditor({ value = EMPTY_ROUTE_MAP, onChange }: Props) {
  const d = value;

  const set = (patch: Partial<RouteMapData>) => onChange({ ...d, ...patch });

  const setPeak = (i: number, patch: Partial<PeakData>) =>
    set({ peaks: d.peaks.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });
  const setPoint = (i: number, patch: Partial<RoutePointData>) =>
    set({ routePoints: d.routePoints.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });
  const setSegment = (i: number, patch: Partial<RouteSegmentData>) =>
    set({ routeSegments: d.routeSegments.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });

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

  return (
    <div className="space-y-4">
      {/* Header & Branding */}
      <SectionCard title="Header & Branding" subtitle="Title, altitude, brand and footer link" defaultOpen>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Title override</label>
            <input className={inputCls} value={d.title || ''} placeholder="Defaults to package title"
              onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Subtitle</label>
            <input className={inputCls} value={d.subtitle || ''} placeholder="e.g. Detailed route map with elevation profile"
              onChange={(e) => set({ subtitle: e.target.value })} />
          </div>
          <FieldGrid cols={3}>
            <div>
              <label className={labelCls}>Max altitude (m)</label>
              <input type="number" className={inputCls} value={d.maxAltitude ?? ''} placeholder="e.g. 5545"
                onChange={(e) => set({ maxAltitude: e.target.value === '' ? undefined : Number(e.target.value) })} />
            </div>
            <div>
              <label className={labelCls}>Brand name</label>
              <input className={inputCls} value={d.brandName || ''} placeholder="NEPAL HIKING TEAM"
                onChange={(e) => set({ brandName: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Brand tagline</label>
              <input className={inputCls} value={d.brandTagline || ''} placeholder="Walk, Explore and Discover"
                onChange={(e) => set({ brandTagline: e.target.value })} />
            </div>
          </FieldGrid>
          <div>
            <label className={labelCls}>Footer URL</label>
            <input className={inputCls} value={d.footerUrl || ''} placeholder="www.nepalhikingteam.com"
              onChange={(e) => set({ footerUrl: e.target.value })} />
          </div>
        </div>
      </SectionCard>

      {/* Peaks */}
      <SectionCard
        title="Peaks"
        subtitle={d.peaks.length === 0 ? 'No peaks defined' : `${d.peaks.length} peak${d.peaks.length > 1 ? 's' : ''} defined`}
        action={addBtn(() => set({ peaks: [...d.peaks, { name: '', elevation: 0, x: 0, y: 0 }] }), 'Add Peak')}
      >
        {d.peaks.length === 0 && <p className="text-[11px] text-gray-400 italic">No peaks defined.</p>}
        <div className="space-y-3">
          {d.peaks.map((p, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3 bg-gray-50/50 space-y-2">
              <div className="flex items-center gap-2">
                <input className={inputCls + ' flex-1'} placeholder="Name" value={p.name} onChange={(e) => setPeak(i, { name: e.target.value })} />
                {trashBtn(() => set({ peaks: d.peaks.filter((_, idx) => idx !== i) }))}
              </div>
              <FieldGrid cols={3}>
                <div>
                  <label className={labelCls}>Elevation (m)</label>
                  <input type="number" className={inputCls} placeholder="Elev m" value={p.elevation || ''} onChange={(e) => setPeak(i, { elevation: Number(e.target.value) })} />
                </div>
                <div>
                  <label className={labelCls}>X coordinate</label>
                  <input type="number" className={inputCls} placeholder="X" value={p.x || ''} onChange={(e) => setPeak(i, { x: Number(e.target.value) })} />
                </div>
                <div>
                  <label className={labelCls}>Y coordinate</label>
                  <input type="number" className={inputCls} placeholder="Y" value={p.y || ''} onChange={(e) => setPeak(i, { y: Number(e.target.value) })} />
                </div>
              </FieldGrid>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Route Points */}
      <SectionCard
        title="Route Points"
        subtitle={d.routePoints.length === 0 ? 'No route points defined' : `${d.routePoints.length} point${d.routePoints.length > 1 ? 's' : ''} defined`}
        action={addBtn(() => set({ routePoints: [...d.routePoints, { id: '', name: '', elevation: 0, x: 0, y: 0, type: 'trek' }] }), 'Add Point')}
      >
        {d.routePoints.length === 0 && <p className="text-[11px] text-gray-400 italic">No route points defined.</p>}
        <div className="space-y-3">
          {d.routePoints.map((p, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3 bg-gray-50/50 space-y-2">
              <div className="flex items-center gap-2">
                <input className={inputCls + ' flex-1'} placeholder="Name" value={p.name} onChange={(e) => setPoint(i, { name: e.target.value })} />
                {trashBtn(() => set({ routePoints: d.routePoints.filter((_, idx) => idx !== i) }))}
              </div>
              <FieldGrid cols={3}>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Type</label>
                  <select className={inputCls} value={p.type} onChange={(e) => setPoint(i, { type: e.target.value as RoutePointType })}>
                    {POINT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>ID</label>
                  <input className={inputCls} placeholder="id" value={p.id} onChange={(e) => setPoint(i, { id: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Elev (m)</label>
                  <input type="number" className={inputCls} placeholder="Elev m" value={p.elevation || ''} onChange={(e) => setPoint(i, { elevation: Number(e.target.value) })} />
                </div>
                <div>
                  <label className={labelCls}>X</label>
                  <input type="number" className={inputCls} placeholder="X" value={p.x || ''} onChange={(e) => setPoint(i, { x: Number(e.target.value) })} />
                </div>
                <div>
                  <label className={labelCls}>Y</label>
                  <input type="number" className={inputCls} placeholder="Y" value={p.y || ''} onChange={(e) => setPoint(i, { y: Number(e.target.value) })} />
                </div>
                <div>
                  <label className={labelCls}>Day</label>
                  <input type="number" className={inputCls} placeholder="Day" value={p.day ?? ''} onChange={(e) => setPoint(i, { day: e.target.value === '' ? undefined : Number(e.target.value) })} />
                </div>
              </FieldGrid>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Route Segments */}
      <SectionCard
        title="Route Segments"
        subtitle={d.routeSegments.length === 0 ? 'No route segments defined' : `${d.routeSegments.length} segment${d.routeSegments.length > 1 ? 's' : ''} defined`}
        action={addBtn(() => set({ routeSegments: [...d.routeSegments, { from: '', to: '', type: 'trekking' }] }), 'Add Segment')}
      >
        {d.routeSegments.length === 0 && <p className="text-[11px] text-gray-400 italic">No route segments defined.</p>}
        <div className="space-y-3">
          {d.routeSegments.map((p, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3 bg-gray-50/50 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className={labelCls}>From (point id)</label>
                  <input className={inputCls} placeholder="From (point id)" value={p.from} onChange={(e) => setSegment(i, { from: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>To (point id)</label>
                  <input className={inputCls} placeholder="To (point id)" value={p.to} onChange={(e) => setSegment(i, { to: e.target.value })} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className={labelCls}>Segment type</label>
                  <select className={inputCls} value={p.type} onChange={(e) => setSegment(i, { type: e.target.value as SegmentType })}>
                    {SEGMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                {trashBtn(() => set({ routeSegments: d.routeSegments.filter((_, idx) => idx !== i) }))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}