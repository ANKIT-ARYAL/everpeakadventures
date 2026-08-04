import React from 'react';
import { Star, Map, Award, ShieldCheck, MapPin, Smile, Leaf, CheckCircle2 } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Map: <Map className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5" />,
  Smile: <Smile className="w-5 h-5" />,
  Leaf: <Leaf className="w-5 h-5" />,
};

interface TrustedPartnerProps {
  content: {
    mainTitle: string;
    description: string;
    badgeTitle: string;
    badgeSubtitle: string;
    reviewCountText: string;
    storyTitle: string;
    storyDescription: string;
    storyImage: string;
    bgHeroImage: string;
  };
  features: Array<{
    id: string;
    title: string;
    desc: string;
    iconName: string;
  }>;
}

export default function TrustedPartner({ content, features }: TrustedPartnerProps) {
  return (
    <section className="w-full font-sans">
      {/* TOP SECTION: 3 Cards */}
      <div className="bg-[#fcfcfc] py-16 px-5">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Reputation and Awards */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-200 flex flex-col justify-between hover:shadow-md">
            <div>
              <h3 className="font-bold text-[#333333] mb-4">Reputation and Awards</h3>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[#34e0a1] rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-black"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm4-4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm2 4.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
                  </div>
                  <div className="flex text-[#333333]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500 font-medium">{content.reviewCountText}</span>
              </div>
            </div>

            <div className="flex gap-4 items-end justify-between mt-2">
              <div className="flex-1">
                <h4 className="font-bold text-[#333333] text-sm mb-2">{content.badgeTitle}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {content.badgeSubtitle}
                </p>
              </div>
              <div className="w-10 h-10 shrink-0 flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#34e0a1] flex items-center justify-center mb-0.5">
                  <span className="text-[8px] font-bold text-center leading-none">TA<br/>2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 10000+ Happy Travelers */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex -space-x-3 mb-6">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" />
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="User" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="User" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="User" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" />
              <div className="w-9 h-9 rounded-full border-2 border-white bg-[#555555] flex items-center justify-center text-xs font-bold text-white shadow-sm z-10">
                +
              </div>
            </div>
            <h3 className="font-bold text-[#333333] mb-5">10000+ Happy Travelers</h3>
            <ul className="space-y-2.5">
              {[
                "Top-Tier Safety Measures for Peace of Mind",
                "Tailored Adventures for Every Traveler",
                "Serving Adventure Seekers Since 2007"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-2.5 text-[13px] text-gray-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#555555] fill-[#555555] stroke-white shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 3: Traveler Story */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-bold text-[#333333]">{content.storyTitle}</h3>
              <span className="text-[11px] font-medium px-3 py-1 border border-[#6cb6ca] text-[#6cb6ca] rounded-full">
                Experience
              </span>
            </div>
            <div className="flex gap-4 items-center">
              <img 
                src={content.storyImage} 
                alt="Trekker" 
                className="w-24 h-24 rounded-lg object-cover shrink-0 shadow-sm"
              />
              <p className="text-[13px] text-gray-600 leading-relaxed font-medium">
                {content.storyDescription}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM SECTION: Image Background & White Cards */}
      <div className="relative py-20 px-5 text-white overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${content.bgHeroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-[#2d3a4b]/80 z-10" />

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-20">
          
          {/* Left Text Block */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <h2 className="text-4xl md:text-[2.75rem] font-bold leading-[1.1] text-white uppercase tracking-wide oswald">
              {content.mainTitle}
            </h2>
            
            <div className="w-16 h-1 bg-[#d97736] my-6"></div>

            <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-8 max-w-md">
              {content.description}
            </p>
            <div>
              <button className="bg-[#3bbae6] hover:bg-[#2da1c9] text-white font-semibold text-sm px-6 py-3 rounded shadow-md transition-colors duration-200 cursor-pointer">
                Discover Ever Peak Adventures
              </button>
            </div>
          </div>

          {/* Right Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-5 flex gap-4 items-center shadow-lg text-[#222222]">
                <div className="w-11 h-11 rounded-full border-2 border-[#555555] flex items-center justify-center shrink-0 text-[#555555]">
                  {iconMap[item.iconName] || <ShieldCheck className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-[15px] mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-[11px] leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}