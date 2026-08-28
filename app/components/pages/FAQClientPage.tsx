"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import SubpageHero from './SubpageHero';
import { Reveal } from '../animations/Motion';
import RichText from '@/app/components/RichText';
import { stripHtml } from '@/lib/stripHtml';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQClientProps {
  faqs: FAQItem[];
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
}

export default function FAQClientPage({ faqs = [], heroTitle, heroSubtitle, heroImage }: FAQClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stripHtml(faq.answer).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f7f9f7] font-sans text-gray-800">
      
      {/* HERO SECTION */}
      <SubpageHero
        title={heroTitle ?? "FREQUENTLY ASKED QUESTIONS"}
        subtitle={heroSubtitle ?? "Find clear and reliable answers to the most frequently asked questions about our trips and services."}
        image={heroImage ?? "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000&auto=format&fit=crop"}
      />

      {/* MAIN CONTENT GRID */}
      <section className="py-16">
        <div className="px-5 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Accordion List */}
            <div className="lg:col-span-8 space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-center text-gray-500">
                  No matching FAQs found.
                </div>
              ) : (
                filteredFaqs.map((faq, index) => {
                  const isInitialScreen = index < 3;
                  const itemContent = (
                    <div className="w-full">
                      <details className="group rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm transition-all duration-300 open:shadow-md w-full">
                        <summary className="list-none cursor-pointer flex items-center justify-between gap-4 p-4 transition-colors hover:bg-gray-50">
                          <div className="flex items-center gap-4">
                            {/* Question Badge */}
                            <div className="bg-gray-100 text-gray-600 group-open:bg-[#f26522] group-open:text-white rounded-xl flex flex-col items-center justify-center w-[54px] h-[54px] shrink-0 transition-colors">
                              <span className="text-[10px] font-bold uppercase tracking-wider mb-0.5">Q</span>
                              <span className="text-xl font-black leading-none oswald">{(index + 1).toString().padStart(2, '0')}</span>
                            </div>
                            <h3 className="font-bold text-[#112233] text-[17px]">{faq.question}</h3>
                          </div>
                          
                          <div className="flex items-center gap-5 shrink-0">
                            {/* Caret */}
                            <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-open:rotate-180 transition-transform duration-300">
                                <path d="m6 9 6 6 6-6"/>
                              </svg>
                            </div>
                          </div>
                        </summary>

                        <div className="px-6 py-6 border-t border-gray-100 bg-white text-gray-600 text-[14px] leading-relaxed">
                          <RichText html={faq.answer} />
                        </div>
                      </details>
                    </div>
                  );
                  
                  return isInitialScreen ? (
                    <React.Fragment key={faq.id || index}>
                      {itemContent}
                    </React.Fragment>
                  ) : (
                    <Reveal key={faq.id || index} className="w-full">
                      {itemContent}
                    </Reveal>
                  );
                })
              )}
            </div>

            {/* RIGHT: Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <h3 className="bg-[#1c2e40] text-white font-bold text-md uppercase tracking-widest py-2.5 px-4 rounded-lg text-center mb-4 oswald">
                  Searching.....
                </h3>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Searching..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-md text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#24a0ed]"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 top-3 w-4 h-4 text-gray-400">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                  </svg>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <h3 className="bg-[#1c2e40] text-white font-bold text-md uppercase tracking-widest py-2.5 px-4 rounded-lg text-center mb-4 oswald">
                  Useful Links
                </h3>
                <ul className="space-y-3 text-md font-medium text-gray-700">
                  <li>
                    <Link href="/contact-us" className="flex items-center gap-2 hover:text-[#24a0ed] transition-colors py-1 border-b border-gray-50">
                      <span>➔</span> Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-and-conditions" className="flex items-center gap-2 hover:text-[#24a0ed] transition-colors py-1 border-b border-gray-50">
                      <span>➔</span> Term & Condition
                    </Link>
                  </li>
                  <li>
                    <Link href="/about-us" className="flex items-center gap-2 hover:text-[#24a0ed] transition-colors py-1 border-b border-gray-50">
                      <span>➔</span> About Ever Peak
                    </Link>
                  </li>
                  <li>
                    <Link href="/our-team" className="flex items-center gap-2 hover:text-[#24a0ed] transition-colors py-1 border-b border-gray-50">
                      <span>➔</span> Our Team
                    </Link>
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}