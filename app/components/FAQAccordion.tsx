import React from 'react';
import { Reveal } from '@/app/components/animations/Motion';
import RichText from '@/app/components/RichText';

interface FaqItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FaqItem[];
  title?: string;
}

export default function FAQAccordion({ faqs, title = 'FAQs' }: FAQAccordionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <Reveal className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-4">
      <h2 className="text-xl font-bold oswald uppercase text-[#112233] border-b pb-3">
        {title}
      </h2>
      <div className="space-y-3">
        {faqs.map((faq: FaqItem, i: number) => (
          <details key={i} className="group rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm transition-all duration-300 open:shadow-md">
            <summary className="list-none cursor-pointer flex items-center justify-between gap-4 p-4 transition-colors hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 text-gray-600 group-open:bg-[#f26522] group-open:text-white rounded-xl flex flex-col items-center justify-center w-[54px] h-[54px] shrink-0 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-wider mb-0.5">Q</span>
                  <span className="text-xl font-black leading-none oswald">{(i + 1).toString().padStart(2, '0')}</span>
                </div>
                <h3 className="font-bold text-[#112233] text-[17px]">{faq.question}</h3>
              </div>
              <div className="flex items-center gap-5 shrink-0">
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
        ))}
      </div>
    </Reveal>
  );
}