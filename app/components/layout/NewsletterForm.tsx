'use client';

import React, { useState } from 'react';
import { ArrowRight, Check, Loader2, Mail } from 'lucide-react';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().trim().email({ message: 'Please enter a valid email address.' }),
});

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = newsletterSchema.safeParse({ email });
    if (!result.success) {
      setStatus('error');
      setMessage(result.error.issues[0].message);
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: result.data.email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Subscription failed. Please try again.');
        return;
      }

      setStatus('success');
      setMessage('Thanks for subscribing!');
      setEmail('');

      // Automatically reset back to normal input state after 4 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 4000);
    } catch {
      setStatus('error');
      setMessage('Subscription failed. Please try again.');
    }
  }

  return (
    <form className="relative flex flex-col sm:flex-row items-center gap-3 w-full px-5 lg:px-20 pb-8" onSubmit={handleSubmit}>
      <div className="relative w-full">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="email" 
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') {
              setStatus('idle');
              setMessage('');
            }
          }}
          className="w-full bg-[#0b1521]/50 border border-white/10 rounded-lg pl-12 pr-4 py-3.5 text-lg text-[#EFE6D8] placeholder-gray-400 focus:outline-none focus:border-accent-amber/50 transition-colors"
        />
      </div>
      <button 
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        className="w-full sm:w-auto bg-accent-amber hover:bg-amber-600 text-[#112233] font-bold px-8 py-3.5 rounded-lg transition-colors flex items-center justify-center shrink-0 disabled:opacity-80 whitespace-nowrap cursor-pointer"
      >
        {status === 'loading' ? (
          <Loader2 className="w-5 h-5 animate-spin mx-auto" />
        ) : status === 'success' ? (
          <span className="flex items-center gap-2"><Check className="w-5 h-5" /> Subscribed</span>
        ) : (
          <span className="flex items-center gap-2">Subscribe <ArrowRight className="w-4 h-4" /></span>
        )}
      </button>
      {message && (
        <span className={`absolute bottom-0 left-5 lg:left-20 text-sm font-medium ${status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
          {message}
        </span>
      )}
    </form>
  );
}