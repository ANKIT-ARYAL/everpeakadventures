'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

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
  'w-full px-2 py-1 border border-gray-200 rounded text-xs';

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

  const header = (
    <h3 className="font-bold text-gray-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
      Detailed Route Map
    </h3>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
      {header}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div><label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Title override</label>
          <input className={inputCls} value={d.title || ''} placeholder="Defaults to package title"
            onChange={(e) => set({ title: e.target.value })} /></div>
        <div><label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Subtitle</label>
          <input className={inputCls} value={d.subtitle || ''} placeholder="e.g. Detailed route map with elevation profile"
            onChange={(e) => set({ subtitle: e.target.value })} /></div>
        <div><label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Max altitude (m)</label>
          <input type="number" className={inputCls} value={d.maxAltitude ?? ''} placeholder="e.g. 5545"
            onChange={(e) => set({ maxAltitude: e.target.value === '' ? undefined : Number(e.target.value) })} /></div>
        <div><label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Brand name</label>
          <input className={inputCls} value={d.brandName || ''} placeholder="NEPAL HIKING TEAM"
            onChange={(e) => set({ brandName: e.target.value })} /></div>
        <div><label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Brand tagline</label>
          <input className={inputCls} value={d.brandTagline || ''} placeholder="Walk, Explore and Discover"
            onChange={(e) => set({ brandTagline: e.target.value })} /></div>
        <div><label className="block font-bold text-gray-600 mb-1 text-[10px] uppercase tracking-wider">Footer URL</label>
          <input className={inputCls} value={d.footerUrl || ''} placeholder="www.nepalhikingteam.com"
            onChange={(e) => set({ footerUrl: e.target.value })} /></div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-gray-700 uppercase tracking-wider text-xs">Peaks</h4>
          <button type="button" onClick={() => set({ peaks: [...d.peaks, { name: '', elevation: 0, x: 0, y: 0 }] })} className="bg-[#112233] text-white px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Peak
          </button>
        </div>
        {d.peaks.length === 0 && <p className="text-[11px] text-gray-400 italic">No peaks defined.</p>}
        <div className="space-y-2">
          {d.peaks.map((p, i) => (
            <div key={i} className="flex items-center gap-2 flex-wrap">
              <input className={inputCls + ' flex-1 min-w-[120px]'} placeholder="Name" value={p.name} onChange={(e) => setPeak(i, { name: e.target.value })} />
              <input type="number" className={inputCls + ' w-24'} placeholder="Elev m" value={p.elevation || ''} onChange={(e) => setPeak(i, { elevation: Number(e.target.value) })} />
              <input type="number" className={inputCls + ' w-16'} placeholder="X" value={p.x || ''} onChange={(e) => setPeak(i, { x: Number(e.target.value) })} />
              <input type="number" className={inputCls + ' w-16'} placeholder="Y" value={p.y || ''} onChange={(e) => setPeak(i, { y: Number(e.target.value) })} />
              <button type="button" onClick={() => set({ peaks: d.peaks.filter((_, idx) => idx !== i) })} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-gray-700 uppercase tracking-wider text-xs">Route Points</h4>
          <button type="button" onClick={() => set({ routePoints: [...d.routePoints, { id: '', name: '', elevation: 0, x: 0, y: 0, type: 'trek' }] })} className="bg-[#112233] text-white px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Point
          </button>
        </div>
        {d.routePoints.length === 0 && <p className="text-[11px] text-gray-400 italic">No route points defined.</p>}
        <div className="space-y-2">
          {d.routePoints.map((p, i) => (
            <div key={i} className="flex items-center gap-2 flex-wrap">
              <input className={inputCls + ' w-20'} placeholder="id" value={p.id} onChange={(e) => setPoint(i, { id: e.target.value })} />
              <input className={inputCls + ' flex-1 min-w-[80px]'} placeholder="Name" value={p.name} onChange={(e) => setPoint(i, { name: e.target.value })} />
              <input type="number" className={inputCls + ' w-24'} placeholder="Elev m" value={p.elevation || ''} onChange={(e) => setPoint(i, { elevation: Number(e.target.value) })} />
              <input type="number" className={inputCls + ' w-16'} placeholder="X" value={p.x || ''} onChange={(e) => setPoint(i, { x: Number(e.target.value) })} />
              <input type="number" className={inputCls + ' w-16'} placeholder="Y" value={p.y || ''} onChange={(e) => setPoint(i, { y: Number(e.target.value) })} />
              <select className={inputCls + ' w-32'} value={p.type} onChange={(e) => setPoint(i, { type: e.target.value as RoutePointType })}>
                {POINT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="number" className={inputCls + ' w-14'} placeholder="Day" value={p.day ?? ''} onChange={(e) => setPoint(i, { day: e.target.value === '' ? undefined : Number(e.target.value) })} />
              <button type="button" onClick={() => set({ routePoints: d.routePoints.filter((_, idx) => idx !== i) })} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-gray-700 uppercase tracking-wider text-xs">Route Segments</h4>
          <button type="button" onClick={() => set({ routeSegments: [...d.routeSegments, { from: '', to: '', type: 'trekking' }] })} className="bg-[#112233] text-white px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Segment
          </button>
        </div>
        {d.routeSegments.length === 0 && <p className="text-[11px] text-gray-400 italic">No route segments defined.</p>}
        <div className="space-y-2">
          {d.routeSegments.map((p, i) => (
            <div key={i} className="flex items-center gap-2 flex-wrap">
              <input className={inputCls + ' w-40'} placeholder="From (point id)" value={p.from} onChange={(e) => setSegment(i, { from: e.target.value })} />
              <span className="text-gray-400">→</span>
              <input className={inputCls + ' w-40'} placeholder="To (point id)" value={p.to} onChange={(e) => setSegment(i, { to: e.target.value })} />
              <select className={inputCls + ' w-32'} value={p.type} onChange={(e) => setSegment(i, { type: e.target.value as SegmentType })}>
                {SEGMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <button type="button" onClick={() => set({ routeSegments: d.routeSegments.filter((_, idx) => idx !== i) })} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}