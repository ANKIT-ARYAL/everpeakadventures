import React from 'react';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem } from '../animations/Motion';
import RichText from '@/app/components/RichText';

interface AboutPageProps {
  data: {
    title: string;
    featuredImage: string;
    happyTravelers: string;
    yearsExperience: string;
    successfulTrips: string;
    expertGuides: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    paragraph4: string;
    cultureTitle: string;
    cultureText: string;
    missionText: string;
    visionText: string;
    goalsText: string;
  };
}

export default function AboutUsPage({ data }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-[#222222]">
      
      {/* PAGE HEADER / BREADCRUMB */}
      <Reveal className="bg-[#f7f9f7] py-12 border-b border-gray-100 text-center">
        <div className="max-w-[1200px] mx-auto px-5">
          <h1 className="text-3xl md:text-4xl font-black text-[#222222] uppercase tracking-tight mb-2 oswald">
            {data.title}
          </h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">About Us</span>
          </p>
        </div>
      </Reveal>

      {/* MAIN CONTENT SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT COLUMN: Image & Statistics Grid */}
            <Reveal className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-gray-100">
                <img 
                  src={data.featuredImage} 
                  alt="Himalayan Adventure Prayer Flags" 
                  className="w-full h-[320px] object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <Stagger className="grid grid-cols-2 gap-4">
                <StaggerItem className="bg-[#36332f] text-white p-6 rounded-2xl text-center shadow-md flex flex-col justify-center border border-white/5">
                  <h3 className="text-2xl md:text-3xl font-black text-[#ffc107] mb-1 oswald">{data.happyTravelers}</h3>
                  <p className="text-xs text-gray-300 font-medium tracking-wide">Happy Travelers</p>
                </StaggerItem>
                <StaggerItem className="bg-[#36332f] text-white p-6 rounded-2xl text-center shadow-md flex flex-col justify-center border border-white/5">
                  <h3 className="text-2xl md:text-3xl font-black text-[#ffc107] mb-1 oswald">{data.yearsExperience}</h3>
                  <p className="text-xs text-gray-300 font-medium tracking-wide">Years of Experience</p>
                </StaggerItem>
                <StaggerItem className="bg-[#36332f] text-white p-6 rounded-2xl text-center shadow-md flex flex-col justify-center border border-white/5">
                  <h3 className="text-2xl md:text-3xl font-black text-[#ffc107] mb-1 oswald">{data.successfulTrips}</h3>
                  <p className="text-xs text-gray-300 font-medium tracking-wide">Successful Trips</p>
                </StaggerItem>
                <StaggerItem className="bg-[#36332f] text-white p-6 rounded-2xl text-center shadow-md flex flex-col justify-center border border-white/5">
                  <h3 className="text-2xl md:text-3xl font-black text-[#ffc107] mb-1 oswald">{data.expertGuides}</h3>
                  <p className="text-xs text-gray-300 font-medium tracking-wide">Expert Guides</p>
                </StaggerItem>
              </Stagger>
            </Reveal>

            {/* RIGHT COLUMN: About Story & Description */}
            <Reveal delay={0.15} className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.04)] p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-[#222222] mb-6 oswald tracking-tight">
                About Ever Peak Adventures
              </h2>
              <div className="space-y-4 text-gray-600 text-[14px] leading-relaxed">
                <RichText html={data.paragraph1} />
                <RichText html={data.paragraph2} />
                <RichText html={data.paragraph3} />
                <RichText html={data.paragraph4} />
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* COMPANY CULTURE BANNER */}
      <Reveal className="bg-[#24a0ed] text-white py-12 px-5 shadow-inner">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wide oswald">
            {data.cultureTitle}
          </h2>
          <RichText
            html={data.cultureText}
            className="text-sm md:text-base font-medium max-w-2xl leading-relaxed text-right md:text-right text-white"
          />
        </div>
      </Reveal>

      {/* MISSION, VISION & GOALS */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-5">
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <StaggerItem className="bg-gradient-to-b from-[#00c9ff] to-[#0072ff] text-white rounded-2xl p-8 shadow-[0_10px_30px_rgba(0,114,255,0.15)] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-wider mb-4 oswald text-white">
                  Our Mission
                </h3>
                <RichText
                  html={data.missionText}
                  className="text-white/90 text-xs md:text-sm leading-relaxed mb-8"
                />
              </div>
              <div className="flex justify-center pt-4 border-t border-white/20">
                <span className="text-3xl">🚀</span>
              </div>
            </StaggerItem>

            <StaggerItem className="bg-gradient-to-b from-[#1e3c72] to-[#2a5298] text-white rounded-2xl p-8 shadow-[0_10px_30px_rgba(30,60,114,0.15)] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-wider mb-4 oswald text-white">
                  Our Vision
                </h3>
                <RichText
                  html={data.visionText}
                  className="text-white/90 text-xs md:text-sm leading-relaxed mb-8"
                />
              </div>
              <div className="flex justify-center pt-4 border-t border-white/20">
                <span className="text-3xl">👁️</span>
              </div>
            </StaggerItem>

            <StaggerItem className="bg-gradient-to-b from-[#556b2f] to-[#3b4a20] text-white rounded-2xl p-8 shadow-[0_10px_30px_rgba(85,107,47,0.15)] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-wider mb-4 oswald text-white">
                  Our Goals
                </h3>
                <RichText
                  html={data.goalsText}
                  className="text-white/90 text-xs md:text-sm leading-relaxed mb-8"
                />
              </div>
              <div className="flex justify-center pt-4 border-t border-white/20">
                <span className="text-3xl">🎯</span>
              </div>
            </StaggerItem>

          </Stagger>
        </div>
      </section>

    </div>
  );
}