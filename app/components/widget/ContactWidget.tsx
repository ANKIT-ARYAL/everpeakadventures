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
    "w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200 transition-colors text-left";

  return (
    <>
      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 sm:right-8 z-50 w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.18)] border border-gray-100">
          {/* Header */}
          <div className="bg-[#24a0ed] text-white px-5 py-4 flex items-center justify-between">
            <div>
              <h3 className="font-black text-base uppercase tracking-wider">Contact Us</h3>
              <p className="text-[11px] text-white/80">
                {view === "form" ? "Send us a message" : "We reply within a few hours"}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-3 bg-[#f6f9fc]">
            {view === "channels" && (
              <>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={channelButtonClass}
                >
                  <FaWhatsapp className="w-6 h-6 text-[#25D366] shrink-0" />
                  <span>
                    <span className="block font-bold text-sm text-[#112233]">WhatsApp</span>
                    <span className="block text-[11px] text-gray-500">{whatsapp}</span>
                  </span>
                </a>

                {viber && (
                  <a
                    href={`viber://chat?number=${viber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={channelButtonClass}
                  >
                    <FaViber className="w-6 h-6 text-[#7360f2] shrink-0" />
                    <span>
                      <span className="block font-bold text-sm text-[#112233]">Viber</span>
                      <span className="block text-[11px] text-gray-500">{viber}</span>
                    </span>
                  </a>
                )}

                <a href={`tel:${phone}`} className={channelButtonClass}>
                  <Phone className="w-5 h-5 text-[#24a0ed] shrink-0" />
                  <span>
                    <span className="block font-bold text-sm text-[#112233]">Phone</span>
                    <span className="block text-[11px] text-gray-500">{phone}</span>
                  </span>
                </a>

                <a href={`mailto:${email}`} className={channelButtonClass}>
                  <Mail className="w-5 h-5 text-[#24a0ed] shrink-0" />
                  <span>
                    <span className="block font-bold text-sm text-[#112233]">Email</span>
                    <span className="block text-[11px] text-gray-500">{email}</span>
                  </span>
                </a>

                <button
                  onClick={() => setView("form")}
                  className={channelButtonClass}
                  type="button"
                >
                  <MessageSquareText className="w-5 h-5 text-[#24a0ed] shrink-0" />
                  <span>
                    <span className="block font-bold text-sm text-[#112233]">Contact Form</span>
                    <span className="block text-[11px] text-gray-500">Send a quick message</span>
                  </span>
                </button>

                <Link href="/contact-us" className={channelButtonClass}>
                  <MapPin className="w-5 h-5 text-[#24a0ed] shrink-0" />
                  <span>
                    <span className="block font-bold text-sm text-[#112233]">Contact Us</span>
                    <span className="block text-[11px] text-gray-500">Full contact page &amp; map</span>
                  </span>
                </Link>
              </>
            )}

            {view === "form" && (
              <>
                {status === "sent" ? (
                  <div className="text-center py-8 space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                    <p className="font-bold text-[#112233] text-sm">Message sent successfully!</p>
                    <p className="text-xs text-gray-500">Our team will get back to you shortly.</p>
                    <button
                      onClick={() => { setView("channels"); setStatus("idle"); }}
                      className="text-xs font-bold text-[#24a0ed] uppercase tracking-wider"
                    >
                      Back to contact options
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#112233] mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#24a0ed] outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#112233] mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#24a0ed] outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#112233] mb-1">Message</label>
                      <textarea
                        required
                        rows={3}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="How can we help you?"
                        className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#24a0ed] outline-none bg-white resize-none"
                      />
                    </div>

                    {status === "error" && (
                      <p className="text-xs text-red-600 font-semibold">Failed to send. Please try again.</p>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="flex-1 bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-wider"
                      >
                        <Send className="w-4 h-4" />
                        {status === "submitting" ? "Sending..." : "Send Message"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setView("channels")}
                        aria-label="Back"
                        className="p-3 rounded-lg border border-gray-200 bg-white text-[#112233] hover:bg-gray-50"
                      >
                        <ArrowLeft className="w-4 h-4" />
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
        className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-50 group flex items-center"
      >
        <span className="hidden sm:block bg-white text-[#112233] font-bold text-sm px-4 py-2.5 rounded-full shadow-lg mr-3 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200">
          Contact Us
        </span>
        <span className="relative flex w-14 h-14">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#24a0ed] opacity-30" />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#24a0ed] shadow-[0_4px_16px_rgba(36,160,237,0.5)] hover:scale-105 transition-transform duration-200">
            <Headset className="w-6 h-6 text-white" />
          </span>
        </span>
      </button>
    </>
  );
}
