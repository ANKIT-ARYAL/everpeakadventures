"use client";

import React, { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { submitContactForm } from '@/app/actions/contact';

interface ContactInfoProps {
  info: {
    address: string;
    phone: string;
    email: string;
    mapUrl: string;
  };
}

export default function ContactUsClient({ info }: ContactInfoProps) {
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData(event.currentTarget);
    const result = await submitContactForm(formData);

    setSubmitting(false);
    setFeedback(result);

    if (result.success) {
      event.currentTarget.reset();
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9f7] font-sans text-gray-800">
      
      {/* HERO SECTION */}
      <section className="relative py-32 bg-[#112233] text-white overflow-hidden text-center">
        <div 
          className="absolute inset-0 z-0 bg-center bg-cover opacity-40"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop)',
          }}
        />

        <div className="max-w-[1200px] mx-auto px-5 relative z-20">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider oswald mb-4 drop-shadow-md">
            CONTACT US
          </h1>
          <p className="text-white text-sm md:text-base italic max-w-xl mx-auto drop-shadow">
            Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way.
          </p>
        </div>
      </section>

      {/* MAIN CONTACT SECTION */}
      <section className="py-20">
        <div className="max-w-[1100px] mx-auto px-5">
          <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            
            {/* LEFT COLUMN: Company Info & Map */}
            <div className="lg:col-span-5 bg-[#3a225c] text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

              <div>
                <h2 className="text-2xl font-bold mb-8 oswald tracking-wide">
                  Ever Peak Adventure
                </h2>

                <div className="space-y-6 text-xs md:text-sm text-gray-200">
                  <div className="flex items-start gap-3.5">
                    <div className="bg-white/10 p-2.5 rounded-xl shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white mb-0.5">Location</p>
                      <p className="text-gray-300">{info?.address || 'Kathmandu, Nepal'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="bg-white/10 p-2.5 rounded-xl shrink-0 mt-0.5">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white mb-0.5">Phone Number</p>
                      <p className="text-gray-300">{info?.phone || '9851093960'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="bg-white/10 p-2.5 rounded-xl shrink-0 mt-0.5">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white mb-0.5">Email</p>
                      <p className="text-gray-300">{info?.email || 'info@everpeakadventures.com'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Map Embed */}
              <div className="mt-8 rounded-2xl overflow-hidden h-44 border border-white/20 shadow-inner">
                <iframe
                  title="Kathmandu Map"
                  src={info?.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            {/* RIGHT COLUMN: Contact Form */}
            <div className="lg:col-span-7 p-8 md:p-12 bg-white flex flex-col justify-center">
              <h2 className="text-2xl font-black uppercase tracking-tight text-[#112233] mb-1 oswald">
                GET IN TOUCH !
              </h2>
              <p className="text-xs text-gray-500 mb-8 font-medium">
                Lets Help You Get Started
              </p>

              {feedback && (
                <div className={`p-4 mb-6 rounded-xl text-xs font-bold ${feedback.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {feedback.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-600 mb-1.5">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      required
                      placeholder="First Name" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#24a0ed]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-600 mb-1.5">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      required
                      placeholder="Last Name" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#24a0ed]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-600 mb-1.5">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      placeholder="Email" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#24a0ed]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-600 mb-1.5">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      placeholder="Phone Number" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#24a0ed]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-600 mb-1.5">Contact Method</label>
                    <select name="contactMethod" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#24a0ed]">
                      <option>Phone Call</option>
                      <option>WhatsApp</option>
                      <option>Email</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-600 mb-1.5">Best Time to Contact</label>
                    <select name="bestTime" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#24a0ed]">
                      <option>Morning</option>
                      <option>Afternoon</option>
                      <option>Evening</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-600 mb-1.5">Message</label>
                  <textarea 
                    name="message"
                    required
                    rows={4} 
                    placeholder="Message" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#24a0ed]"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="bg-[#3bbae6] hover:bg-[#2da3cc] text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-colors shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Submit'}
                </button>
              </form>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}