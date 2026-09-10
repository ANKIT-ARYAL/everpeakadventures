"use client";

import { whatsappUrl } from "@/app/lib/whatsapp";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Mail, MessageSquareText, X, ArrowLeft, CheckCircle2, MapPin, Send, Headset } from "lucide-react";
import { FaWhatsapp, FaViber } from "react-icons/fa";
import { submitContactForm } from "@/app/actions/contact";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

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
  const reduceMotion = useReducedMotion();

  if (!enabled) return null;

  const openPanel = () => {
    setOpen(true);
    setView("channels");
    setStatus("idle");
    setForm({ name: "", email: "", message: "" });
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

  const channelItems = [
    {
      label: "WhatsApp",
      value: whatsapp,
      icon: <FaWhatsapp className="w-5 h-5 text-[#25D366]" />,
      bg: "bg-[#25D366]/10",
      href: whatsappUrl(whatsapp),
      external: true,
    },
    ...(viber ? [{
      label: "Viber",
      value: viber,
      icon: <FaViber className="w-5 h-5 text-[#7360f2]" />,
      bg: "bg-[#7360f2]/10",
      href: `viber://chat?number=${viber}`,
      external: true,
    }] : []),
    {
      label: "Phone Call",
      value: phone,
      icon: <Phone className="w-5 h-5 text-[#24a0ed]" />,
      bg: "bg-[#24a0ed]/10",
      href: `tel:${phone}`,
      external: false,
    },
    {
      label: "Email Us",
      value: email,
      icon: <Mail className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-500/10",
      href: `mailto:${email}`,
      external: false,
    },
    {
      label: "Quick Message",
      value: "Send an inquiry instantly",
      icon: <MessageSquareText className="w-5 h-5 text-[#112233]" />,
      bg: "bg-[#112233]/10",
      action: () => setView("form"),
      external: false,
    },
    {
      label: "Our Office",
      value: "View map & details",
      icon: <MapPin className="w-5 h-5 text-gray-700" />,
      bg: "bg-gray-200/60",
      href: "/contact-us",
      external: false,
    },
  ];

  const easing = reduceMotion ? "easeOut" : [0.32, 0.72, 0, 1] as const;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.4, ease: easing }}
            className="fixed bottom-24 right-5 sm:right-8 z-50 w-[380px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-[2rem]"
          >
            {/* Outer Shell - Double Bezel */}
            <div className="relative bg-white/5 dark:bg-black/5 ring-1 ring-black/5 dark:ring-white/10 p-1.5 rounded-[2rem] shadow-[0_20px_60px_rgba(17,34,51,0.18)]">
              {/* Inner Core */}
              <div className="relative bg-white dark:bg-[#0a0a0a] rounded-[calc(2rem-0.375rem)] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                
                {/* Header */}
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0.1 : 0.4, delay: 0.05, ease: easing }}
                  className="relative bg-[#112233] px-6 py-5 flex items-start justify-between overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
                  <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-amber-500/30 rounded-full blur-[40px] pointer-events-none" />

                  <div className="relative z-10">
                    <h3 className="font-display font-semibold text-white text-lg tracking-tight mb-0.5">
                      {view === "form" ? "Send a Message" : "How can we help?"}
                    </h3>
                    <p className="text-xs text-gray-300 font-sans">
                      {view === "form" ? "Our local experts will get back to you soon." : "We typically reply within a few hours."}
                    </p>
                  </div>

                  <motion.button
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ duration: 0.15, ease: easing }}
                    className="relative z-10 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </motion.div>

                <div className="p-4 space-y-2.5 bg-gray-50/50 dark:bg-[#0f0f0f]/50 max-h-[420px] overflow-y-auto">
                  {view === "channels" && (
                    <motion.div
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: reduceMotion ? 0.1 : 0.5, delay: 0.1, ease: easing }}
                    >
                      {channelItems.map((item, index) => (
                        <AnimatePresence key={item.label}>
                          {item.action ? (
                            <motion.button
                              onClick={item.action}
                              type="button"
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ duration: 0.15, ease: easing }}
                              layout
                              className="group w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white hover:bg-gray-50/80 dark:bg-[#1a1a1a] dark:hover:bg-[#222] border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 shadow-sm hover:shadow text-left relative overflow-hidden"
                            >
                              <motion.div
                                whileHover={{ scale: 1.08 }}
                                transition={{ duration: 0.2, ease: easing }}
                                className={`${item.bg} p-2.5 rounded-xl shrink-0`}
                              >
                                {item.icon}
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <span className="block font-bold text-sm text-[#112233] dark:text-white">{item.label}</span>
                                <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 truncate">{item.value}</span>
                              </div>
                              <motion.div
                                whileHover={{ x: 3, scale: 1.1 }}
                                transition={{ duration: 0.2, ease: easing }}
                                className="w-4 h-4 text-gray-300 dark:text-gray-500 group-hover:text-[#112233] dark:group-hover:text-white"
                              >
                                <Send className="w-4 h-4" />
                              </motion.div>
                            </motion.button>
                          ) : item.href ? (
                            <motion.a
                              href={item.href}
                              target={item.external ? "_blank" : undefined}
                              rel={item.external ? "noopener noreferrer" : undefined}
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ duration: 0.15, ease: easing }}
                              layout
                              className="group w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white hover:bg-gray-50/80 dark:bg-[#1a1a1a] dark:hover:bg-[#222] border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 shadow-sm hover:shadow text-left relative overflow-hidden"
                            >
                              <motion.div
                                whileHover={{ scale: 1.08 }}
                                transition={{ duration: 0.2, ease: easing }}
                                className={`${item.bg} p-2.5 rounded-xl shrink-0`}
                              >
                                {item.icon}
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <span className="block font-bold text-sm text-[#112233] dark:text-white">{item.label}</span>
                                <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 truncate">{item.value}</span>
                              </div>
                              <motion.div
                                whileHover={{ x: 3, scale: 1.1 }}
                                transition={{ duration: 0.2, ease: easing }}
                                className="w-4 h-4 text-gray-300 dark:text-gray-500 group-hover:text-[#112233] dark:group-hover:text-white"
                              >
                                <Send className="w-4 h-4" />
                              </motion.div>
                            </motion.a>
                          ) : null}
                        </AnimatePresence>
                      ))}
                    </motion.div>
                  )}

                  {view === "form" && (
                    <AnimatePresence mode="wait">
                      {status === "sent" ? (
                        <motion.div
                          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                          transition={{ duration: reduceMotion ? 0.1 : 0.4, ease: easing }}
                          className="text-center py-8 space-y-3"
                        >
                          <motion.div
                            initial={reduceMotion ? false : { scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: reduceMotion ? 0.1 : 0.6, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] as const }}
                            className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto"
                          >
                            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                          </motion.div>
                          <motion.div
                            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: reduceMotion ? 0.1 : 0.4, delay: 0.25, ease: easing }}
                          >
                            <p className="font-bold text-[#112233] dark:text-white text-lg mb-1">Message Sent!</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 px-3">Thank you for reaching out. Our team will get back to you shortly.</p>
                          </motion.div>
                          <motion.button
                            onClick={() => { setView("channels"); setStatus("idle"); }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.15, ease: easing }}
                            className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-[#112233] dark:hover:text-white bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-2.5 shadow-sm transition-all"
                          >
                            Back to Options
                          </motion.button>
                        </motion.div>
                      ) : (
                        <motion.form
                          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                          transition={{ duration: reduceMotion ? 0.1 : 0.4, ease: easing }}
                          onSubmit={handleSubmit}
                          className="space-y-3"
                        >
                          <motion.div
                            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: reduceMotion ? 0.1 : 0.3, delay: 0.1, ease: easing }}
                          >
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 px-0.5">Full Name</label>
                            <input
                              type="text"
                              required
                              value={form.name}
                              onChange={(e) => setForm({ ...form, name: e.target.value })}
                              placeholder="John Doe"
                              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none bg-white dark:bg-[#1a1a1a] text-[#112233] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-sm"
                            />
                          </motion.div>
                          <motion.div
                            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: reduceMotion ? 0.1 : 0.3, delay: 0.15, ease: easing }}
                          >
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 px-0.5">Email Address</label>
                            <input
                              type="email"
                              required
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              placeholder="john@example.com"
                              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none bg-white dark:bg-[#1a1a1a] text-[#112233] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-sm"
                            />
                          </motion.div>
                          <motion.div
                            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: reduceMotion ? 0.1 : 0.3, delay: 0.2, ease: easing }}
                          >
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 px-0.5">Your Message</label>
                            <textarea
                              required
                              rows={3}
                              value={form.message}
                              onChange={(e) => setForm({ ...form, message: e.target.value })}
                              placeholder="How can we help you plan your trip?"
                              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none bg-white dark:bg-[#1a1a1a] text-[#112233] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none transition-all shadow-sm"
                            />
                          </motion.div>

                          {status === "error" && (
                            <motion.p
                              initial={reduceMotion ? false : { opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs text-red-600 dark:text-red-400 font-semibold px-0.5"
                            >
                              Failed to send message. Please try again.
                            </motion.p>
                          )}

                          <motion.div
                            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: reduceMotion ? 0.1 : 0.3, delay: 0.25, ease: easing }}
                            className="flex items-center gap-2 pt-1"
                          >
                            <motion.button
                              type="button"
                              onClick={() => setView("channels")}
                              aria-label="Back"
                              whileHover={{ scale: 1.05, rotate: -8 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.15, ease: easing }}
                              className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-400 hover:text-[#112233] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#222] transition-all shadow-sm"
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              type="submit"
                              disabled={status === "submitting"}
                              whileHover={{ scale: 1.01, boxShadow: "0 8px 30px rgba(17,34,51,0.25)" }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ duration: 0.15, ease: easing }}
                              className="flex-1 bg-[#112233] hover:bg-amber-500 dark:bg-[#112233] dark:hover:bg-amber-500 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md group"
                            >
                              {status === "submitting" ? "Sending..." : "Send Message"}
                              {status !== "submitting" && (
                                <motion.div
                                  whileHover={{ x: 3, y: -1, scale: 1.15 }}
                                  transition={{ duration: 0.2, ease: easing }}
                                  className="w-3.5 h-3.5"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </motion.div>
                              )}
                            </motion.button>
                          </motion.div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-label="Contact Us"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.15, ease: easing }}
        className="fixed bottom-6 right-5 sm:right-8 z-50 group flex items-center"
      >
        <motion.span
          initial={reduceMotion ? false : { opacity: 0, x: 12 }}
          animate={{ opacity: open ? 0 : 1, x: open ? -12 : 0 }}
          exit={{ opacity: 0, x: 12 }}
          transition={{ duration: reduceMotion ? 0.1 : 0.25, ease: easing }}
          className="hidden sm:flex bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md border border-gray-100 dark:border-gray-800 text-[#112233] dark:text-white font-bold text-xs px-3.5 py-2 rounded-full shadow-[0_4px_20px_rgba(17,34,51,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] mr-3"
        >
          Contact Us
        </motion.span>
        <span className="relative flex w-14 h-14">
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-30"
          />
          <motion.span
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.15, ease: easing }}
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#112233] to-[#1e334a] shadow-[0_8px_25px_rgba(17,34,51,0.25)] border border-white/15 dark:border-gray-800/50"
          >
            {open ? (
              <motion.div
                animate={{ rotate: 45 }}
                transition={{ duration: 0.3, ease: easing }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Headset className="w-6 h-6 text-amber-500" />
              </motion.div>
            )}
          </motion.span>
        </span>
      </motion.button>
    </>
  );
}