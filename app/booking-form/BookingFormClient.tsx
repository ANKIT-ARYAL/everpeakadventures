'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle2, Info } from 'lucide-react';
import Select from 'react-select';
import { getCountries, getCountryCallingCode, isValidPhoneNumber, AsYouType } from 'libphonenumber-js';
import NumberInput from '@/app/components/NumberInput';

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
  type: 'trek' | 'tour';
  duration: string;
  price: number;
  image: string;
}

interface Props {
  trips: TripOption[];
  logoImage?: string;
}

export default function BookingFormClient({ trips, logoImage }: Props) {
  const searchParams = useSearchParams();
  
  // URL Parameters
  const tripIdParam = searchParams.get('trip_id');
  const departureIdParam = searchParams.get('departure_id');
  const departureStartParam = searchParams.get('departure_start');
  const pricePerPersonParam = Number(searchParams.get('pp'));

  // Fixed departures are locked: destination and date come from the departure link.
  const isFixedDeparture = !!departureIdParam || !!departureStartParam;

  // Find selected trip
  const selectedTrip = trips.find(t => t.id === tripIdParam) || trips[0] || {
    id: 'default',
    title: 'Nepal Heritage, Wildlife & Himalayan Discovery Tour',
    type: 'tour' as const,
    duration: '9 days',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop'
  };

  // Determine the actual base price (URL override for Fixed Departures vs Standard Price)
  const basePrice = pricePerPersonParam > 0 ? pricePerPersonParam : selectedTrip.price;

  const [form, setForm] = useState<{
    tripTitle: string;
    fullName: string;
    email: string;
    phone: string;
    country: string;
    travelDate: string;
    adultMale: number | string;
    adultFemale: number | string;
    childMale: number | string;
    childFemale: number | string;
    notes: string;
    agreed: boolean;
  }>({
    tripTitle: selectedTrip.title,
    fullName: '',
    email: '',
    phone: '',
    country: '',
    travelDate: departureStartParam || '', // Pre-fill if fixed departure
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

  // Determine the trip type from the currently selected trip in the dropdown
  const selectedTripType = trips.find(t => t.title === form.tripTitle)?.type || selectedTrip.type;

  const totalTravellers = Number(form.adultMale || 0) + Number(form.adultFemale || 0) + Number(form.childMale || 0) + Number(form.childFemale || 0);

  // Derive group size tier from traveller count (aligns with how Admin displays bookings)
  const derivedGroupSize =
    totalTravellers >= 5
      ? `5+ Pax - Group Discount (${totalTravellers} travellers)`
      : totalTravellers >= 2
        ? `2-4 Pax - Small Group (${totalTravellers} travellers)`
        : `1 Pax - Solo Traveller`;
  
  // Calculate total price based on active base price and travelers
  const estimatedTotalNum = basePrice * (totalTravellers || 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setForm(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      const parsed = value === '' ? '' : Math.max(0, Number(value));
      setForm(prev => ({ ...prev, [name]: parsed }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle generic trip selection change
  const handleTripChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isFixedDeparture) return;
    const newTrip = trips.find(t => t.title === e.target.value);
    if (newTrip) {      setForm(prev => ({ ...prev, tripTitle: newTrip.title }));
      // We don't change URL params dynamically here to keep it simple, 
      // but it correctly updates the local state form value.
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = new AsYouType(selectedCountryOption?.value).input(e.target.value);
    setForm(prev => ({ ...prev, phone: formatted }));
  };

  const handleCountryChange = (option: any) => {
    setSelectedCountryOption(option);
    setForm(prev => ({
      ...prev,
      country: option.name,
      phone: ''
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

    if (!isValidPhoneNumber(form.phone, selectedCountryOption?.value)) {
      toast.error('Enter a valid phone number.');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        tripTitle: form.tripTitle,
        groupSize: derivedGroupSize,
        fullName: form.fullName,
        email: form.email,
        phone: `${selectedCountryOption?.dialCode || ''} ${form.phone}`.trim(),
        country: form.country,
        travelDate: form.travelDate,
        adultMale: Number(form.adultMale) || 0,
        adultFemale: Number(form.adultFemale) || 0,
        childMale: Number(form.childMale) || 0,
        childFemale: Number(form.childFemale) || 0,
        notes: form.notes,
        agreed: form.agreed,
        isFixedDeparture: !!departureStartParam,
        departureId: departureIdParam,
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
                tripTitle: selectedTrip.title, fullName: '', email: '', phone: '', country: '', 
                travelDate: departureStartParam || '', 
                adultMale: 1, adultFemale: 0, childMale: 0, childFemale: 0, notes: '', agreed: false 
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
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Top Header Block */}
        <div className="p-8 border-b border-gray-100 flex items-center gap-4">
          <img
            src={logoImage || "https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png"}
            alt="Ever Peak Adventures"
            className="w-14 h-14 object-contain"
          />
          <div>
            <h1 className="text-2xl font-black text-[#112233]">
              {selectedTripType === 'tour' ? 'Book Your Tour' : 'Book Your Trek'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {selectedTripType === 'tour'
                ? 'Send your tour booking request. Our team will review and contact you shortly.'
                : 'Send your trek booking request. Our team will review and contact you shortly.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* Selected Trip Overview */}
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 grid grid-cols-1 md:grid-cols-[auto_1fr_auto_auto] gap-6 items-center">
            <img src={selectedTrip.image} alt={selectedTrip.title} className="w-16 h-12 rounded-lg object-cover" />
            <div>
              <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Selected Trip</span>
              <span className="font-bold text-[#112233]">{selectedTrip.title}</span>
            </div>
            <div>
              <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Duration</span>
              <span className="font-bold text-[#112233]">{selectedTrip.duration}</span>
            </div>
            <div>
              <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">From</span>
              <span className="font-bold text-[#112233]">US$ {basePrice} PP</span>
            </div>
          </div>

          {/* Core Selection Fields */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Choose Trek / Tour <span className="text-red-500">*</span></label>
              <select
                name="tripTitle"
                value={form.tripTitle}
                onChange={handleTripChange}
                disabled={isFixedDeparture}
                className={`w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#1a5b88] focus:outline-none ${
                  isFixedDeparture ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : 'bg-white'
                }`}
              >
                {trips.map(t => (
                  <option key={t.id} value={t.title}>{t.title}</option>
                ))}
              </select>
              <p className="text-[10px] text-gray-400 mt-1.5">
                {isFixedDeparture ? 'Destination is fixed to this fixed-departure trip.' : 'Direct booking URL includes this trek/tour automatically.'}
              </p>
            </div>

            {/* CONDITIONAL: Fixed Departure Logic vs Standard Logic */}
            {departureStartParam ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Selected Travel Date <span className="text-red-500">*</span></label>
                  <select disabled className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600 focus:outline-none cursor-not-allowed">
                    <option>Guaranteed - From {departureStartParam} - US$ {basePrice} PP</option>
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1.5">Available fixed departure dates for selected trek/tour. Start and end dates are saved with the booking.</p>
                </div>

                <div className="bg-[#f0f7fb] border border-[#d2eaf7] p-4 rounded-xl">
                  <span className="block text-[10px] text-[#1a5b88] font-bold uppercase tracking-wider mb-1">Selected Fixed Departure</span>
                  <h4 className="font-bold text-[#112233] text-lg">Guaranteed - From {departureStartParam}</h4>
                  <p className="text-[#1a5b88] text-sm font-bold mt-1">US$ {basePrice} PP</p>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Preferred Travel Date <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  name="travelDate"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={form.travelDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus:border-[#1a5b88] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
              <input type="text" name="fullName" required value={form.fullName} onChange={handleChange} placeholder="Your full name" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#1a5b88] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
              <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#1a5b88] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Country <span className="text-red-500">*</span></label>
              <Select
                options={countryOptions}
                value={selectedCountryOption}
                onChange={handleCountryChange}
                placeholder="Select country..."
                required
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: '0.5rem',
                    padding: '2px',
                    borderColor: '#e5e7eb',
                    fontSize: '0.875rem',
                    boxShadow: 'none',
                    '&:hover': { borderColor: '#1a5b88' }
                  }),
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Phone / WhatsApp <span className="text-red-500">*</span></label>
              <input type="tel" name="phone" required value={form.phone} onChange={handlePhoneChange} placeholder="Select country first" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#1a5b88] focus:outline-none" />
            </div>
          </div>

          {/* Traveler Details */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-3">Traveller Details <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50/50 p-4 border border-gray-100 rounded-xl">
              <div>
                <span className="block text-[10px] text-gray-500 font-bold mb-1">Adult Male</span>
                <NumberInput type="number" min="0" name="adultMale" value={form.adultMale} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:border-[#1a5b88] focus:outline-none" />
              </div>
              <div>
                <span className="block text-[10px] text-gray-500 font-bold mb-1">Adult Female</span>
                <NumberInput type="number" min="0" name="adultFemale" value={form.adultFemale} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:border-[#1a5b88] focus:outline-none" />
              </div>
              <div>
                <span className="block text-[10px] text-gray-500 font-bold mb-1">Child Male</span>
                <NumberInput type="number" min="0" name="childMale" value={form.childMale} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:border-[#1a5b88] focus:outline-none" />
              </div>
              <div>
                <span className="block text-[10px] text-gray-500 font-bold mb-1">Child Female</span>
                <NumberInput type="number" min="0" name="childFemale" value={form.childFemale} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:border-[#1a5b88] focus:outline-none" />
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
              <Info className="w-3 h-3" /> Total travellers: <strong className="text-gray-700">{totalTravellers}</strong>.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Notes / Special Request</label>
            <textarea 
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4} 
              placeholder="Tell us about your travel plan, arrival date, hotel, or any custom request."
              className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:border-[#1a5b88] focus:outline-none resize-none"
            ></textarea>
          </div>

          {/* Estimated Total Block */}
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="block text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Estimated Total</span>
              <div className="text-3xl font-black text-[#112233]">
                US$ {estimatedTotalNum.toLocaleString()}
              </div>
            </div>
            <div className="text-xs text-gray-500 md:text-right md:max-w-[300px]">
              US$ {basePrice} × {totalTravellers} traveller(s). Final price may change after confirmation, availability, and custom requests.
            </div>
          </div>

          {/* Terms & Submit */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer mb-6">
              <input 
                type="checkbox" 
                name="agreed"
                checked={form.agreed}
                onChange={handleChange}
                required
                className="w-4 h-4 text-[#1a5b88] border-gray-300 rounded focus:ring-[#1a5b88]"
              />
              <span className="text-sm text-gray-600 font-medium">I agree to be contacted about this booking request.</span>
            </label>

            <button 
              type="submit" 
              disabled={submitting}
              className="bg-[#113255] hover:bg-[#1a5b88] text-white px-8 py-3.5 rounded-lg font-bold text-sm shadow-md transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}