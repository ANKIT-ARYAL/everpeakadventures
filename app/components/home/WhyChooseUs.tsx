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
  if (t.includes('expert') || t.includes('guide')) return <Compass className="w-12 h-12" />;
  if (t.includes('safe') || t.includes('security')) return <ShieldCheck className="w-12 h-12" />;
  if (t.includes('personal') || t.includes('service')) return <HeartHandshake className="w-12 h-12" />;
  if (t.includes('responsib') || t.includes('sustain')) return <Leaf className="w-12 h-12" />;
  if (t.includes('quality') || t.includes('trust')) return <Award className="w-12 h-12" />;
  if (t.includes('mountain') || t.includes('trek')) return <Mountain className="w-12 h-12" />;
  return <Star className="w-12 h-12" />;
};

export default function WhyChooseUs({ features = [], badge, title, titleHighlight, subtitle }: WhyChooseUsProps) {
  return (
    <section className="py-24 px-6 bg-foreground text-background font-sans border-t border-background/10">
      <div className="px-5 lg:px-20">
        
        {/* Header Section */}
        <Reveal className="mb-20 flex flex-col items-start">
          <span className="text-[11px] font-bold uppercase tracking-widest text-accent-amber mb-6">
            {badge ?? 'Why Choose Us'}
          </span>
          
          <h2 className="text-4xl md:text-6xl font-display font-medium text-background mb-6 tracking-tight leading-[1.1]">
            {title ?? 'Why Choose '} <span className="text-accent-amber">{titleHighlight ?? 'Ever Peak Adventures'}</span>?
          </h2>
          
          <div className="text-background/70 text-lg md:text-xl leading-relaxed mt-2 font-sans text-justify">
            <RichText html={subtitle ?? 'We combine years of Himalayan expertise, personalized service, and a passion for adventure to deliver safe, authentic, and unforgettable trekking experiences throughout Nepal.'} />
          </div>
        </Reveal>

        {/* Grid Section */}
        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-justify">
          {features.map((feature) => (
            <StaggerItem
              key={feature.id} 
              className="group flex flex-col items-start border border-background/20 rounded-2xl p-8 hover:bg-background/5 transition-colors duration-300 hover:border-accent-amber/50"
            >
              <div className="flex items-center justify-center text-accent-amber mb-6 group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500 ease-out">
                {getLucideIcon(feature.title)}
              </div>
              
              <h3 className="text-xl font-display font-medium text-background mb-3 group-hover:text-accent-amber transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-background/60 text-base leading-relaxed font-sans">
                {stripHtml(feature.description)}
              </p>
            </StaggerItem>
          ))}
        </Stagger>

      </div>
    </section>
  );
}
