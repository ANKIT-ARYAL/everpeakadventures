'use client';

import React, { useRef, useEffect, useState, useId } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import RichText from '@/app/components/RichText';

export interface ElevationPoint {
  day: number;
  location: string;
  elevation: number;
  videoTime?: number;
  note?: string;
}

interface VideoSyncedElevationProfileProps {
  elevationData: ElevationPoint[];
  chartTitle?: string;
  className?: string;
}

const W = 980;
const H = 430;
const PAD = { top: 52, right: 28, bottom: 64, left: 72 };
const STEP_MS = 1600;

function stripHtml(value?: string) {
  return (value || '').replace(/<[^>]+>/g, '').trim();
}

function truncate(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max - 1)}...` : value;
}

function buildPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cur = points[i];
    d += ` L ${cur.x} ${cur.y}`;
  }
  return d;
}

export default function VideoSyncedElevationProfile({ elevationData, chartTitle, className = '' }: VideoSyncedElevationProfileProps) {
  const gradientId = useId().replace(/:/g, '');
  const days = (elevationData || []).filter((d) => d).sort((a, b) => (a.day ?? 0) - (b.day ?? 0));

  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  const animationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    if (days.length === 0) return;

    animationTimerRef.current = window.setInterval(() => {
      setActive(prev => {
        if (prev >= days.length - 1) {
          if (animationTimerRef.current) {
            clearInterval(animationTimerRef.current);
            animationTimerRef.current = null;
          }
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, STEP_MS);

    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    };
  }, [playing, days.length]);

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }
    };
  }, []);

  if (days.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-8 ${className}`}>
        <h2 className="text-xl font-bold oswald uppercase text-[#112233] border-b pb-3 mb-6">
          Route Map & Elevation Profile
        </h2>
        <div className="text-center py-12 text-gray-500">
          <p>No elevation data available.</p>
          <p className="text-sm mt-2">Add elevation points in the admin to display the elevation profile.</p>
        </div>
      </div>
    );
  }

  const elivs = days.map((d) => d.elevation ?? 0);
  const rawMaxE = Math.max(...elivs, 1000);
  const maxE = Math.ceil(rawMaxE / 1000) * 1000;
  const minE = 0;
  const span = maxE - minE || 1;

  const points = days.map((d, i) => {
    const x = PAD.left + (i / (days.length - 1 || 1)) * (W - PAD.left - PAD.right);
    const y = PAD.top + (1 - ((d.elevation ?? 0) - minE) / span) * (H - PAD.top - PAD.bottom);
    return { x, y, day: d.day, elev: d.elevation ?? 0, title: d.location, desc: d.note, videoTime: d.videoTime };
  });

  const line = buildPath(points.map(({ x, y }) => ({ x, y })));
  const area = `${line} L ${points[points.length - 1].x} ${H - PAD.bottom - 1} L ${points[0].x} ${H - PAD.bottom - 1} Z`;

  const marker = points[hovered ?? active] ?? points[0];
  const markerNote = stripHtml(marker.desc);
  const tooltipTitle = truncate(`Day ${marker.day} - ${marker.title}`, 26);
  const tooltipNote = truncate(markerNote || 'Route stop', 34);

  const yTicks = Math.min(6, Math.max(4, maxE / 1000));
  const yVals = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round(maxE - (i / yTicks) * span)
  );
  const baseY = H - PAD.bottom;
  const progress = days.length > 1 ? active / (days.length - 1) : 0;

  const selectDay = (i: number) => {
    setActive(Math.max(0, Math.min(days.length - 1, i)));
  };

  const handlePlayPause = () => {
    if (playing) {
      setPlaying(false);
    } else {
      if (active >= days.length - 1) setActive(0);
      setPlaying(true);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-8 ${className}`}>
      <h2 className="text-xl font-bold oswald uppercase text-[#112233] border-b pb-3 mb-6">
        Route Map & Elevation Profile
      </h2>

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="inline-flex w-fit items-center justify-center rounded-md bg-[#112233] px-4 py-2 text-sm font-bold uppercase tracking-wide text-white">
          Altitude Chart
        </div>
        <h3 className="text-2xl md:text-3xl font-black leading-tight text-[#112233]">
          {chartTitle}
        </h3>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-[#dbe7f0] bg-[#f4f8fb] px-3 py-4 md:px-5 md:py-5">
        <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[680px] w-full h-auto" role="img" aria-label="Route elevation profile">
          <defs>
            <linearGradient id={`${gradientId}-areaFill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8fd0b0" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#d9f0e6" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {yVals.map((val, i) => {
            const y = PAD.top + (i / yTicks) * (H - PAD.top - PAD.bottom);
            return (
              <g key={i}>
                <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#c8d9e6" strokeWidth={1} />
                <text x={PAD.left - 18} y={y + 5} textAnchor="end" fontSize="14" fill="#7b8794" fontWeight={700}>
                  {val >= 1000 ? `${Math.round(val / 1000)}k` : val}
                </text>
              </g>
            );
          })}

          {points.map((p, i) => (
            <line key={`x-${i}`} x1={p.x} y1={PAD.top} x2={p.x} y2={baseY} stroke="#c8d9e6" strokeWidth={1} />
          ))}

          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={baseY} stroke="#24a0ed" strokeWidth={1.5} />
          <line x1={PAD.left} y1={baseY} x2={W - PAD.right} y2={baseY} stroke="#24a0ed" strokeWidth={1.5} />

          <text
            x={26}
            y={(PAD.top + baseY) / 2}
            transform={`rotate(-90 26 ${(PAD.top + baseY) / 2})`}
            textAnchor="middle"
            fontSize="13"
            fill="#64748b"
            fontWeight={800}
          >
            HEIGHT IN METERS
          </text>

          {days.map((d, i) => (
            <text
              key={i}
              x={points[i].x}
              y={H - 24}
              textAnchor="middle"
              fontSize="14"
              fill={i === active ? '#24a0ed' : '#7b8794'}
              fontWeight={i === active ? 900 : 700}
            >
              {d.day}
            </text>
          ))}

          <text x={PAD.left - 48} y={H - 24} fontSize="14" fill="#64748b" fontWeight={900}>
            DAYS
          </text>

          <path d={area} fill={`url(#${gradientId}-areaFill)`} />
          <path
            d={line}
            fill="none"
            stroke="#f4c45d"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((p, i) => (
            <g key={i}>
              <text
                x={p.x}
                y={p.y - 14}
                textAnchor="middle"
                fontSize="14"
                fill="#112233"
                fontWeight={900}
                stroke="#fff"
                strokeWidth={3}
                paintOrder="stroke"
              >
                {p.elev.toLocaleString()}
              </text>
              <circle
                cx={p.x}
                cy={p.y}
                r={i === active ? 8 : 6}
                fill="#24a0ed"
                stroke="#fff"
                strokeWidth={2.5}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => selectDay(i)}
              />
            </g>
          ))}

          <circle cx={marker.x} cy={marker.y} r={11} fill="none" stroke="#f4c45d" strokeWidth={4} />
          <circle cx={marker.x} cy={marker.y} r={7} fill="#24a0ed" stroke="#fff" strokeWidth={2.5} />

          <g transform={`translate(${Math.min(Math.max(marker.x - 72, PAD.left + 16), W - 294)}, ${Math.max(marker.y - 92, PAD.top + 8)})`}>
            <rect width={278} height={76} rx={10} fill="#fff" stroke="#e5e7eb" strokeWidth={1.2} filter="drop-shadow(0 4px 8px rgb(15 23 42 / 0.08))" />
            <text x={18} y={31} fontSize="15" fill="#112233" fontWeight={900}>
              {tooltipTitle} ({marker.elev.toLocaleString()} m)
            </text>
            <text x={18} y={56} fontSize="13" fill="#64748b" fontWeight={500}>
              {tooltipNote}
            </text>
          </g>
        </svg>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 items-center gap-4 md:grid-cols-[auto_minmax(0,1fr)_auto]">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handlePlayPause}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#24a0ed] px-5 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-[#112233] active:scale-[0.98]"
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            {playing ? 'Pause Tour' : 'Play Tour'}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setActive(0);
              setHovered(null);
            }}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-bold uppercase tracking-wide text-[#112233] transition-colors hover:border-[#24a0ed] hover:text-[#24a0ed] active:scale-[0.98]"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="h-2 rounded-full bg-[#e6eef5]">
          <div className="h-full rounded-full bg-[#112233]" style={{ width: `${Math.max(6, progress * 100)}%` }} />
        </div>

        <p className="text-sm font-semibold text-gray-500 md:text-right">
          Day {marker.day} - {marker.title} - {marker.elev.toLocaleString()} m
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-[minmax(220px,0.95fr)_minmax(0,1.65fr)]">
        <div className="rounded-xl border border-gray-100 bg-[#f8f9fc] p-5 min-h-[200px]">
          <div className="mb-4 text-[11px] font-black uppercase tracking-widest text-[#24a0ed]">
            Day {marker.day} Note
          </div>
          <h4 className="text-xl font-black text-[#112233]">
            {marker.title} - {marker.elev.toLocaleString()} m
          </h4>
          {marker.desc ? (
            <RichText html={marker.desc} className="mt-4 text-[14px] leading-relaxed text-gray-600" />
          ) : (
            <p className="mt-4 text-[14px] leading-relaxed text-gray-600">Elevation point for this day.</p>
          )}
          {marker.videoTime !== undefined && (
            <div className="mt-4 inline-flex items-center rounded bg-white px-2.5 py-1 text-[11px] font-bold text-gray-500 ring-1 ring-gray-100">
              Time: {Math.floor(marker.videoTime / 60)}:{String(Math.floor(marker.videoTime % 60)).padStart(2, '0')}
            </div>
          )}
        </div>

        <div className="max-h-[260px] overflow-y-auto rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="space-y-1">
            {points.map((point, i) => (
              <button
                key={`${point.day}-${point.title}`}
                type="button"
                onClick={() => selectDay(i)}
                className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
                  i === active
                    ? 'border-l-4 border-[#24a0ed] bg-[#f4f8fb]'
                    : 'border-l-4 border-transparent hover:bg-[#f6fafc]'
                }`}
              >
                <div className="text-[15px] font-bold text-[#112233]">
                  Day {point.day} - {point.title} ({point.elev.toLocaleString()} m)
                </div>
                {point.desc && (
                  <div className="mt-1 line-clamp-1 text-[14px] text-gray-500">
                    {stripHtml(point.desc)}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
