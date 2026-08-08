'use client';

import React, { useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';

export default function NewsletterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setStatus('error');
      setMessage('Please enter your name and email.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Subscription failed. Please try again.');
        return;
      }

      setStatus('success');
      setMessage('Thanks for subscribing!');
      setName('');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Subscription failed. Please try again.');
    }
  }

  return (
    <form className="relative flex items-center gap-2 max-w-md" onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-[#243545] border border-white/10 rounded-md px-3.5 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/30 w-full"
      />
      <input 
        type="email" 
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-[#243545] border border-white/10 rounded-md px-3.5 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/30 w-full"
      />
      <button 
        type="submit"
        disabled={status === 'loading'}
        className="bg-[#243545] hover:bg-[#2f4356] border border-white/10 px-3.5 py-2 rounded-md text-white transition-colors flex items-center justify-center shrink-0 disabled:opacity-60"
        aria-label="Subscribe"
      >
        {status === 'loading' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : status === 'success' ? (
          <Check className="w-4 h-4" />
        ) : (
          <ArrowRight className="w-4 h-4" />
        )}
      </button>
      {message && (
        <span className={`absolute -top-5 right-0 text-[11px] ${status === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>
          {message}
        </span>
      )}
    </form>
  );
}