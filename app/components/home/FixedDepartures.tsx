'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem } from '../animations/Motion';

interface FixedDeparturesProps {
  data: any[];
  label?: string;
  title?: string;
}

export default function FixedDepartures({ data = [], label, title }: FixedDeparturesProps) {
  // State to track the currently selected month filter
  const [selectedMonth, setSelectedMonth] = useState<string>('All');

  // Helper function to extract "Month Year" (e.g., "September 2026") from a date string
  const getMonthYear = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Generate a unique list of months based on the actual data provided
  const availableMonths = useMemo(() => {
    const months = data
      .map(trip => getMonthYear(trip.startDate))
      .filter((month): month is string => month !== null);
    
    return Array.from(new Set(months));
  }, [data]);

  // Filter the table data based on the selected month
  const filteredData = useMemo(() => {
    if (selectedMonth === 'All') return data;
    return data.filter(trip => getMonthYear(trip.startDate) === selectedMonth);
  }, [data, selectedMonth]);

  return (
    <section id="departures" className="py-12 px-5 bg-[#f5f7f9] font-sans">
      <div className="max-w-[1100px] mx-auto shadow-[0_10px_30px_rgba(0,0,0,0.05)] rounded-2xl overflow-hidden">
        
        {/* Header Section */}
        <Reveal className="relative bg-[#113255] px-8 py-10 flex flex-col md:flex-row justify-between items-start md:items-center overflow-hidden">
          <div 
            className="absolute top-0 left-0 w-1/2 h-full opacity-20 pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #ffffff 10px, #ffffff 12px)' }}
          ></div>
          <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-[#0c243f] rounded-full opacity-50 pointer-events-none"></div>

          <div className="relative z-10 mb-6 md:mb-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-[2px] bg-[#6395c7]"></div>
              <span className="text-[#6395c7] text-xs font-bold tracking-widest uppercase">
                {label ?? 'Departure Dates'}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {title ?? 'Join Fixed Departure Trips'}
            </h2>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Changed from Link to Button to reset the filter */}
            <button 
              onClick={() => setSelectedMonth('All')}
              className={`px-5 py-2.5 rounded-md text-sm font-bold shadow-sm transition-colors whitespace-nowrap block text-center ${
                selectedMonth === 'All' 
                  ? 'bg-white text-[#113255]' 
                  : 'bg-[#eef5fa] text-[#113255] hover:bg-white'
              }`}
            >
              All Departures
            </button>

            <div className="relative w-full sm:w-auto">
              {/* Added value and onChange to control the filter state */}
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none bg-white text-[#333333] px-5 py-2.5 pr-10 rounded-md text-sm font-medium shadow-sm w-full md:w-auto outline-none cursor-pointer"
              >
                <option value="All">Select Month, Year</option>
                {availableMonths.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M7 10l5 5 5-5z"/></svg>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Table Section */}
        <div className="bg-white px-8 pb-6">
          <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 py-5 border-b border-gray-100 text-xs font-bold text-[#888888] uppercase tracking-wider">
            <div>Trip Name</div>
            <div>Departure Date</div>
            <div>Status</div>
            <div>Price</div>
            <div className="w-[130px]"></div>
          </div>

          <Stagger className="flex flex-col">
            {filteredData.length === 0 ? (
              <div className="py-12 text-center text-gray-500 font-medium">
                No departures found for {selectedMonth}.
              </div>
            ) : (
              filteredData.map((trip, index) => (
                <StaggerItem
                  key={trip.id} 
                  className={`grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 md:gap-4 items-center py-5 ${
                    index !== filteredData.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                      <img 
                        src={trip.heroImage} 
                        alt={trip.title || "Trek image"} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-[0.95rem] font-bold text-[#222222]">
                      {trip.title}
                    </h3>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#222222]">
                      {trip.durationDays}
                    </span>
                    <span className="text-[0.8rem] text-[#777777] mt-0.5">
                      From {trip.startDate} {trip.endDate ? `To ${trip.endDate}` : ''}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-[#1a5b88] stroke-2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span className="text-sm font-bold text-[#1a5b88]">
                        {trip.status || "Guaranteed"}
                      </span>
                    </div>
                    <span className="text-[0.8rem] text-[#777777] mt-0.5">
                      {trip.seatsLeft ?? 12} Seats Left
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[0.95rem] font-bold text-[#1a5b88]">
                      US$ {(trip.price ?? 0).toLocaleString()}
                    </span>
                    {trip.originalPrice && (
                      <span className="text-[0.8rem] text-[#777777] line-through mt-0.5">
                        US$ {(trip.originalPrice ?? 0).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-start md:justify-end mt-2 md:mt-0">
                    <Link 
                      href={`/booking-form/?trip_id=${trip.trip_id}&departure_id=${trip.departureId || `dep_${trip.id}`}&departure_start=${trip.startDate}&pp=${trip.price}`}
                      className="border border-[#1a5b88] text-[#1a5b88] hover:bg-[#1a5b88] hover:text-white text-center transition-colors duration-200 px-4 py-2.5 rounded text-sm font-bold w-full md:w-[130px] cursor-pointer block"
                    >
                      Join this trip
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