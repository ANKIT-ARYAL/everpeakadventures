'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Day {
  day: number;
  title: string;
  desc?: string;
  elev?: number;
}

interface Props {
  itinerary: Day[];
  chartTitle?: string;
}

const W = 780;
const H = 300;
const PAD = { top: 30, right: 30, bottom: 44, left: 56 };
const STEP_MS = 1600;

function buildPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const mx = (prev.x + cur.x) / 2;
    d += ` C ${mx} ${prev.y}, ${mx} ${cur.y}, ${cur.x} ${cur.y}`;
  }
  return d;
}

export default function RouteMap({ itinerary, chartTitle }: Props) {
  const days = (itinerary || []).filter((d) => d).sort((a, b) => (a.day ?? 0) - (b.day ?? 0));

  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    setActive(0);
    setPlaying(false);
  }, [itinerary]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setActive((a) => {
        if (a >= days.length - 1) {
          setPlaying(false);
          return a;
        }
        return a + 1;
      });
    }, STEP_MS);
    return () => clearInterval(id);
  }, [playing, days.length]);

  if (days.length === 0) return null;

  const elivs = days.map((d) => d.elev ?? 0);
  const maxE = Math.max(...elivs, 500);
  const minE = Math.min(...elivs, 0);
  const span = maxE - minE || 1;

  const points = days.map((d, i) => {
    const x = PAD.left + (i / (days.length - 1 || 1)) * (W - PAD.left - PAD.right);
    const y = PAD.top + (1 - ((d.elev ?? 0) - minE) / span) * (H - PAD.top - PAD.bottom);
    return { x, y, day: d.day, elev: d.elev ?? 0, title: d.title, desc: d.desc };
  });

  const line = buildPath(points.map(({ x, y }) => ({ x, y })));
  const area = `${line} L ${points[points.length - 1].x} ${H - PAD.bottom - 1} L ${points[0].x} ${
    H - PAD.bottom - 1
  } Z`;

  const marker = points[hovered ?? active] ?? points[0];

  const yTicks = 5;
  const yVals = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round(maxE - (i / yTicks) * span)
  );

  const selectDay = useCallback(
    (i: number) => {
      setActive(Math.max(0, Math.min(days.length - 1, i)));
    },
    [days.length]
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8">
      <h2 className="text-lg md:text-xl font-bold oswald uppercase text-[#112233] border-b pb-3 mb-6">
        Route Map &amp; Elevation Profile
      </h2>

      {/* Title + Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <p className="text-[11px] text-gray-400 uppercase tracking-wide font-bold">Elevation Chart</p>
          <h3 className="text-sm font-bold text-[#112233]">{chartTitle}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (playing) setPlaying(false);
              else {
                if (active >= days.length - 1) setActive(0);
                setPlaying(true);
              }
            }}
            className="inline-flex items-center gap-2 bg-[#24a0ed] hover:bg-[#112233] text-white font-bold px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-colors"
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {playing ? 'Pause Tour' : 'Play Tour'}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setActive(0);
              setHovered(null);
            }}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="relative w-full overflow-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Route elevation profile">
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#24a0ed" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#24a0ed" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* grid + y labels */}
          {yVals.map((val, i) => {
            const y = PAD.top + (i / yTicks) * (H - PAD.top - PAD.bottom);
            return (
              <g key={i}>
                <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#eef2f6" strokeWidth={1} />
                <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
                  {val} m
                </text>
              </g>
            );
          })}

          {/* x day labels */}
          {days.map((d, i) => (
            <text
              key={i}
              x={points[i].x}
              y={H - 16}
              textAnchor="middle"
              fontSize="10"
              fill={i === active ? '#24a0ed' : '#9ca3af'}
              fontWeight={i === active ? 800 : 400}
            >
              {d.day}
            </text>
          ))}

          {/* mountain silhouette graph */}
          <g>
            <path
              d={`M 0 ${H - PAD.bottom + 2} L 55 ${H - PAD.bottom - 95} L 115 ${H - PAD.bottom - 20} L 205 ${H - PAD.bottom - 165} L 300 ${H - PAD.bottom - 45} L 385 ${H - PAD.bottom - 205} L 470 ${H - PAD.bottom - 60} L 555 ${H - PAD.bottom - 185} L 660 ${H - PAD.bottom - 40} L ${W} ${H - PAD.bottom + 2} Z`}
              fill="#ecf3f8"
            />
            <path
              d={`M 0 ${H - PAD.bottom + 2} L 55 ${H - PAD.bottom - 95} L 115 ${H - PAD.bottom - 20} L 205 ${H - PAD.bottom - 165}`}
              fill="none"
              stroke="#dbe7f0"
              strokeWidth={1.5}
            />
            <path
              d={`M 205 ${H - PAD.bottom - 165} L 300 ${H - PAD.bottom - 45} L 385 ${H - PAD.bottom - 205}`}
              fill="none"
              stroke="#dbe7f0"
              strokeWidth={1.5}
            />
            <text
              x="385"
              y={H - PAD.bottom - 230}
              textAnchor="middle"
              fontSize="12"
              fontWeight={700}
              fill="#24a0ed"
            >
              {maxE.toLocaleString()} m
            </text>
          </g>

          {/* area + line */}
          <path d={area} fill="url(#areaFill)" />
          <path
            d={line}
            fill="none"
            stroke="#24a0ed"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* dots */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === active ? 6 : 3.5}
              fill={i === active ? '#112233' : '#24a0ed'}
              stroke="#fff"
              strokeWidth={i === active ? 2 : 1.5}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => selectDay(i)}
            />
          ))}

          {/* marker */}
          <circle cx={marker.x} cy={marker.y} r={8} fill="#24a0ed" fillOpacity={0.2} />
          <circle cx={marker.x} cy={marker.y} r={4.5} fill="#24a0ed" stroke="#fff" strokeWidth={2} />

          {/* tooltip */}
          {(hovered !== null || playing) && hovered !== active ? (
            <g transform={`translate(${marker.x}, ${marker.y - 14})`}>
              <rect x={-34} y={-34} width={68} height={28} rx={6} fill="#112233" />
              <text x={0} y={-16} textAnchor="middle" fontSize="11" fill="#fff" fontWeight={700}>
                Day {marker.day}
              </text>
            </g>
          ) : null}
        </svg>
      </div>

      {/* synced day description */}
      <div className="mt-4 border border-gray-100 bg-gray-50 rounded-xl p-4 min-h-[96px] flex flex-col justify-center">
        <div className="flex items-center justify-between mb-1">
          <span className="inline-flex items-center gap-2 text-[11px] text-[#24a0ed] font-black uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#24a0ed]" />
            Day {marker.day}
          </span>
          <span className="text-[11px] text-gray-400 font-bold">{marker.elev.toLocaleString()} m</span>
        </div>
        <h4 className="font-bold text-sm text-[#112233]">{marker.title}</h4>
        {marker.desc && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{marker.desc}</p>}
      </div>
    </div>
  );
}