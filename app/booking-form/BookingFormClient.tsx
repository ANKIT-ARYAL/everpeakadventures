/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle2, Info } from 'lucide-react';
import Select from '@/app/components/ui/ClientSelect';
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
  groupPrices?: { groupSize: string; groupType: string; price: string }[];
}

interface Props {
  trips: TripOption[];
  logoImage?: string;
}

export default function BookingFormClient({ trips, logoImage }: Props) {
  const searchParams = useSearchParams();
  
  const tripIdParam = searchParams.get('trip_id');
  const departureIdParam = searchParams.get('departure_id');
  const departureStartParam = searchParams.get('departure_start');
  const pricePerPersonParam = Number(searchParams.get('pp'));

  const isFixedDeparture = !!departureIdParam || !!departureStartParam;

  const initialTrip = trips.find(t => t.id === tripIdParam) || trips[0] || {
    id: 'default',
    title: 'Nepal Heritage, Wildlife & Himalayan Discovery Tour',
    type: 'tour' as const,
    duration: '9 days',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop'
  };

  const basePrice = pricePerPersonParam > 0 ? pricePerPersonParam : initialTrip.price;

  const [form, setForm] = useState<{
    tripTitle: string;
    groupSize: string;
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
    tripTitle: initialTrip.title,
    groupSize: '1 Person (Private) - US$ ' + basePrice + ' PP',
    fullName: '',
    email: '',
    phone: '',
    country: '',
    travelDate: departureStartParam || '',
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

  const selectedTrip = React.useMemo(() => {
    return trips.find(t => t.title === form.tripTitle) || initialTrip;
  }, [trips, form.tripTitle, initialTrip]);

  const selectedTripType = selectedTrip.type;

  const totalTravellers = Number(form.adultMale || 0) + Number(form.adultFemale || 0) + Number(form.childMale || 0) + Number(form.childFemale || 0);

  const availableGroups = React.useMemo(() => {
    const fixedGroups = [
      { label: '1 Person (Private)', type: 'Private' },
      { label: '2-4 Persons (Small Group)', type: 'Small Group' },
      { label: '5-9 Persons (Best Value)', type: 'Best Value' },
      { label: '10+ Persons (Super Group)', type: 'Super Group' }
    ];

    return fixedGroups.map(fg => {
      const dbGroup = selectedTrip.groupPrices?.find(gp => gp.groupType?.toLowerCase() === fg.type.toLowerCase());
      const currentBasePrice = (isFixedDeparture && pricePerPersonParam > 0) ? pricePerPersonParam : (selectedTrip.price || 0);
      
      let priceVal = currentBasePrice;
      if (!isFixedDeparture && dbGroup && dbGroup.price && dbGroup.price.trim() !== '') {
        const parsed = parseFloat(dbGroup.price.replace(/,/g, '').replace(/US\$\s?/i, ''));
        if (!isNaN(parsed) && parsed > 0) {
          priceVal = parsed;
        }
      }
      
      return `${fg.label} - US$ ${priceVal} PP`;
    });
  }, [selectedTrip, isFixedDeparture, pricePerPersonParam]);

  React.useEffect(() => {
    let targetIndex = 0;
    if (totalTravellers >= 10) {
      targetIndex = 3;
    } else if (totalTravellers >= 5) {
      targetIndex = 2;
    } else if (totalTravellers >= 2) {
      targetIndex = 1;
    } else {
      targetIndex = 0;
    }
    
    if (availableGroups[targetIndex]) {
      setForm(prev => ({ ...prev, groupSize: availableGroups[targetIndex] }));
    }
  }, [totalTravellers, availableGroups]);

  const getSelectedTierPrice = () => {
    if (isFixedDeparture && pricePerPersonParam > 0) return pricePerPersonParam;
    
    const match = (form.groupSize || '').match(/US\$\s*([\d,.]+)/i);
    if (match) {
      const parsed = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(parsed)) return parsed;
    }
    return selectedTrip.price || 0;
  };

  const estimatedTotalNum = getSelectedTierPrice() * (totalTravellers || 1);

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

  const handleTripChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isFixedDeparture) return;
    const newTrip = trips.find(t => t.title === e.target.value);
    if (newTrip) {
      setForm(prev => ({ ...prev, tripTitle: newTrip.title }));
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
        groupSize: isFixedDeparture ? `Fixed Departure (${totalTravellers} pax)` : form.groupSize,
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
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
        <Toaster position="top-center" />
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100 text-center space-y-5">
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto" />
          <h2 className="text-3xl sm:text-4xl font-black oswald uppercase text-[#112233]">Booking Request Received!</h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
            Thank you, <span className="font-bold text-gray-900">{form.fullName}</span>. Our team will review your details and contact you shortly.
          </p>
          <button 
            onClick={() => { 
              setSuccess(false); 
              setSelectedCountryOption(null);
              setForm({ 
                tripTitle: initialTrip.title, 
                groupSize: '1 Person (Private) - US$ ' + basePrice + ' PP',
                fullName: '', email: '', phone: '', country: '', 
                travelDate: departureStartParam || '', 
                adultMale: 1, adultFemale: 0, childMale: 0, childFemale: 0, notes: '', agreed: false 
              }); 
            }} 
            className="w-full sm:w-auto px-8 bg-[#112233] hover:bg-[#1a2b44] text-white font-bold text-lg py-4 rounded-xl uppercase tracking-wider transition-colors"
          >
            Submit Another Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <Toaster position="top-center" />
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Top Header Block */}
        <div className="p-6 sm:p-10 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-gray-50/50">
          <img
            src={logoImage || "https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png"}
            alt="Ever Peak Adventures"
            className="w-16 h-16 object-contain"
          />
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#112233]">
              {selectedTripType === 'tour' ? 'Book Your Tour' : 'Book Your Trek'}
            </h1>
            <p className="text-gray-600 text-lg sm:text-xl mt-1">
              {selectedTripType === 'tour'
                ? 'Send your tour booking request. Our team will review and contact you shortly.'
                : 'Send your trek booking request. Our team will review and contact you shortly.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">

          {/* Selected Trip Overview */}
          <div className="bg-[#f8fafc] p-5 sm:p-6 rounded-2xl border border-gray-100 grid grid-cols-1 sm:grid-cols-[auto_1fr_auto_auto] gap-4 sm:gap-6 items-center">
            <img src={selectedTrip.image} alt={selectedTrip.title} className="w-full sm:w-24 h-20 rounded-xl object-cover" />
            <div>
              <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Selected Trip</span>
              <span className="text-lg font-black text-[#112233]">{selectedTrip.title}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Duration</span>
              <span className="text-lg font-bold text-[#112233]">{selectedTrip.duration} Days</span>
            </div>
            <div>
              <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">From</span>
              <span className="text-lg font-bold text-[#112233]">US$ {basePrice} PP</span>
            </div>
          </div>

          {/* Core Selection Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-bold text-gray-700 mb-2">Choose Trek / Tour <span className="text-red-500">*</span></label>
              <select
                name="tripTitle"
                value={form.tripTitle}
                onChange={handleTripChange}
                disabled={isFixedDeparture}
                className={`w-full p-4 border border-gray-200 rounded-xl text-lg sm:text-xl focus:border-[#1a5b88] focus:outline-none ${
                  isFixedDeparture ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : 'bg-white'
                }`}
              >
                {trips.map(t => (
                  <option key={t.id} value={t.title}>{t.title}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-2">
                {isFixedDeparture ? 'Destination is fixed to this fixed-departure trip.' : 'Direct booking URL includes this trek/tour automatically.'}
              </p>
            </div>

            {/* CONDITIONAL: Fixed Departure Logic vs Standard Logic */}
            {departureStartParam ? (
              <>
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2">Selected Travel Date <span className="text-red-500">*</span></label>
                  <select disabled className="w-full p-4 border border-gray-200 rounded-xl text-lg sm:text-xl bg-gray-50 text-gray-600 focus:outline-none cursor-not-allowed">
                    <option>Guaranteed - From {departureStartParam} - US$ {basePrice} PP</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-2">Available fixed departure dates for selected trek/tour. Start and end dates are saved with the booking.</p>
                </div>

                <div className="bg-[#f0f7fb] border border-[#d2eaf7] p-5 rounded-2xl">
                  <span className="block text-xs text-[#1a5b88] font-bold uppercase tracking-wider mb-1">Selected Fixed Departure</span>
                  <h4 className="font-bold text-[#112233] text-xl">Guaranteed - From {departureStartParam}</h4>
                  <p className="text-[#1a5b88] text-xl font-bold mt-1">US$ {basePrice} PP</p>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Preferred Travel Date <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  name="travelDate"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={form.travelDate}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-200 rounded-xl text-lg sm:text-xl bg-white focus:border-[#1a5b88] focus:outline-none"
                />
              </div>
            )}
            
            {!isFixedDeparture && (
              <div className="col-span-1 md:col-span-2">
                <label className="block text-lg font-bold text-gray-700 mb-2">No. of Persons / Price <span className="text-red-500">*</span></label>
                <select
                  name="groupSize"
                  value={form.groupSize}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-200 rounded-xl text-lg sm:text-xl bg-white text-[#1a5b88] font-bold focus:border-[#1a5b88] focus:outline-none"
                >
                  {availableGroups.map((group, idx) => (
                    <option key={idx} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-lg font-bold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
              <input type="text" name="fullName" required value={form.fullName} onChange={handleChange} placeholder="Your full name" className="w-full p-4 border border-gray-200 rounded-xl text-lg sm:text-xl focus:border-[#1a5b88] focus:outline-none" />
            </div>
            <div>
              <label className="block text-lg font-bold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
              <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" className="w-full p-4 border border-gray-200 rounded-xl text-lg sm:text-xl focus:border-[#1a5b88] focus:outline-none" />
            </div>
            <div>
              <label className="block text-lg font-bold text-gray-700 mb-2">Country <span className="text-red-500">*</span></label>
              <Select
                options={countryOptions}
                value={selectedCountryOption}
                onChange={handleCountryChange}
                placeholder="Select country..."
                required
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: '0.75rem',
                    padding: '8px',
                    borderColor: '#e5e7eb',
                    fontSize: '1.125rem',
                    boxShadow: 'none',
                    '&:hover': { borderColor: '#1a5b88' }
                  }),
                }}
              />
            </div>
            <div>
              <label className="block text-lg font-bold text-gray-700 mb-2">Phone / WhatsApp <span className="text-red-500">*</span></label>
              <input type="tel" name="phone" required value={form.phone} onChange={handlePhoneChange} placeholder="Select country first" className="w-full p-4 border border-gray-200 rounded-xl text-lg sm:text-xl focus:border-[#1a5b88] focus:outline-none" />
            </div>
          </div>

          {/* Traveler Details */}
          <div>
            <label className="block text-lg font-bold text-gray-700 mb-3">Traveller Details <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-5 border border-gray-100 rounded-2xl">
              <div>
                <span className="block text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">Adult Male</span>
                <NumberInput type="number" min="0" name="adultMale" value={form.adultMale} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl text-lg focus:border-[#1a5b88] focus:outline-none bg-white" />
              </div>
              <div>
                <span className="block text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">Adult Female</span>
                <NumberInput type="number" min="0" name="adultFemale" value={form.adultFemale} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl text-lg focus:border-[#1a5b88] focus:outline-none bg-white" />
              </div>
              <div>
                <span className="block text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">Child Male</span>
                <NumberInput type="number" min="0" name="childMale" value={form.childMale} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl text-lg focus:border-[#1a5b88] focus:outline-none bg-white" />
              </div>
              <div>
                <span className="block text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">Child Female</span>
                <NumberInput type="number" min="0" name="childFemale" value={form.childFemale} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl text-lg focus:border-[#1a5b88] focus:outline-none bg-white" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2.5 flex items-center gap-1.5">
              <Info className="w-4 h-4" /> Total travellers: <strong className="text-gray-800">{totalTravellers}</strong>.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-lg font-bold text-gray-700 mb-2">Notes / Special Request</label>
            <textarea 
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4} 
              placeholder="Tell us about your travel plan, arrival date, hotel, or any custom request."
              className="w-full p-4 border border-gray-200 rounded-2xl text-lg focus:border-[#1a5b88] focus:outline-none resize-none"
            ></textarea>
          </div>

          {/* Estimated Total Block */}
          <div className="bg-gray-50 border border-gray-200 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="block text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Estimated Total</span>
              <div className="text-3xl sm:text-4xl font-black text-[#112233]">
                US$ {estimatedTotalNum.toLocaleString()}
              </div>
            </div>
            <div className="text-base text-gray-500 md:text-right max-w-md">
              US$ {basePrice} × {totalTravellers} traveller(s). Final price may change after confirmation, availability, and custom requests.
            </div>
          </div>

          {/* Terms & Submit */}
          <div className="pt-4">
            <label className="flex items-center gap-3 cursor-pointer mb-8">
              <input 
                type="checkbox" 
                name="agreed"
                checked={form.agreed}
                onChange={handleChange}
                required
                className="w-5 h-5 text-[#1a5b88] border-gray-300 rounded focus:ring-[#1a5b88]"
              />
              <span className="text-lg text-gray-700 font-medium">I agree to be contacted about this booking request.</span>
            </label>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full sm:w-auto bg-[#113255] hover:bg-[#1a5b88] text-white px-10 py-4 rounded-xl font-bold text-xl shadow-md transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}