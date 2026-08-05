'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import Select from 'react-select';
import { getCountries, getCountryCallingCode, isValidPhoneNumber, AsYouType } from 'libphonenumber-js';

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
const countryOptions = getCountries().map((countryCode) => {
  const dialCode = `+${getCountryCallingCode(countryCode)}`;
  return {
    value: countryCode, 
    label: `${regionNames.of(countryCode)} (${dialCode})`,
    name: regionNames.of(countryCode) || countryCode,
    dialCode: dialCode
  };
}).sort((a, b) => a.label.localeCompare(b.label));

interface TripOption {
  id: string;
  title: string;
  duration: string;
  price: number;
  image: string;
}

interface Props {
  trips: TripOption[];
}

export default function SendInquiryClient({ trips }: Props) {
  const searchParams = useSearchParams();
  const tripIdParam = searchParams.get('trip_id');

  const selectedTrip = trips.find(t => t.id === tripIdParam) || trips[0] || {
    id: 'default',
    title: 'Nepal Heritage, Wildlife & Himalayan Discovery Tour',
    duration: '9 days',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop'
  };

  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    tripTitle: selectedTrip.title,
    groupSize: '1 Pax - Solo Traveller',
    fullName: '',
    email: '',
    phone: '',
    country: '',
    travelDate: '',
    adultMale: 1,
    adultFemale: 0,
    childMale: 0,
    childFemale: 0,
    notes: '',
    agreed: false,
  });

  const [selectedCountryOption, setSelectedCountryOption] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalTravellers = form.adultMale + form.adultFemale + form.childMale + form.childFemale;

  useEffect(() => {
    let tier = '1 Pax - Solo Traveller';
    if (totalTravellers >= 5) {
      tier = `5+ Pax - Group Discount (US$ ${selectedTrip.price} PP)`;
    } else if (totalTravellers >= 2) {
      tier = `2-4 Pax - Small Group (US$ ${selectedTrip.price} PP)`;
    } else {
      tier = `1 Pax - Solo Traveller (US$ ${selectedTrip.price} PP)`;
    }
    setForm(prev => ({ ...prev, groupSize: tier }));
  }, [totalTravellers, selectedTrip.price]);

  const estimatedTotalNum = selectedTrip.price * (totalTravellers || 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setForm(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setForm(prev => ({ ...prev, [name]: Math.max(0, Number(value)) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = new AsYouType().input(e.target.value);
    setForm(prev => ({ ...prev, phone: formatted }));
  };

  const handleCountryChange = (option: any) => {
    setSelectedCountryOption(option);
    setForm(prev => ({
      ...prev,
      country: option.name,
      phone: option.dialCode + ' '
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !form.country.trim()) {
      toast.error('Fields cannot contain only whitespace.');
      setSubmitting(false);
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (form.travelDate < todayStr) {
      toast.error('Travel date cannot be in the past.');
      setSubmitting(false);
      return;
    }

    if (!isValidPhoneNumber(form.phone)) {
      toast.error('Enter a valid phone number.');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...form,
        estimatedTotal: `US$ ${estimatedTotalNum}`,
      };

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Validation failed. Check inputs.');
      }

      toast.success('Inquiry submitted successfully!');
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-5 bg-white">
        <Toaster position="top-center" />
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-black oswald uppercase text-[#112233]">Inquiry Received!</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Thank you, <span className="font-bold text-gray-800">{form.fullName}</span>. Our team will review your inquiry and contact you shortly.
          </p>
          <button 
            onClick={() => { 
              setSuccess(false); 
              setSelectedCountryOption(null);
              setForm({ 
                tripTitle: selectedTrip.title, groupSize: '1 Pax - Solo Traveller',
                fullName: '', email: '', phone: '', country: '', travelDate: '',
                adultMale: 1, adultFemale: 0, childMale: 0, childFemale: 0,
                notes: '', agreed: false 
              }); 
            }} 
            className="w-full bg-[#112233] text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider mt-4"
          >
            Submit Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-xs text-gray-800">
      <Toaster position="top-center" />
      
      {/* Hero Header Section */}
      <section className="relative py-24 bg-[#112233] text-white text-center">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider oswald">Send Inquiry</h1>
      </section>

      {/* Main Container Card */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 pb-24 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 space-y-8 border border-gray-100">
          
          <div className="space-y-1">
            <h2 className="text-xl font-black uppercase tracking-tight text-[#112233]">Book Your Trek</h2>
            <p className="text-gray-400 text-[11px]">Send your trek booking request. Our team will review and contact you shortly.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 uppercase tracking-wider text-[11px] block">Choose Trek / Tour *</label>
              <select 
                name="tripTitle"
                value={form.tripTitle}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white font-medium text-xs text-gray-700 focus:outline-none focus:border-[#24a0ed]"
              >
                {trips.map(t => (
                  <option key={t.id} value={t.title}>{t.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 uppercase tracking-wider text-[11px] block">No. of Persons / Price *</label>
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  readOnly
                  value={form.groupSize}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 font-bold text-xs text-[#24a0ed] focus:outline-none"
                />
                <button 
                  type="button" 
                  onClick={() => window.open('https://wa.me/', '_blank')}
                  className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 font-bold text-gray-700 rounded-full flex items-center gap-2 shrink-0 transition-colors shadow-sm text-xs"
                >
                  <span>Contact Us</span>
                  <MessageCircle className="w-3.5 h-3.5 text-[#24a0ed]" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 uppercase tracking-wider text-[11px] block">Full Name *</label>
                <input 
                  type="text" 
                  name="fullName"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none focus:border-[#24a0ed]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 uppercase tracking-wider text-[11px] block">Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none focus:border-[#24a0ed]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 uppercase tracking-wider text-[11px] block">Phone / WhatsApp *</label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handlePhoneChange}
                  placeholder="Select country first"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none focus:border-[#24a0ed]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 uppercase tracking-wider text-[11px] block">Country *</label>
                {mounted ? (
                  <Select
                    options={countryOptions}
                    value={selectedCountryOption}
                    onChange={handleCountryChange}
                    placeholder="Select or type country..."
                    required
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: '0.5rem',
                        padding: '2px',
                        borderColor: '#e5e7eb',
                        fontSize: '0.75rem',
                        boxShadow: 'none',
                        '&:hover': { borderColor: '#24a0ed' }
                      }),
                    }}
                  />
                ) : (
                  <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 text-xs">
                    Loading countries...
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 uppercase tracking-wider text-[11px] block">Preferred Travel Date *</label>
              <input 
                type="date" 
                name="travelDate"
                required
                min={new Date().toISOString().split('T')[0]}
                value={form.travelDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none focus:border-[#24a0ed]"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-gray-700 uppercase tracking-wider text-[11px] block">Traveller Details *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50/40 space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold block">Adult Male</span>
                  <input type="number" min={0} name="adultMale" value={form.adultMale} onChange={handleChange} className="w-full font-bold text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5" />
                </div>
                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50/40 space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold block">Adult Female</span>
                  <input type="number" min={0} name="adultFemale" value={form.adultFemale} onChange={handleChange} className="w-full font-bold text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5" />
                </div>
                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50/40 space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold block">Child Male</span>
                  <input type="number" min={0} name="childMale" value={form.childMale} onChange={handleChange} className="w-full font-bold text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5" />
                </div>
                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50/40 space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold block">Child Female</span>
                  <input type="number" min={0} name="childFemale" value={form.childFemale} onChange={handleChange} className="w-full font-bold text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5" />
                </div>
              </div>
              <p className="text-[10px] text-gray-400">Total travellers: <strong className="text-gray-700">{totalTravellers}</strong>. Price tier is selected automatically from the No. of Persons option.</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 uppercase tracking-wider text-[11px] block">Notes / Special Request</label>
              <textarea 
                rows={3}
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Tell us about your travel plan, arrival date, hotel, or any custom request."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none focus:border-[#24a0ed]"
              />
            </div>

            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Estimated Total</span>
                <span className="text-xl font-black text-[#112233] oswald">US$ {estimatedTotalNum.toLocaleString()}</span>
              </div>
              <span className="text-[11px] text-gray-500 max-w-xs text-right">
                Add traveller details to calculate estimated cost. Final price may change after confirmation.
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <input 
                type="checkbox" 
                name="agreed"
                id="agreed"
                required
                checked={form.agreed}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-[#24a0ed] focus:ring-[#24a0ed]"
              />
              <label htmlFor="agreed" className="text-gray-600 font-medium text-xs">
                I agree to be contacted about this booking request. *
              </label>
            </div>

            <button 
              type="submit"
              disabled={submitting}
              className="w-full bg-[#112233] hover:bg-[#24a0ed] text-white font-bold py-3.5 rounded-lg uppercase tracking-wider text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Submitting Request...' : 'Submit Booking Request'}
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}