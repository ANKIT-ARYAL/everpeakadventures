"use client";
import React, { useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";

export default function HeroSearchBar() {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  return (
    <div className="relative z-30 w-full h-0 px-5 lg:px-20 max-w-[1400px] mx-auto w-full">
      <div className="absolute left-5 right-5 lg:left-5 lg:right-5 top-0 -translate-y-1/2 flex justify-end lg:justify-center">
        
        {/* Mobile Collapsed State (Just the icon) */}
        <div 
          className={`lg:hidden w-14 h-14 bg-background/80 backdrop-blur-xl rounded-full shadow-2xl items-center justify-center cursor-pointer border border-foreground/20 hover:bg-background transition-colors ${isMobileExpanded ? 'hidden' : 'flex'}`}
          onClick={() => setIsMobileExpanded(true)}
        >
          <Search className="w-6 h-6 text-accent-amber" />
        </div>

        {/* Form State (Desktop ALWAYS visible, Mobile toggled via isMobileExpanded) */}
        <form 
          action="/trekking" 
          className={`w-full bg-background/80 backdrop-blur-xl rounded-3xl lg:rounded-full shadow-2xl flex-col lg:flex-row items-center justify-between p-6 lg:pl-10 lg:pr-4 lg:py-4 gap-6 lg:gap-0 border border-foreground/20 ${isMobileExpanded ? 'flex' : 'hidden lg:flex'}`}
        >
          
          {/* Mobile Header (Close button) */}
          <div className="w-full flex lg:hidden justify-between items-center border-b border-foreground/10 pb-4 mb-2">
            <span className="font-display font-bold text-foreground text-xl tracking-wide">Find Your Trek</span>
            <button type="button" onClick={() => setIsMobileExpanded(false)} className="p-2 bg-foreground/5 rounded-full text-foreground/50 hover:text-red-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Destination */}
          <div className="flex-1 flex flex-col w-full lg:border-r border-foreground/10 lg:pr-6 relative group">
            <label className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider mb-1 px-1">Destination</label>
            <div className="relative">
              <select name="destination" className="w-full text-base font-bold text-foreground bg-transparent outline-none cursor-pointer appearance-none px-1 py-1">
                <option value="" className="text-black">All Destinations</option>
                <option value="everest" className="text-black">Everest Region</option>
                <option value="annapurna" className="text-black">Annapurna Region</option>
                <option value="langtang" className="text-black">Langtang Region</option>
                <option value="manaslu" className="text-black">Manaslu Region</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/50">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="flex-1 flex flex-col w-full lg:border-r border-foreground/10 lg:px-6 relative group">
            <label className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider mb-1 px-1">Duration</label>
            <div className="relative">
              <select name="duration" className="w-full text-base font-bold text-foreground bg-transparent outline-none cursor-pointer appearance-none px-1 py-1">
                <option value="" className="text-black">Any Duration</option>
                <option value="1-7" className="text-black">1 - 7 Days</option>
                <option value="8-14" className="text-black">8 - 14 Days</option>
                <option value="15+" className="text-black">15+ Days</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/50">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex-1 flex flex-col w-full lg:border-r border-foreground/10 lg:px-6 relative group">
            <label className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider mb-1 px-1">Difficulty</label>
            <div className="relative">
              <select name="difficulty" className="w-full text-base font-bold text-foreground bg-transparent outline-none cursor-pointer appearance-none px-1 py-1">
                <option value="" className="text-black">Any Difficulty</option>
                <option value="easy" className="text-black">Easy</option>
                <option value="moderate" className="text-black">Moderate</option>
                <option value="hard" className="text-black">Challenging</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/50">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex-1 flex flex-col w-full lg:px-6 relative group">
            <label className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider mb-1 px-1">Max Price</label>
            <div className="relative">
              <select name="price" className="w-full text-base font-bold text-foreground bg-transparent outline-none cursor-pointer appearance-none px-1 py-1">
                <option value="" className="text-black">Any Price</option>
                <option value="500" className="text-black">Under $500</option>
                <option value="1000" className="text-black">Under $1000</option>
                <option value="2000" className="text-black">Under $2000</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/50">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Button */}
          <button type="submit" className="w-full lg:w-auto bg-accent-amber hover:bg-accent-amber/90 text-white font-bold py-4 px-10 rounded-2xl lg:rounded-full transition-colors flex items-center justify-center gap-2 lg:ml-2 shrink-0 mt-4 lg:mt-0">
            <span className="text-[15px]">Find Your Trek</span>
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
