import React from 'react';
import Image from 'next/image';
import { Reveal, Stagger, StaggerItem } from '../animations/Motion';
import PageHero from '../ui/PageHero';
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
    <div className="min-h-screen font-sans bg-white text-slate-900 text-justify">
      
      {/* HERO SECTION */}
      <PageHero 
        slug="about-us" 
        fallbackTitle={data.title} 
        fallbackImage={data.featuredImage}
        fallbackSubtitle="Discover the story behind Ever Peak Adventures."
      />

      {/* MAIN CONTENT SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="flex flex-col relative z-10 px-5 lg:px-20">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* LEFT COLUMN: Image & Statistics Grid */}
            <Reveal className="w-full lg:w-5/12 space-y-6">
              <div className="rounded-[2rem] overflow-hidden shadow-xl p-2 bg-white">
                <img
                  src={data.featuredImage} 
                  alt="Himalayan Adventure Prayer Flags" 
                  className="w-full h-[400px] object-cover rounded-[1.5rem] hover:scale-105 transition-transform duration-700 ease-[0.16,1,0.3,1]"
                />
              </div>
            </Reveal>              
            
            {/* RIGHT COLUMN: About Story & Description */}
            <Reveal delay={0.15} className="w-full lg:w-7/12 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-10 md:p-14">
              <h2 className="text-3xl md:text-4xl font-display font-medium text-[#112233] mb-8 tracking-tight">
                About Ever Peak Adventures
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <RichText html={data.paragraph1} />
                <RichText html={data.paragraph2} />
                <RichText html={data.paragraph3} />
                <RichText html={data.paragraph4} />
              </div>
            </Reveal>
          </div>

          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-6 my-20">
            <StaggerItem className="p-8 rounded-3xl text-center flex flex-col justify-center bg-white border border-gray-100 shadow-xl">
              <h3 className="text-4xl md:text-5xl font-display font-medium mb-3 text-accent-amber">{data.happyTravelers}</h3>
              <p className="text-lg font-medium text-gray-600">Happy Travelers</p>
            </StaggerItem>
            <StaggerItem className="p-8 rounded-3xl text-center flex flex-col justify-center bg-white border border-gray-100 shadow-xl">
              <h3 className="text-4xl md:text-5xl font-display font-medium mb-3 text-accent-amber">{data.yearsExperience}</h3>
              <p className="text-lg font-medium text-gray-600">Years of Experience</p>
            </StaggerItem>
            <StaggerItem className="p-8 rounded-3xl text-center flex flex-col justify-center bg-white border border-gray-100 shadow-xl">
              <h3 className="text-4xl md:text-5xl font-display font-medium mb-3 text-accent-amber">{data.successfulTrips}</h3>
              <p className="text-lg font-medium text-gray-600">Successful Trips</p>
            </StaggerItem>
            <StaggerItem className="p-8 rounded-3xl text-center flex flex-col justify-center bg-white border border-gray-100 shadow-xl">
              <h3 className="text-4xl md:text-5xl font-display font-medium mb-3 text-accent-amber">{data.expertGuides}</h3>
              <p className="text-lg font-medium text-gray-600">Expert Guides</p>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* COMPANY CULTURE BANNER */}
      <Reveal className="bg-[#00af87] text-white py-20 px-5 shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10 px-5 lg:px-20">
          <h2 className="text-3xl md:text-4xl font-display font-medium tracking-tight">
            {data.cultureTitle}
          </h2>
          <RichText
            html={data.cultureText}
            className="text-xl md:text-2xl font-medium leading-relaxed text-left md:text-right text-white/90 px-5 lg:px-20"
          />
        </div>
      </Reveal>

      {/* MISSION, VISION & GOALS */}
      <section className="py-24 relative overflow-hidden bg-slate-50">
        <div className="relative z-10 px-5 lg:px-20">
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <StaggerItem className="bg-white border border-gray-100 rounded-[2.5rem] p-10 md:p-12 flex flex-col justify-between shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <svg viewBox="0 0 24 24" className="w-24 h-24 fill-current text-[#112233]"><path d="M12 2L2 22l10-3 10 3L12 2z"/></svg>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-display font-medium tracking-tight mb-6 flex items-center gap-3 text-[#112233]">
                  <span className="w-10 h-10 rounded-full bg-accent-amber/10 flex items-center justify-center text-accent-amber">🚀</span>
                  Our Mission
                </h3>
                <RichText
                  html={data.missionText}
                  className="text-lg text-gray-600 leading-relaxed mb-8"
                />
              </div>
            </StaggerItem>

            <StaggerItem className="bg-white border border-gray-100 rounded-[2.5rem] p-10 md:p-12 flex flex-col justify-between shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <svg viewBox="0 0 24 24" className="w-24 h-24 fill-current text-[#112233]"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-display font-medium tracking-tight mb-6 flex items-center gap-3 text-[#112233]">
                  <span className="w-10 h-10 rounded-full bg-accent-amber/10 flex items-center justify-center text-accent-amber">👁️</span>
                  Our Vision
                </h3>
                <RichText
                  html={data.visionText}
                  className="text-lg text-gray-600 leading-relaxed mb-8"
                />
              </div>
            </StaggerItem>

            <StaggerItem className="bg-white border border-gray-100 rounded-[2.5rem] p-10 md:p-12 flex flex-col justify-between shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <svg viewBox="0 0 24 24" className="w-24 h-24 fill-current text-[#112233]"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-display font-medium tracking-tight mb-6 flex items-center gap-3 text-[#112233]">
                  <span className="w-10 h-10 rounded-full bg-accent-amber/10 flex items-center justify-center text-accent-amber">🎯</span>
                  Our Goals
                </h3>
                <RichText
                  html={data.goalsText}
                  className="text-lg text-gray-600 leading-relaxed mb-8"
                />
              </div>
            </StaggerItem>

          </Stagger>
        </div>
      </section>

    </div>
  );
}