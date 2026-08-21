'use client';

import { Reveal, Stagger, StaggerItem } from '../animations/Motion';
import RichText from '@/app/components/RichText';
import { stripHtml } from '@/lib/stripHtml';
import { Compass, ShieldCheck, HeartHandshake, Leaf, Award, Mountain, Star } from 'lucide-react';

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface WhyChooseUsProps {
  features: Feature[];
  badge?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
}

const getLucideIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('expert') || t.includes('guide')) return <Compass className="w-6 h-6" />;
  if (t.includes('safe') || t.includes('security')) return <ShieldCheck className="w-6 h-6" />;
  if (t.includes('personal') || t.includes('service')) return <HeartHandshake className="w-6 h-6" />;
  if (t.includes('responsib') || t.includes('sustain')) return <Leaf className="w-6 h-6" />;
  if (t.includes('quality') || t.includes('trust')) return <Award className="w-6 h-6" />;
  if (t.includes('mountain') || t.includes('trek')) return <Mountain className="w-6 h-6" />;
  return <Star className="w-6 h-6" />;
};

export default function WhyChooseUs({ features = [], badge, title, titleHighlight, subtitle }: WhyChooseUsProps) {
  return (
    <section className="py-20 px-5 bg-[#fafbfc] font-sans relative">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header Section */}
        <Reveal className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <span className="bg-[#eaf5fc] text-[#45b7f3] text-[11px] font-bold uppercase tracking-[0.15em] py-2 px-5 rounded-full mb-5 shadow-sm">
            {badge ?? 'Why Choose Us'}
          </span>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#112233] mb-4 tracking-tight">
            {title ?? 'Why Choose '} <span className="text-[#fca020]">{titleHighlight ?? 'Ever Peak Adventures'}</span>?
          </h2>
          
          <div className="text-[#556677] text-base md:text-lg leading-relaxed max-w-2xl mt-4">
            <RichText html={subtitle ?? 'We combine years of Himalayan expertise, personalized service, and a passion for adventure to deliver safe, authentic, and unforgettable trekking experiences throughout Nepal.'} />
          </div>
        </Reveal>

        {/* Grid Section */}
        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <StaggerItem
              key={feature.id} 
              className="group bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col items-start"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#eaf5fc] to-[#f4faff] rounded-2xl flex items-center justify-center text-[#45b7f3] mb-6 shadow-sm border border-[#eaf5fc] group-hover:scale-110 group-hover:bg-[#45b7f3] group-hover:text-white transition-all duration-300 ease-out">
                {getLucideIcon(feature.title)}
              </div>
              
              <h3 className="text-xl font-bold text-[#112233] mb-3 group-hover:text-[#45b7f3] transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-[#667788] text-sm leading-relaxed">
                {stripHtml(feature.description)}
              </p>
            </StaggerItem>
          ))}
        </Stagger>

      </div>
    </section>
  );
}
