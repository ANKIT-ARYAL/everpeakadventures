"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MessageSquareText, Headset, X, ArrowLeft, CheckCircle2, MapPin, Send } from "lucide-react";
import { FaWhatsapp, FaViber } from "react-icons/fa";
import { submitContactForm } from "@/app/actions/contact";

interface ContactWidgetProps {
  enabled: boolean;
  whatsapp: string;
  viber: string;
  phone: string;
  email: string;
}

type View = "channels" | "form";
type Status = "idle" | "submitting" | "sent" | "error";

export default function ContactWidget({
  enabled,
  whatsapp,
  viber,
  phone,
  email,
}: ContactWidgetProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("channels");
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  if (!enabled) return null;

  const openPanel = () => {
    setOpen(true);
    setView("channels");
    setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData();
    const nameParts = form.name.trim().split(/\s+/);
    formData.set("firstName", nameParts[0] ?? "");
    formData.set("lastName", nameParts.slice(1).join(" ") || "");
    formData.set("email", form.email.trim());
    formData.set("phone", "");
    formData.set("contactMethod", "Widget");
    formData.set("bestTime", "");
    formData.set("message", form.message.trim());

    const result = await submitContactForm(formData);
    setStatus(result.success ? "sent" : "error");
  };

  const channelButtonClass =
    "group w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] bg-white hover:bg-gradient-to-r hover:from-white hover:to-gray-50 border border-gray-100 hover:border-accent-amber/30 transition-all duration-300 hover:shadow-md text-left relative overflow-hidden";

  return (
    <>
      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 sm:right-8 z-50 w-[calc(100vw-2.5rem)] overflow-hidden rounded-[2rem] bg-white/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(17,34,51,0.15)] border border-white/50 animate-in slide-in-from-bottom-8 fade-in duration-300 px-5 lg:px-20">
          
          {/* Header */}
          <div className="relative bg-[#112233] px-6 py-6 flex items-start justify-between overflow-hidden">
            {/* Abstract Header BG */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent-amber rounded-full blur-[50px] pointer-events-none" />

            <div className="relative z-10">
              <h3 className="font-display font-medium text-white text-xl tracking-tight mb-1">
                {view === "form" ? "Send a Message" : "How can we help?"}
              </h3>
              <p className="text-sm text-gray-300 font-sans">
                {view === "form" ? "Our local experts will get back to you soon." : "We typically reply within a few hours."}
              </p>
            </div>
            
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="relative z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md border border-white/10 mt-0.5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-3 bg-[#f8fafc]/50">
            {view === "channels" && (
              <>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={channelButtonClass}
                >
                  <div className="bg-[#25D366]/10 p-3 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                    <FaWhatsapp className="w-6 h-6 text-[#25D366]" />
                  </div>
                  <div>
                    <span className="block font-bold text-[15px] text-[#112233] mb-0.5">WhatsApp</span>
                    <span className="block text-xs font-semibold text-gray-500">{whatsapp}</span>
                  </div>
                  <div className="absolute right-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-gray-400">
                    <Send className="w-4 h-4" />
                  </div>
                </a>

                {viber && (
                  <a
                    href={`viber://chat?number=${viber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={channelButtonClass}
                  >
                    <div className="bg-[#7360f2]/10 p-3 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                      <FaViber className="w-6 h-6 text-[#7360f2]" />
                    </div>
                    <div>
                      <span className="block font-bold text-[15px] text-[#112233] mb-0.5">Viber</span>
                      <span className="block text-xs font-semibold text-gray-500">{viber}</span>
                    </div>
                  </a>
                )}

                <a href={`tel:${phone}`} className={channelButtonClass}>
                  <div className="bg-[#24a0ed]/10 p-3 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-[#24a0ed]" />
                  </div>
                  <div>
                    <span className="block font-bold text-[15px] text-[#112233] mb-0.5">Phone Call</span>
                    <span className="block text-xs font-semibold text-gray-500">{phone}</span>
                  </div>
                </a>

                <a href={`mailto:${email}`} className={channelButtonClass}>
                  <div className="bg-[#f59e0b]/10 p-3 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-[#f59e0b]" />
                  </div>
                  <div>
                    <span className="block font-bold text-[15px] text-[#112233] mb-0.5">Email Us</span>
                    <span className="block text-xs font-semibold text-gray-500 line-clamp-1">{email}</span>
                  </div>
                </a>

                <button
                  onClick={() => setView("form")}
                  className={channelButtonClass}
                  type="button"
                >
                  <div className="bg-[#112233]/10 p-3 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                    <MessageSquareText className="w-6 h-6 text-[#112233]" />
                  </div>
                  <div>
                    <span className="block font-bold text-[15px] text-[#112233] mb-0.5">Quick Message</span>
                    <span className="block text-xs font-semibold text-gray-500">Send an inquiry instantly</span>
                  </div>
                </button>

                <Link href="/contact-us" className={channelButtonClass}>
                  <div className="bg-gray-100 p-3 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <span className="block font-bold text-[15px] text-[#112233] mb-0.5">Our Office</span>
                    <span className="block text-xs font-semibold text-gray-500">View map &amp; details</span>
                  </div>
                </Link>
              </>
            )}

            {view === "form" && (
              <>
                {status === "sent" ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                      <p className="font-bold text-[#112233] text-xl mb-1">Message Sent!</p>
                      <p className="text-sm text-gray-500 px-4">Thank you for reaching out. Our team will get back to you shortly.</p>
                    </div>
                    <button
                      onClick={() => { setView("channels"); setStatus("idle"); }}
                      className="text-sm font-bold text-gray-500 hover:text-[#112233] transition-colors mt-4 bg-white border border-gray-200 rounded-xl px-6 py-2.5 shadow-sm"
                    >
                      Back to Contact Options
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 px-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-[1rem] text-[15px] focus:ring-2 focus:ring-accent-amber/50 focus:border-accent-amber outline-none bg-white transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 px-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-[1rem] text-[15px] focus:ring-2 focus:ring-accent-amber/50 focus:border-accent-amber outline-none bg-white transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 px-1">Your Message</label>
                      <textarea
                        required
                        rows={3}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="How can we help you plan your trip?"
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-[1rem] text-[15px] focus:ring-2 focus:ring-accent-amber/50 focus:border-accent-amber outline-none bg-white resize-none transition-all shadow-sm"
                      />
                    </div>

                    {status === "error" && (
                      <p className="text-sm text-red-600 font-semibold px-1">Failed to send message. Please try again.</p>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setView("channels")}
                        aria-label="Back"
                        className="p-3.5 rounded-[1rem] border border-gray-200 bg-white text-gray-500 hover:text-[#112233] hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="flex-1 bg-[#112233] hover:bg-accent-amber text-white font-bold py-3.5 rounded-[1rem] text-[15px] flex items-center justify-center gap-2 disabled:opacity-70 transition-all shadow-md group"
                      >
                        {status === "submitting" ? "Sending..." : "Send Message"}
                        {!status && <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-label="Contact Us"
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 group flex items-center"
      >
        <span className="hidden sm:flex bg-white/95 backdrop-blur-md border border-white/50 text-[#112233] font-bold text-sm px-4 py-2.5 rounded-full shadow-[0_8px_30px_rgba(17,34,51,0.12)] mr-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 items-center gap-2">
          Contact Us
        </span>
        <span className="relative flex w-16 h-16">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-amber opacity-40" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#112233] to-[#2c3e50] shadow-[0_8px_30px_rgba(17,34,51,0.25)] hover:shadow-[0_12px_40px_rgba(17,34,51,0.35)] hover:scale-105 transition-all duration-300 border border-white/10 group-hover:rotate-12">
            {open ? <X className="w-7 h-7 text-white" /> : <Headset className="w-7 h-7 text-accent-amber" />}
          </span>
        </span>
      </button>
    </>
  );
}
