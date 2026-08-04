"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQClientProps {
  faqs: FAQItem[];
}

export default function FAQClientPage({ faqs = [] }: FAQClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f7f9f7] font-sans text-gray-800">
      
      {/* HERO SECTION */}
      <section className="relative py-32 bg-[#112233] text-white overflow-hidden text-center">
        <div 
          className="absolute inset-0 z-0 bg-[right_center] bg-cover opacity-60"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000&auto=format&fit=crop)',
          }}
        />
        
        <div className="max-w-[1200px] mx-auto px-5 relative z-20">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider oswald mb-4">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="text-gray-200 text-sm md:text-base italic max-w-xl mx-auto">
            Find clear and reliable answers to the most frequently asked questions about our trips and services.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Accordion List */}
            <div className="lg:col-span-8 space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-center text-gray-500">
                  No matching FAQs found.
                </div>
              ) : (
                filteredFaqs.map((faq, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <div 
                      key={faq.id || index}
                      className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-sm md:text-base text-[#222222] hover:text-[#24a0ed] transition-colors"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#24a0ed]' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-5 text-gray-600 text-xs md:text-sm leading-relaxed border-t border-gray-50 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* RIGHT: Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <h3 className="bg-[#1c2e40] text-white font-bold text-xs uppercase tracking-widest py-2.5 px-4 rounded-lg text-center mb-4 oswald">
                  Searching.....
                </h3>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Searching..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#24a0ed]"
                  />
                  <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <h3 className="bg-[#1c2e40] text-white font-bold text-xs uppercase tracking-widest py-2.5 px-4 rounded-lg text-center mb-4 oswald">
                  Useful Links
                </h3>
                <ul className="space-y-3 text-xs font-medium text-gray-700">
                  <li>
                    <Link href="/contact" className="flex items-center gap-2 hover:text-[#24a0ed] transition-colors py-1 border-b border-gray-50">
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
                    <Link href="/our-team" className="flex items-center gap-2 hover:text-[#24a0ed] transition-colors py-1">
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