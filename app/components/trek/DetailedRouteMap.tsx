'use client';

import React from 'react';

export interface RoutePoint {
  id: string;
  name: string;
  elevation: number;
  x: number;
  y: number;
  type: 'start' | 'end' | 'trek' | 'acclimatization' | 'peak' | 'lake' | 'pass' | 'airport' | 'helipad';
  day?: number;
}

export interface RouteSegment {
  from: string;
  to: string;
  type: 'trekking' | 'secondary' | 'driving' | 'flight';
}

export interface Peak {
  name: string;
  elevation: number;
  x: number;
  y: number;
}

export interface ElevationDay {
  day: number;
  location: string;
  elevation: number;
  distance?: string;
}

export interface DetailedRouteMapProps {
  title: string;
  subtitle?: string;
  brandName?: string;
  brandTagline?: string;
  brandLogo?: React.ReactNode;
  peaks?: Peak[];
  routePoints?: RoutePoint[];
  routeSegments?: RouteSegment[];
  elevationData?: ElevationDay[];
  maxAltitude?: number;
  mapWidth?: number;
  mapHeight?: number;
  showLegend?: boolean;
  showElevationProfile?: boolean;
  showInlayMap?: boolean;
  footerUrl?: string;
}

const DEFAULT_LEGEND_ITEMS = [
  { label: 'Trekking Route', type: 'line', style: 'solid', color: '#1e3a8a' },
  { label: 'Secondary Route', type: 'line', style: 'dashed', color: '#3b82f6' },
  { label: 'Driving Route', type: 'line', style: 'dotted', color: '#64748b' },
  { label: 'Flight', type: 'icon', icon: '✈', color: '#f97316' },
  { label: 'Lake', type: 'icon', icon: '🌊', color: '#06b6d4' },
  { label: 'Pass', type: 'icon', icon: '✕', color: '#ef4444' },
  { label: 'Trek Start Point', type: 'icon', icon: '🏃', color: '#22c55e' },
  { label: 'Final Destination', type: 'icon', icon: '🏁', color: '#ef4444' },
  { label: 'Airport', type: 'icon', icon: '✈', circle: true, color: '#8b5cf6' },
  { label: 'Helipad', type: 'icon', icon: 'H', circle: true, color: '#ec4899' },
  { label: 'Peak', type: 'icon', icon: '▲', color: '#f59e0b' },
  { label: 'Arrival', type: 'icon', icon: '1', circle: true, color: '#f97316' },
  { label: 'Departure', type: 'icon', icon: '17', circle: true, color: '#ef4444' },
];

const POINT_ICONS: Record<string, React.ReactNode> = {
  start: <circle cx={0} cy={0} r={6} fill="#22c55e" />,
  end: <circle cx={0} cy={0} r={6} fill="#ef4444" />,
  trek: <circle cx={0} cy={0} r={5} fill="#1e3a8a" />,
  acclimatization: <circle cx={0} cy={0} r={5} fill="#3b82f6" />,
  peak: <polygon points="0,-6 5,3 -5,3" fill="#f59e0b" />,
  lake: <circle cx={0} cy={0} r={5} fill="#06b6d4" />,
  pass: <text x="0" y="3" fontSize="10" textAnchor="middle" fill="#ef4444" fontWeight="bold">✕</text>,
  airport: <circle cx={0} cy={0} r={8} fill="none" stroke="#8b5cf6" strokeWidth="2" />,
  helipad: <text x="0" y="4" fontSize="10" textAnchor="middle" fontWeight="bold" fill="#ec4899">H</text>,
};

const POINT_COLORS: Record<string, string> = {
  start: '#22c55e',
  end: '#ef4444',
  trek: '#1e3a8a',
  acclimatization: '#3b82f6',
  peak: '#f59e0b',
  lake: '#06b6d4',
  pass: '#ef4444',
  airport: '#8b5cf6',
  helipad: '#ec4899',
};

