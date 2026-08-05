import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function Footer() {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <footer className="relative bg-[#152331] text-white font-sans overflow-hidden">
      
      {/* Background Image with dark overlay matching live site */}
      <div 
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `url(${settings?.footerBgImage || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000&auto=format&fit=crop"})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-[#121f2c]/95 z-10" />

      <div className="max-w-[1200px] mx-auto px-5 pt-16 pb-10 relative z-20">
        
        {/* TOP ROW: Logo, Newsletter Form, Contact details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-white/10 items-start">
          
          {/* Logo Column */}
          <div className="lg:col-span-3 pt-1">
            <Link href="/" className="inline-block">
              <img 
                src={settings?.logoImage || "https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png"} 
                alt="Ever Peak Adventures" 
                className="h-[55px] w-auto object-contain"
              />
            </Link>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-5 pt-1">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-3 text-white">
              Subscribe our Newsletter
            </h4>
            <form className="flex items-center gap-2 max-w-md">
              <input 
                type="text" 
                placeholder="Name" 
                className="bg-[#243545] border border-white/10 rounded-md px-3.5 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/30 w-full"
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="bg-[#243545] border border-white/10 rounded-md px-3.5 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/30 w-full"
              />
              <button 
                type="submit"
                className="bg-[#243545] hover:bg-[#2f4356] border border-white/10 px-3.5 py-2 rounded-md text-white transition-colors flex items-center justify-center shrink-0"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Contact Information Column */}
          <div className="lg:col-span-4 text-xs space-y-4 text-gray-300">
            
            {/* Emergency SOS */}
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#3bbae6] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white text-[13px] mb-0.5">{settings?.emergencyLabel || "Emergency SOS (24/7):"}</p>
                <p className="leading-relaxed">Landline: {settings?.emergencyLandline || "+977 98000000"}</p>
                <p className="leading-relaxed"><a href={`tel:${settings?.emergencyPhone || "9851093960"}`} className="hover:text-white">Phone: {settings?.emergencyPhone || "9851093960"}</a></p>
                <p className="leading-relaxed"><a href={`https://wa.me/${settings?.whatsapp || "9851093960"}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">Whatsapp: {settings?.whatsapp || "9851093960"}</a></p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#3bbae6] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white text-[13px] mb-0.5">Email:</p>
                <p><a href={`mailto:${settings?.email || "info@everpeakadventures.com"}`} className="hover:text-white">{settings?.email || "info@everpeakadventures.com"}</a></p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#3bbae6] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white text-[13px] mb-0.5">Address:</p>
                <p className="leading-relaxed">{settings?.addressLine1 || "Payutar Dhara"}</p>
                <p><a href={settings?.addressMapUrl || "https://maps.app.goo.gl/1vfJx36bEbCc7UAu9"} target="_blank" rel="noopener noreferrer" className="hover:text-white">{settings?.addressLine2 || "Kathmandu, Nepal"}</a></p>
              </div>
            </div>

          </div>

        </div>

        {/* MIDDLE ROW: 5 Navigation Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-10 border-b border-white/10 text-xs">
          
          {/* Column 1: Popular Trekking */}
          <div>
            <h4 className="font-bold text-white text-[13px] uppercase tracking-wider mb-4">
              Popular Trekking
            </h4>
            <ul className="space-y-2.5 text-gray-400">
              <li><Link href="/?taxonomy=trekking-types&term=everest-region" className="hover:text-white transition-colors">Everest Region</Link></li>
              <li><Link href="/?taxonomy=trekking-types&term=adventure-trek" className="hover:text-white transition-colors">Manaslu Region</Link></li>
              <li><Link href="/trekking-types/annapurna-region/" className="hover:text-white transition-colors">Annapurna Region</Link></li>
              <li><Link href="/trekking-types/langtang-region/" className="hover:text-white transition-colors">Langtang Region</Link></li>
              <li><Link href="/trekking-types/mustang-region/" className="hover:text-white transition-colors">Mustang Region</Link></li>
              <li><Link href="/trekking-types/kanchenjunga-region/" className="hover:text-white transition-colors">Kanchenjunga Region</Link></li>
            </ul>
          </div>

          {/* Column 2: Tour Categories */}
          <div>
            <h4 className="font-bold text-white text-[13px] uppercase tracking-wider mb-4">
              Tour Categories
            </h4>
            <ul className="space-y-2.5 text-gray-400">
              <li><Link href="/?taxonomy=tour-types&term=adventure-tours" className="hover:text-white transition-colors">Adventure Sports</Link></li>
              <li><Link href="/?taxonomy=tour-types&term=culture-nature-tours" className="hover:text-white transition-colors">Culture + Nature Tours</Link></li>
              <li><Link href="/?taxonomy=tour-types&term=day-tours-in-nepal" className="hover:text-white transition-colors">Day Tours</Link></li>
              <li><Link href="/?taxonomy=tour-types&term=multi-country" className="hover:text-white transition-colors">Multi Country Tours</Link></li>
            </ul>
          </div>

          {/* Column 3: Popular Tours */}
          <div>
            <h4 className="font-bold text-white text-[13px] uppercase tracking-wider mb-4">
              Popular Tours
            </h4>
            <ul className="space-y-2.5 text-gray-400">
              <li><Link href="/?taxonomy=tour-types&term=spiritual-tours" className="hover:text-white transition-colors">Spiritual Tours</Link></li>
              <li><Link href="/?taxonomy=tour-types&term=village-tours" className="hover:text-white transition-colors">Village Tours</Link></li>
              <li><Link href="/?taxonomy=tour-types&term=wildlife-safari-tours" className="hover:text-white transition-colors">Wildlife Safari Tours</Link></li>
              <li><Link href="/?taxonomy=tour-types&term=cultural-tours-4-tours" className="hover:text-white transition-colors">Cultural Tours</Link></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="font-bold text-white text-[13px] uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-gray-400">
              <li><Link href="/?page_id=7551" className="hover:text-white transition-colors">About us</Link></li>
              <li><Link href="/?post_type=our-team" className="hover:text-white transition-colors">Our Team</Link></li>
              <li><Link href="/?page_id=5760" className="hover:text-white transition-colors">Responsible Tourism</Link></li>
              <li><Link href="/?post_type=legal-document" className="hover:text-white transition-colors">Registrations & Affiliations</Link></li>
            </ul>
          </div>

          {/* Column 5: Useful Links */}
          <div>
            <h4 className="font-bold text-white text-[13px] uppercase tracking-wider mb-4">
              Useful Links
            </h4>
            <ul className="space-y-2.5 text-gray-400">
              <li><Link href="/?page_id=4326" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/?page_id=4320" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/?page_id=5142" className="hover:text-white transition-colors">B2B Partner</Link></li>
              <li><Link href="/?taxonomy=gallery-types&term=photos-gallery" className="hover:text-white transition-colors">Gallery</Link></li>
            </ul>
          </div>

        </div>

        {/* BOTTOM ROW: Associations, Copyright, Payment Badges */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-6 text-[11.5px] text-gray-400">
          
          {/* Associations */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-black text-[#3bbae6] tracking-wider uppercase text-xs mr-1">ASSOCIATIONS:</span>
            <span className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">NTB</span>
            <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">TAAN</span>
            <span className="bg-green-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">NMA</span>
            <span className="bg-emerald-700 text-white font-bold px-2 py-0.5 rounded text-[10px]">Tripadvisor</span>
          </div>

          {/* Copyright Notice */}
          <div className="text-center">
            <p>{settings?.copyrightText || "Copyright © 2026 Everpeak Adventures | Design By Fly Up Technology"}</p>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-2">
            <span className="bg-[#00a651] text-white font-extrabold text-[10px] px-2 py-0.5 rounded tracking-wide">eSewa</span>
            <span className="bg-[#eb001b] text-white font-extrabold text-[10px] px-2 py-0.5 rounded tracking-wide">Mastercard</span>
            <span className="bg-[#1a1f71] text-white font-extrabold text-[10px] px-2 py-0.5 rounded tracking-wide">VISA</span>
            <span className="bg-[#5c2d91] text-white font-extrabold text-[10px] px-2 py-0.5 rounded tracking-wide">Khalti</span>
          </div>

        </div>

      </div>
    </footer>
  );
}