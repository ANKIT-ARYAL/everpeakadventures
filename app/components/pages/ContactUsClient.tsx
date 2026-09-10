"use client";

import { whatsappUrl } from "@/app/lib/whatsapp";
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import { submitContactForm } from '@/app/actions/contact';
import SubpageHero from './SubpageHero';

interface ContactInfoProps {
  info: {
    address: string;
    phone: string;
    whatsapp?: string;
    email: string;
    mapUrl: string;
  };
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
}

export default function ContactUsClient({ info, heroTitle, heroSubtitle, heroImage }: ContactInfoProps) {
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Live contact info fetched on the client so admin updates appear without a full page refresh.
  const [liveInfo, setLiveInfo] = useState<any | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/contact-info', { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        if (mounted && json?.success) setLiveInfo(json.data ?? null);
      } catch (err) {
        // ignore - keep server-provided info if fetch fails
      }
    })();
    return () => { mounted = false; };
  }, []);

  const displayInfo = liveInfo ?? info;

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
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* HERO SECTION */}
      <SubpageHero
        title={heroTitle ?? "Get In Touch"}
        subtitle={heroSubtitle ?? "We are here to help you plan the ultimate Himalayan adventure. Reach out to our experts today."}
        image={heroImage ?? "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop"}
      />

      {/* MAIN CONTACT SECTION */}
      <section className="py-24 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-[#f59e0b]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-[#112233]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 px-5 lg:px-20 max-w-[1400px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* LEFT COLUMN: Contact Details */}
            <div className="lg:col-span-5 flex flex-col space-y-10">
              <div>
                <h2 className="text-3xl lg:text-4xl font-display font-medium text-[#112233] mb-4">
                  Let's Talk About Your Next Adventure
                </h2>
                <p className="text-gray-500 text-lg">
                  Whether you have a quick question or want to build a custom itinerary, our local experts are available 24/7.
                </p>
              </div>

              {/* Info Cards */}
              <div className="space-y-6">
                
                {/* Location */}
                <div className="flex gap-5 items-start p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-accent-amber shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#112233] text-lg mb-1">Our Office</h3>
                    <p className="text-gray-500">{displayInfo?.address || 'Thamel, Kathmandu, Nepal'}</p>
                    <p className="text-gray-400 text-sm mt-1">Open for walk-ins</p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex gap-5 items-start p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-accent-amber shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#112233] text-lg mb-1">Direct Contact</h3>
                    <p className="text-gray-500 mb-1 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400"/> {displayInfo?.phone || '+977 9851093960'}
                    </p>
                    <p className="text-gray-500 mb-1 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-green-500"/> <a href={whatsappUrl(displayInfo?.whatsapp || '+977 9851093960')} target="_blank" rel="noopener noreferrer">{displayInfo?.whatsapp || '+977 9851093960'}</a>
                    </p>
                    <p className="text-gray-500 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400"/> {displayInfo?.email || 'info@everpeakadventures.com'}
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-5 items-start p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-accent-amber shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#112233] text-lg mb-1">Business Hours</h3>
                    <p className="text-gray-500 mb-1">Sunday - Friday: 9:00 AM - 6:00 PM (NPT)</p>
                    <p className="text-gray-500">Saturday: Closed (24/7 support for active trekkers)</p>
                  </div>
                </div>

              </div>

              {/* Social Links */}
              <div>
                <h3 className="font-bold text-[#112233] text-sm uppercase tracking-widest mb-4">Follow Our Journeys</h3>
                <div className="flex gap-3">
                  <a href="#" aria-label="Facebook" className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-accent-amber hover:border-accent-amber hover:bg-white transition-all shadow-sm">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/></svg>
                  </a>
                  <a href="#" aria-label="Instagram" className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-accent-amber hover:border-accent-amber hover:bg-white transition-all shadow-sm">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                  <a href="#" aria-label="Twitter" className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-accent-amber hover:border-accent-amber hover:bg-white transition-all shadow-sm">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_20px_60px_rgba(17,34,51,0.08)] border border-gray-100">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-[#112233] mb-2">Send us a message</h3>
                  <p className="text-gray-500">We typically reply within 12 hours.</p>
                </div>

                {feedback && (
                  <div className={`p-4 mb-8 rounded-xl text-md font-bold flex items-center gap-3 ${feedback.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {feedback.success ? '✓' : '⚠'} {feedback.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">First Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="firstName"
                        required
                        placeholder="John" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-md text-[#112233] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-amber/50 focus:border-accent-amber transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Last Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="lastName"
                        required
                        placeholder="Doe" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-md text-[#112233] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-amber/50 focus:border-accent-amber transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        placeholder="john@example.com" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-md text-[#112233] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-amber/50 focus:border-accent-amber transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Phone Number / WhatsApp</label>
                      <input 
                        type="text" 
                        name="phone"
                        placeholder="+1 234 567 8900" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-md text-[#112233] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-amber/50 focus:border-accent-amber transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Your Message <span className="text-red-500">*</span></label>
                    <textarea 
                      name="message"
                      required
                      placeholder="Tell us about the trek you are interested in, group size, or any custom requirements..." 
                      rows={5}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-md text-[#112233] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-amber/50 focus:border-accent-amber transition-all resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-[#112233] hover:bg-accent-amber text-white font-bold text-lg py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 group"
                  >
                    {submitting ? 'Sending Message...' : 'Send Message'}
                    {!submitting && <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-4">
                    Your information is secure. We do not share your email with third parties.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FULL WIDTH MAP SECTION */}
      <section className="h-[500px] w-full bg-gray-100 relative">
        <iframe
          title="Our Location"
          src={displayInfo?.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.246473636257!2d85.3150!3d27.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zThe Kathmandu!5e0!3m2!1sen!2snp!4v1650000000000!5m2!1sen!2snp"}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-700"
        />
      </section>

    </div>
  );
}