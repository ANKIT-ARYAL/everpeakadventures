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
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const availableMonths = useMemo(() => {
    const months = data
      .map(trip => getMonthYear(trip.startDate))
      .filter((month): month is string => month !== null);
    
    return Array.from(new Set(months));
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedMonth === 'All') return data;
    return data.filter(trip => getMonthYear(trip.startDate) === selectedMonth);
  }, [data, selectedMonth]);

  return (
    <section
      id="departures"
      className={
        embedded
          ? "scroll-mt-[118px] rounded-2xl bg-foreground p-5 md:p-8 overflow-hidden"
          : "scroll-mt-[118px] py-24 px-6 bg-foreground"
      }
    >
      <div className={embedded ? "" : "px-5 lg:px-20"}>
        
        {/* Header Section */}
        <Reveal className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className={`${embedded ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'} font-display font-medium text-background tracking-tight mb-4`}>
              {title ?? 'Fixed Departures'}
            </h2>
            <p className="font-sans text-background/70 text-lg">
              {label ?? 'Join a scheduled group trek and share the adventure.'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => setSelectedMonth('All')}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition-colors ${
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
                className="appearance-none bg-background/10 text-background px-6 py-3 pr-12 rounded-full text-lg font-semibold outline-none cursor-pointer hover:bg-background/20 transition-colors border border-transparent"
              >
                <option value="All">Filter by Month</option>
                {availableMonths.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-background/50">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M7 10l5 5 5-5z"/></svg>
              </div>
            </div>
          </div>
        </Reveal>

        {/* List Section */}
        <div className="border-t border-background/10">
          <Stagger className="flex flex-col">
            {filteredData.length === 0 ? (
              <div className="py-24 text-center text-background/50 font-sans">
                No departures found for {selectedMonth}.
              </div>
            ) : (
              filteredData.map((trip) => (
                <StaggerItem
                  key={trip.id} 
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-background/10 hover:bg-background/5 transition-colors px-4 -mx-4 rounded-xl"
                >
                  <div className="flex items-center gap-6 md:w-2/5">
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-background/10">
                      <img 
                        src={trip.heroImage || "https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:259/h:68/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png"} 
                        alt={trip.title}
                        className={`w-full h-full ${!trip.heroImage ? 'object-contain p-4' : 'object-cover'} group-hover:scale-110 transition-transform duration-700`}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-medium text-background group-hover:text-accent-amber transition-colors">
                        {trip.title}
                      </h3>
                      <div className="flex items-center gap-3 text-lg text-background/60 font-sans mt-1">
                        <span>{trip.durationDays}</span>
                        <span className="w-1 h-1 rounded-full bg-background/30" />
                        <span>{trip.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:w-1/5">
                    <span className="text-lg font-medium text-background font-sans">
                      {trip.startDate}
                    </span>
                    <span className="text-lg text-background/50 font-sans">
                      {trip.seatsLeft ?? 12} Seats Left
                    </span>
                  </div>

                  <div className="flex flex-col md:w-1/5">
                    <span className="text-lg font-display font-medium text-accent-amber">
                      ${(trip.price ?? 0).toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-accent-amber"></span>
                      <span className="text-md text-background/60 font-sans font-medium uppercase tracking-wider">
                        {trip.status || "Guaranteed"}
                      </span>
                    </div>
                  </div>

                  <div className="md:w-auto">
                    <Link 
                      href={`/booking-form/?trip_id=${trip.trip_id}&departure_id=${trip.departureId || `dep_${trip.id}`}&departure_start=${trip.startDate}&pp=${trip.price}`}
                      className="inline-block border border-background/30 hover:border-accent-amber text-background hover:bg-accent-amber hover:text-white text-center transition-all duration-300 px-6 py-3 rounded-full text-lg font-semibold w-full md:w-auto cursor-pointer"
                    >
                      Join Trip
                    </Link>
                  </div>
                </StaggerItem>
              ))
            )}
          </Stagger>
        </div>
        
      </div>
    </section>
  );
}
