import React from 'react';
import { Star } from 'lucide-react';
import RichText from '@/app/components/RichText';
import { stripHtml } from '@/lib/stripHtml';

interface TrustedPartnerProps {
  content: {
    reviewCountText: string;
    badgeTitle: string;
    badgeSubtitle: string;
    storyTitle: string;
    storyDescription: string;
    storyImage: string;
  };
}

export default function TrustedPartner({ content }: TrustedPartnerProps) {
  return (
    <section className="w-full font-sans bg-background text-foreground border-t border-foreground/10">
      
      {/* Top Section: Trust Metrics (Clean Banner Layout) */}
      <div className="py-12 lg:py-20 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 px-5 lg:px-20 max-w-[1400px] mx-auto w-full">
        
        {/* Metric 1: Reputation */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
          <div className="flex items-center gap-1 text-accent-amber mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-current" />
            ))}
          </div>
          <h3 className="font-display font-medium text-2xl text-foreground">
            {content.reviewCountText}
          </h3>
          <p className="text-foreground/60 text-lg leading-relaxed text-justify">
            {content.badgeTitle}. {stripHtml(content.badgeSubtitle)}
          </p>
        </div>

        {/* Metric 2: Travelers */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 md:border-l md:border-foreground/10 md:pl-8 lg:pl-12">
          <div className="flex -space-x-3 mb-2">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User" className="w-12 h-12 rounded-full border-2 border-background object-cover" />
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="User" className="w-12 h-12 rounded-full border-2 border-background object-cover" />
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="User" className="w-12 h-12 rounded-full border-2 border-background object-cover" />
            <div className="w-12 h-12 rounded-full border-2 border-background bg-foreground flex items-center justify-center text-lg font-bold text-background z-10">
              10k+
            </div>
          </div>
          <h3 className="font-display font-medium text-2xl text-foreground">
            Happy Travelers
          </h3>
          <p className="text-foreground/60 text-lg leading-relaxed">
            Serving adventure seekers since 2007 with tailored, safe, and unforgettable journeys.
          </p>
        </div>

        {/* Metric 3: Story */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 md:border-l md:border-foreground/10 md:pl-8 lg:pl-12">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mb-2">
            <img src={content.storyImage} alt="Story" className="w-full h-full object-cover" />
          </div>
          <h3 className="font-display font-medium text-2xl text-foreground">
            {content.storyTitle}
          </h3>
          <div className="text-foreground/60 text-lg leading-relaxed text-justify">
            <RichText html={content.storyDescription} />
          </div>
        </div>

      </div>
    </section>
  );
}