const SEGMENT_STYLES: Record<string, { color: string; width: number; dash: string }> = {
  trekking: { color: '#1e3a8a', width: 3, dash: 'none' },
  secondary: { color: '#3b82f6', width: 2, dash: '8,4' },
  driving: { color: '#64748b', width: 2, dash: '4,4' },
  flight: { color: '#f97316', width: 2, dash: '12,6' },
};

export default function DetailedRouteMap({
  title,
  subtitle,
  brandName = 'NEPAL HIKING TEAM',
  brandTagline = 'Walk, Explore and Discover',
  brandLogo,
  peaks = [],
  routePoints = [],
  routeSegments = [],
  elevationData = [],
  maxAltitude,
  mapWidth = 900,
  mapHeight = 550,
  showLegend = true,
  showElevationProfile = true,
  showInlayMap = true,
  footerUrl = 'www.nepalhikingteam.com',
}: DetailedRouteMapProps) {
  const getPoint = (id: string) => routePoints.find(p => p.id === id);
  
  const drawPath = (fromId: string, toId: string, type: string) => {
    const from = getPoint(fromId);
    const to = getPoint(toId);
    if (!from || !to) return null;
    
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const style = SEGMENT_STYLES[type] || SEGMENT_STYLES.trekking;
    
    return (
      <path
        key={fromId + '-' + toId}
        d={'M ' + from.x + ' ' + from.y + ' Q ' + midX + ' ' + (midY - 30) + ' ' + to.x + ' ' + to.y}
        stroke={style.color}
        strokeWidth={style.width}
        strokeDasharray={style.dash}
        fill="none"
        opacity={0.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };

  const renderPoint = (point: RoutePoint) => {
    const isStart = point.type === 'start';
    const isEnd = point.type === 'end';
    
    return (
      <g key={point.id} transform={'translate(' + point.x + ', ' + point.y + ')'}>
        {isStart && (
          <circle cx={-15} cy={-15} r={10} fill="#f97316" stroke="white" strokeWidth="2" />
        )}
        {isEnd && (
          <circle cx={15} cy={-15} r={10} fill="#ef4444" stroke="white" strokeWidth="2" />
        )}
        {POINT_ICONS[point.type] || POINT_ICONS.trek}
        <text x={12} y={4} fontSize="9" fill="#1e293b" fontWeight="500">
          {point.name}
        </text>
        {point.elevation > 0 && (
          <text x={12} y={14} fontSize="8" fill="#64748b">
            {point.elevation}m
          </text>
        )}
      </g>
    );
  };

  const minElevation = elevationData.length > 0 
    ? Math.min(...elevationData.map(d => d.elevation)) 
    : 1000;
  const maxElevationData = elevationData.length > 0
    ? Math.max(...elevationData.map(d => d.elevation))
    : 6000;
  const elevationRange = Math.max(maxElevationData - minElevation, 1000);
  const elevationBase = minElevation - 500;

  const yScale = (elev: number) => 
    mapHeight - (elev - elevationBase) / elevationRange * mapHeight + 20;

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header with Title */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center">
                  {brandLogo || (
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5L12 2zm0 2.18l3.6 1.8-1.83 6.13c.37.22.75.44 1.13.67C17.4 14.3 14.97 17 12 17c-4.2 0-8-3.8-8-8s3.8-8 8-8c1.77 0 3.36.6 4.53 1.61L13.6 4.8 12 3.02z"/>
                    </svg>
                  )}
                </div>
                <div>
                  <div className="font-bold text-lg text-[#112233] oswald">{brandName}</div>
                  <div className="text-xs text-gray-500">{brandTagline}</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-xl md:text-2xl font-bold oswald uppercase text-[#112233] tracking-wide">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Map Area */}
        <div className="relative p-4" style={{ height: `${mapHeight}px` }}>
          {/* Watermark */}
          <svg width="100%" height="100%" viewBox={'0 0 ' + mapWidth + ' ' + mapHeight} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity: 0.08 }}>
            <text
              x={mapWidth / 2}
              y={mapHeight / 2}
              fontSize="70"
              fill="#94a3b8"
              textAnchor="middle"
              dominantBaseline="middle"
              fontWeight="bold"
              fontFamily="oswald, sans-serif"
              transform={'rotate(-15, ' + mapWidth / 2 + ', ' + mapHeight / 2 + ')'}
            >
              {brandName}
            </text>
          </svg>

          <svg width={mapWidth} height={mapHeight} viewBox={'0 0 ' + mapWidth + ' ' + mapHeight} className="w-full h-auto" style={{ maxWidth: '100%' }}>
            {/* Route Paths */}
            <g strokeLinecap="round" strokeLinejoin="round">
              {routeSegments.map(seg => drawPath(seg.from, seg.to, seg.type))}
            </g>

            {/* Peaks */}
            <g fontSize="8" fill="#1e293b" fontWeight="500">
              {peaks.map((peak, i) => (
                <g key={peak.name} transform={'translate(' + peak.x + ', ' + peak.y + ')'}>
                  <polygon points="0,-4 3,2 -3,2" fill="#ef4444" />
                  <text x={6} y={0} fontSize="7" fill="#334155">
                    {peak.name} {peak.elevation}m
                  </text>
                </g>
              ))}
            </g>

            {/* Route Points */}
            <g>
              {routePoints.map(renderPoint)}
            </g>

            {/* Compass - Top Right */}
            <g transform={'translate(' + (mapWidth - 60) + ', 60)'}>
              <circle cx={0} cy={0} r={22} fill="white" stroke="#cbd5e1" strokeWidth="1.5" />
              <polygon points="0,-18 -4,-6 0,0 4,-6" fill="#ef4444" />
              <polygon points="0,18 -4,6 0,0 4,6" fill="#94a3b8" />
              <polygon points="-18,0 -6,-4 0,0 -6,4" fill="#94a3b8" />
              <polygon points="18,0 6,-4 0,0 6,4" fill="#94a3b8" />
              <text x={0} y={30} fontSize="10" fontWeight="bold" fill="#1e293b" textAnchor="middle">N</text>
            </g>

            {/* Inlay Map */}
            {showInlayMap && (
              <g transform={'translate(' + (mapWidth - 180) + ', ' + (mapHeight - 180) + ')'} opacity="0.8">
                <rect x={0} y={0} width={150} height={150} fill="#f8fafc" stroke="#cbd5e1" rx={4} />
                <text x={75} y={20} fontSize="9" fontWeight="bold" fill="#1e293b" textAnchor="middle">NEPAL</text>
                <ellipse cx={75} cy={95} rx={50} ry={40} fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                <ellipse cx={75} cy={85} rx={15} ry={10} fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                <text x={75} y={140} fontSize="7" fill="#64748b" textAnchor="middle">Trekking Region</text>
              </g>
            )}

            {/* Footer URL */}
            <text 
              x={mapWidth / 2} 
              y={mapHeight - 10} 
              fontSize="9" 
              fill="#64748b" 
              textAnchor="middle"
              fontFamily="monospace"
            >
              {footerUrl}
            </text>
          </svg>

          {/* Legend - Top Left Overlay */}
          {showLegend && (
            <div className="absolute top-16 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 p-3 shadow-lg min-w-[200px] max-w-[220px]">
              {maxAltitude && (
                <div className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-2 border-b pb-2 text-red-600">
                  Max. Altitude: {maxAltitude}m
                </div>
              )}
              <div className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-2 border-b pb-2">LEGEND & SYMBOLS</div>
              <div className="space-y-1.5 text-[9px] text-gray-600">
                {DEFAULT_LEGEND_ITEMS.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {item.type === 'line' && (
                      <div className="w-8 h-1" style={{
                        background: item.color,
                        borderTop: item.style === 'dashed' ? '2px dashed' : item.style === 'dotted' ? '2px dotted' : '2px solid'
                      }} />
                    )}
                    {item.type === 'icon' && (
                      <div className="w-6 h-6 flex items-center justify-center text-xs" style={{ color: item.color }}>
                        {item.circle && (
                          <svg width="6" height="6" viewBox="0 0 6 6">
                            <circle cx="3" cy="3" r="3" fill={item.color} />
                          </svg>
                        )}
                        {!item.circle && item.icon}
                      </div>
                    )}
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Arrival/Departure Badges */}
          <div className="absolute top-16 right-4 z-10 flex flex-col gap-1">
            <div className="bg-orange-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">1</div>
            <div className="bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">17</div>
          </div>
        </div>

        {/* Elevation Profile Chart */}
        {showElevationProfile && elevationData.length > 0 && (
          <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold oswald uppercase text-[#112233] text-sm">Elevation Profile</h3>
            </div>
            <div className="p-4" style={{ height: '240px' }}>
              <svg width="100%" height="240" viewBox={`0 0 800 240`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="elevationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fef3c7" />
                    <stop offset="50%" stopColor="#fde68a" />
                    <stop offset="100%" stopColor="#fcd34d" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                
                {/* Grid Lines */}
                <g stroke="#e2e8f0" strokeWidth="0.5">
                  {Array.from({ length: 6 }, (_, i) => minElevation + i * (elevationRange / 5)).map(h => (
                    <line 
                      key={h} 
                      x1={60} y1={yScale(h)} 
                      x2={780} y2={yScale(h)} 
                    />
                  ))}
                  {elevationData.map((d, i) => (
                    <line 
                      key={d.day} 
                      x1={60 + i * 42} y1={20} 
                      x2={60 + i * 42} y2={220} 
                    />
                  ))}
                </g>

                {/* Y-Axis Labels */}
                <g fontSize="9" fill="#64748b" textAnchor="end" dominantBaseline="middle">
                  {Array.from({ length: 6 }, (_, i) => minElevation + i * (elevationRange / 5)).map(h => (
                    <text 
                      key={h} 
                      x={55} 
                      y={yScale(h)}
                    >
                      {h >= 1000 ? Math.round(h/1000) + 'k' : h}m
                    </text>
                  ))}
                  <text x={30} y={120} textAnchor="middle" transform="rotate(-90, 30, 120)" fontSize="9" fill="#64748b">
                    Heights In Meters
                  </text>
                </g>

                {/* Area under curve */}
                <path
                  d={[
                    'M 60 220',
                    ...elevationData.map((d, i) => 
                      'L ' + (60 + i * 42) + ' ' + yScale(d.elevation)
                    ),
                    'L ' + (60 + (elevationData.length - 1) * 42) + ' 220',
                    'Z'
                  ].join(' ')}
                  fill="url(#elevationGradient)"
                  stroke="none"
                />

                {/* Elevation Line */}
                <path
                  d={[
                    'M 60 ' + yScale(elevationData[0].elevation),
                    ...elevationData.map((d, i) => 
                      'L ' + (60 + i * 42) + ' ' + yScale(d.elevation)
                    )
                  ].join(' ')}
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                <g>
                  {elevationData.map((d, i) => (
                    <g key={d.day} transform={`translate(${60 + i * 42}, ${yScale(d.elevation)})`}>
                      <circle r={4} fill="#f59e0b" stroke="white" strokeWidth="2" />
                      {d.distance && (
                        <text x={0} y={-10} fontSize="7" fill="#64748b" textAnchor="middle">{d.distance}</text>
                      )}
                    </g>
                  ))}
                </g>

                {/* X-Axis Labels */}
                <g fontSize="8" fill="#64748b" textAnchor="middle" dominantBaseline="hanging">
                  {elevationData.map((d, i) => (
                    <g key={d.day} transform={`translate(${60 + i * 42}, 225)`}>
                      <text y={0} fontSize="9" fontWeight={d.day === elevationData.length ? 'bold' : 'normal'} fill={d.day === elevationData.length ? '#ef4444' : '#64748b'}>
                        {d.day}
                      </text>
                      <text y={14} fontSize="6" fill="#94a3b8" textAnchor="middle" style={{ whiteSpace: 'nowrap' }}>
                        {d.location}
                      </text>
                    </g>
                  ))}
                </g>

                {/* X-Axis Title */}
                <text x={400} y={235} fontSize="9" fill="#64748b" textAnchor="middle" fontWeight="500">
                  DAYS
                </text>
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}