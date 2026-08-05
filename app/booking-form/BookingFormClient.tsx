'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle2 } from 'lucide-react';
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

export default function BookingFormClient({ trips }: Props) {
  const searchParams = useSearchParams();
  const tripIdParam = searchParams.get('trip_id');

  const selectedTrip = trips.find(t => t.id === tripIdParam) || trips[0] || {
    id: 'default',
    title: 'Nepal Heritage, Wildlife & Himalayan Discovery Tour',
    duration: '9 days',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop'
  };

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

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Validation failed. Check inputs.');
      }

      toast.success('Booking request submitted successfully!');
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-5">
        <Toaster position="top-center" />
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-black oswald uppercase text-[#112233]">Booking Request Received!</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Thank you, <span className="font-bold text-gray-800">{form.fullName}</span>. Our team will contact you shortly.
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
            Submit Another Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] py-12 px-4 font-sans text-xs text-gray-800">
      <Toaster position="top-center" />
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 space-y-8">
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#24a0ed]"></span>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wide oswald text-[#112233]">Book Your Trek</h1>
          </div>
          <p className="text-gray-400 text-xs">Send your trek booking request. Our team will review and contact you shortly.</p>
        </div>

        {/* Selected Trip Banner */}
        <div className="p-4 rounded-xl border border-blue-100 bg-[#f8fbff] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <img 
              src={selectedTrip.image} 
              alt={selectedTrip.title} 
              className="w-16 h-12 object-cover rounded-lg border border-gray-200 shadow-sm"
            />
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Selected Trip</span>
              <h3 className="font-bold text-sm text-[#112233]">{selectedTrip.title}</h3>
            </div>
          </div>
          <div className="flex items-center gap-6 text-right w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-blue-100">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Duration</span>
              <span className="font-bold text-gray-700">{selectedTrip.duration}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block">From</span>
              <span className="font-bold text-[#24a0ed] text-sm">US$ {selectedTrip.price} PP</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-1.5">
            <label className="font-bold text-gray-700 uppercase tracking-wider block">Choose Trek / Tour *</label>
            <select 
              name="tripTitle"
              value={form.tripTitle}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white font-medium text-xs focus:outline-none focus:border-[#24a0ed]"
            >
              {trips.map(t => (
                <option key={t.id} value={t.title}>{t.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-gray-700 uppercase tracking-wider block">No. of Persons / Price (Auto-calculated) *</label>
            <input 
              type="text" 
              readOnly
              value={form.groupSize}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-bold text-xs text-[#24a0ed] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 uppercase tracking-wider block">Full Name *</label>
              <input 
                type="text" 
                name="fullName"
                required
                value={form.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:border-[#24a0ed]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 uppercase tracking-wider block">Email Address *</label>
              <input 
                type="email" 
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:border-[#24a0ed]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 uppercase tracking-wider block">Country (Quick Search) *</label>
              <Select
                options={countryOptions}
                value={selectedCountryOption}
                onChange={handleCountryChange}
                placeholder="Select or type country..."
                required
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: '0.75rem',
                    padding: '2px',
                    borderColor: '#e5e7eb',
                    fontSize: '0.75rem',
                    boxShadow: 'none',
                    '&:hover': { borderColor: '#24a0ed' }
                  }),
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 uppercase tracking-wider block">Phone / WhatsApp *</label>
              <input 
                type="tel" 
                name="phone"
                required
                value={form.phone}
                onChange={handlePhoneChange}
                placeholder="Select country first"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:border-[#24a0ed]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-gray-700 uppercase tracking-wider block">Preferred Travel Date *</label>
            <input 
              type="date" 
              name="travelDate"
              required
              min={new Date().toISOString().split('T')[0]}
              value={form.travelDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:border-[#24a0ed]"
            />
          </div>

          <div className="space-y-2">
            <label className="font-bold text-gray-700 uppercase tracking-wider block">Traveller Details *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 space-y-1">
                <span className="text-[10px] text-gray-400 font-bold block">Adult Male</span>
                <input 
                  type="number" 
                  min={0}
                  name="adultMale"
                  value={form.adultMale}
                  onChange={handleChange}
                  className="w-full font-bold text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5"
                />
              </div>

              <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 space-y-1">
                <span className="text-[10px] text-gray-400 font-bold block">Adult Female</span>
                <input 
                  type="number" 
                  min={0}
                  name="adultFemale"
                  value={form.adultFemale}
                  onChange={handleChange}
                  className="w-full font-bold text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5"
                />
              </div>

              <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 space-y-1">
                <span className="text-[10px] text-gray-400 font-bold block">Child Male</span>
                <input 
                  type="number" 
                  min={0}
                  name="childMale"
                  value={form.childMale}
                  onChange={handleChange}
                  className="w-full font-bold text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5"
                />
              </div>

              <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 space-y-1">
                <span className="text-[10px] text-gray-400 font-bold block">Child Female</span>
                <input 
                  type="number" 
                  min={0}
                  name="childFemale"
                  value={form.childFemale}
                  onChange={handleChange}
                  className="w-full font-bold text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5"
                />
              </div>
            </div>
            <p className="text-[10px] text-gray-400">Total travellers: <strong className="text-gray-700">{totalTravellers}</strong></p>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-gray-700 uppercase tracking-wider block">Notes / Special Request</label>
            <textarea 
              rows={4}
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Tell us about your travel plan, arrival date, hotel, or any custom request."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:border-[#24a0ed]"
            />
          </div>

          <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Estimated Total</span>
              <span className="text-2xl font-black text-[#112233] oswald">US$ {estimatedTotalNum.toLocaleString()}</span>
            </div>
            <span className="text-[11px] text-gray-500 max-w-xs text-right">
              US$ {selectedTrip.price} × {totalTravellers || 1} traveller(s).
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              name="agreed"
              id="agreed"
              required
              checked={form.agreed}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-[#24a0ed] focus:ring-[#24a0ed]"
            />
            <label htmlFor="agreed" className="text-gray-600 font-medium">
              I agree to be contacted about this booking request. *
            </label>
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className="w-full bg-[#112233] hover:bg-[#24a0ed] text-white font-bold py-4 rounded-xl uppercase tracking-wider text-xs transition-colors shadow-sm disabled:opacity-50"
          >
            {submitting ? 'Submitting Request...' : 'Submit Booking Request'}
          </button>

        </form>

      </div>
    </div>
  );
}