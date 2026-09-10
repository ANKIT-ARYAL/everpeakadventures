/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem } from '../animations/Motion';

interface FixedDeparturesProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  label?: string;
  title?: string;
  embedded?: boolean;
}

export default function FixedDepartures({ data = [], label, title, embedded = false }: FixedDeparturesProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>('All');

  const getMonthYear = (dateStr: string) => {
    if (!dateStr) return null;

    // Try native parse first (handles ISO and many locale strings)
    const parsed = Date.parse(dateStr);
    if (!isNaN(parsed)) {
      const d = new Date(parsed);
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    // Fallback: try to parse common formatted strings like "Sep 11, 2026" or "September 11, 2026" or "September 2026"
    const shortMonthRegex = /^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/; // e.g. Sep 11, 2026
    const monthYearRegex = /^([A-Za-z]+)\s*(\d{4})$/; // e.g. September 2026
    const m1 = dateStr.match(shortMonthRegex);
    if (m1) {
      const monthName = m1[1];
      const day = Number(m1[2]);
      const year = Number(m1[3]);
      const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
      if (!Number.isNaN(monthIndex)) {
        return new Date(year, monthIndex, day).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      }
    }
    const m2 = dateStr.match(monthYearRegex);
    if (m2) {
      const monthName = m2[1];
      const year = Number(m2[2]);
      const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
      if (!Number.isNaN(monthIndex)) {
        return new Date(year, monthIndex, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      }
    }

    return null;
  };

  const availableMonths = useMemo(() => {
    const months = data
      .map(trip => getMonthYear(trip.startDate))
      .filter((month): month is string => month !== null);

    // Unique
    const unique = Array.from(new Set(months));

    // Sort chronologically ascending using a reliable parse (prepend day 1)
    unique.sort((a, b) => {
      const ta = Date.parse('1 ' + a);
      const tb = Date.parse('1 ' + b);
      return (isNaN(ta) ? 0 : ta) - (isNaN(tb) ? 0 : tb);
    });

    return unique;
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedMonth === 'All') return data;
    return data.filter(trip => getMonthYear(trip.startDate) === selectedMonth);
  }, [data, selectedMonth]);

  // Pagination
  const PAGE_SIZE = 4;
  const [page, setPage] = useState<number>(0);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));

  // Reset page when filter changes
  React.useEffect(() => setPage(0), [selectedMonth]);

  // Clamp page when filteredData size / totalPages change to avoid empty pages
  React.useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages]);

  const paginated = filteredData.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <section
      id="departures"
      className={
        embedded
          ? "scroll-mt-[118px] rounded-2xl bg-foreground p-5 md:p-8 overflow-hidden min-w-0"
          : "scroll-mt-[118px] py-24 px-6 bg-foreground min-w-0"
      }
    >
      <div className={embedded ? "min-w-0" : "px-5 lg:px-20 max-w-[1400px] mx-auto w-full min-w-0"}>
        
        {/* Header Section */}
        <Reveal className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 min-w-0">
          <div className="min-w-0 flex-1">
            <h2 className={`${embedded ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'} font-display font-medium text-background tracking-tight mb-2 break-words`}>
              {title ?? 'Fixed Departures'}
            </h2>
            <p className="font-sans text-background/70 text-base md:text-lg break-words">
              {label ?? 'Join a scheduled group trek and share the adventure.'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 flex-wrap">
            <button 
              onClick={() => setSelectedMonth('All')}
              className={`px-5 py-2.5 rounded-full text-sm sm:text-base font-semibold transition-colors cursor-pointer ${
                selectedMonth === 'All' 
                  ? 'bg-background text-foreground' 
                  : 'bg-background/10 text-background hover:bg-background/20'
              }`}
            >
              All
            </button>

            <div className="relative">
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none bg-background/10 text-background px-5 py-2.5 pr-10 rounded-full text-sm sm:text-base font-semibold outline-none cursor-pointer hover:bg-background/20 transition-colors border border-transparent"
              >
                <option value="All" className="text-gray-900 bg-white">Filter by Month</option>
                {availableMonths.map((month) => (
                  <option key={month} value={month} className="text-gray-900 bg-white">{month}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-background/50">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M7 10l5 5 5-5z"/></svg>
              </div>
            </div>
          </div>
        </Reveal>

        {/* List Section */}
        <div className="border-t border-background/10 min-w-0">
          <Stagger className="flex flex-col min-w-0">
            {filteredData.length === 0 ? (
              <div className="py-24 text-center text-background/50 font-sans">
                No departures found for {selectedMonth}.
              </div>
            ) : (
              paginated.map((trip) => (
                <StaggerItem
                  key={trip.id} 
                  className="group grid grid-cols-1 md:grid-cols-12 items-center gap-4 py-5 border-b border-background/10 hover:bg-background/5 transition-colors px-4 -mx-4 rounded-xl min-w-0 overflow-hidden"
                >
                  {/* Column 1: Image & Title (Span 5) */}
                  <div className="flex items-center gap-4 md:col-span-5 min-w-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-background/10 border border-background/10 flex items-center justify-center">
                      <img 
                        src={trip.heroImage || "https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:259/h:68/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png"} 
                        alt={trip.title}
                        className={`w-full h-full ${!trip.heroImage ? 'object-contain p-3' : 'object-cover'} group-hover:scale-110 transition-transform duration-700`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-display font-medium text-background group-hover:text-accent-amber transition-colors truncate" title={trip.title}>
                        {trip.title}
                      </h3>                      
                    </div>
                  </div>

                  {/* Column 2: Date & Seats (Span 2) */}
                  <div className="flex flex-col md:col-span-2 min-w-0 pl-20 md:pl-0">
                    <span className="text-sm sm:text-base font-medium text-background font-sans truncate">
                      {trip.startDate}
                    </span>
                    <span className="text-xs sm:text-sm text-background/50 font-sans truncate mt-0.5">
                      {trip.seatsLeft ?? 12} Seats Left
                    </span>
                  </div>

                  {/* Column 3: Price & Status (Span 2) */}
                  <div className="flex flex-col md:col-span-2 min-w-0 pl-20 md:pl-0">
                    <span className="text-base sm:text-lg font-display font-medium text-accent-amber truncate">
                      ${(trip.price ?? 0).toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-accent-amber shrink-0"></span>
                      <span className="text-xs sm:text-sm text-background/60 font-sans font-medium uppercase tracking-wider truncate">
                        {trip.status || "Guaranteed"}
                      </span>
                    </div>
                  </div>

                  {/* Column 4: Join Button (Span 3) */}
                  <div className="flex md:justify-end md:col-span-3 min-w-0 pl-20 md:pl-0">
                    <Link 
                      href={`/booking-form/?trip_id=${trip.trip_id}&departure_id=${trip.departureId || `dep_${trip.id}`}&departure_start=${trip.startDate}&pp=${trip.price}`}
                      className="inline-flex items-center justify-center border border-background/30 hover:border-accent-amber text-background hover:bg-accent-amber hover:text-white text-center transition-all duration-300 px-6 py-2.5 rounded-full text-sm sm:text-base font-semibold w-full md:w-auto cursor-pointer"
                    >
                      Join Trip
                    </Link>
                  </div>
                </StaggerItem>
              ))
            )}
          </Stagger>

          {/* Pagination Controls */}
          {filteredData.length > PAGE_SIZE && (
            <div className="flex items-center justify-center gap-3 py-6">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className={`px-4 py-2 rounded-lg border bg-background/5 text-background/90 ${page === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-background/10'}`}
              >
                Previous
              </button>

              <div className="text-sm text-background/70">Page {page + 1} of {totalPages}</div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className={`px-4 py-2 rounded-lg border bg-background/5 text-background/90 ${page >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-background/10'}`}
              >
                Next
              </button>
            </div>
          )}

        </div>
        
      </div>
    </section>
  );
}