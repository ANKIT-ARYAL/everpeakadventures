import React from 'react';
import { Reveal } from '@/app/components/animations/Motion';

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
        {faqs.map((faq: any, i: number) => (
          <details key={i} className="group p-4 rounded-xl bg-gray-50 border border-gray-200">
            <summary className="font-bold text-xs text-[#112233] cursor-pointer flex items-center justify-between">
              <span>{faq.question}</span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200 leading-relaxed">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </Reveal>
  );
}