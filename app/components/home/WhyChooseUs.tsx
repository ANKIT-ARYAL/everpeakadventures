interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface WhyChooseUsProps {
  features: Feature[];
}

export default function WhyChooseUs({ features = [] }: WhyChooseUsProps) {
  return (
    <section className="py-16 px-5 bg-[#fafbfc] font-sans">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col items-center">
          <span className="bg-[#eaf5fc] text-[#45b7f3] text-[10px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-full mb-4">
            Why Choose Us
          </span>
          
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-3">
            Why Choose <span className="text-[#fca020]">Ever Peak Adventures</span>?
          </h2>
          
          <p className="text-[#666666] text-[14px] leading-relaxed">
            We combine years of Himalayan expertise, personalized service, and a passion for adventure to deliver safe, authentic, and unforgettable trekking experiences throughout Nepal.
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_6px_25px_rgb(0,0,0,0.06)] transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-[#45b7f3] rounded-xl flex items-center justify-center text-xl mb-4 shadow-sm">
                {feature.icon}
              </div>
              
              <h3 className="text-[1rem] font-bold text-[#333333] mb-2">
                {feature.title}
              </h3>
              
              <p className="text-gray-500 text-[12px] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}