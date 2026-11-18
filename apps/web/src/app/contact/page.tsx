'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DEFAULT_APP_SETTINGS, BRAND, validateEnquiry } from '@parshuram/shared';

function ContactFormContent() {
  const searchParams = useSearchParams();
  const prefillPlan = searchParams.get('plan') || '';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredPlan, setPreferredPlan] = useState(prefillPlan);
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    const validation = validateEnquiry({ fullName, email, phone, message });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          preferredPlan,
          message
        })
      });

      if (res.ok) {
        setSuccess(true);
        setFullName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit enquiry.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#050B17] text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Front Desk &amp; Enquiries</span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-display text-white mt-2">
            Contact Parshuram Fitness Gym
          </h1>
          <p className="text-sm text-zinc-300 mt-4 leading-relaxed">
            Have questions about membership, training under Dave, or powerlifting guidance? Drop us a message or visit during floor hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Facility Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-8 shadow-xl">
              <h3 className="text-xl font-bold uppercase font-display text-white mb-6 border-b border-[#1E305C] pb-3">
                Gym Information
              </h3>

              <div className="space-y-6 text-xs">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#0A1128] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white uppercase block mb-0.5">Physical Facility</span>
                    <p className="text-zinc-300 leading-relaxed">{DEFAULT_APP_SETTINGS.address_line1}</p>
                    <p className="text-zinc-400">{DEFAULT_APP_SETTINGS.city}</p>
                    <span className="text-[10px] text-zinc-400 italic mt-0.5 block">Editable placeholder for Dave</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#0A1128] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white uppercase block mb-0.5">Direct Line</span>
                    <p className="text-zinc-300">{DEFAULT_APP_SETTINGS.contact_phone}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#0A1128] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white uppercase block mb-0.5">Email</span>
                    <p className="text-zinc-300">{DEFAULT_APP_SETTINGS.contact_email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#0A1128] border border-gym-silver/40 flex items-center justify-center text-gym-silver shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white uppercase block mb-0.5">Operating Hours</span>
                    <p className="text-zinc-300">Mon - Sat: {DEFAULT_APP_SETTINGS.opening_hours_weekdays}</p>
                    <p className="text-zinc-400">Sunday: {DEFAULT_APP_SETTINGS.opening_hours_weekends}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Free check-in note */}
            <div className="bg-[#0A1128] rounded-xl border border-[#1E305C] p-6 text-xs text-zinc-300 flex items-center space-x-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <span>
                Zero check-in fees. All enrolled members scan their QR code on the mobile app for immediate floor clearance.
              </span>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-[#101B37] rounded-2xl border border-[#1E305C] p-8 shadow-xl">
            <h3 className="text-xl font-bold uppercase font-display text-white mb-2">
              Send Dave &amp; The Coaching Team a Message
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              We respond to all prospective member queries within 24 hours.
            </p>

            {success ? (
              <div className="bg-emerald-950/40 border border-emerald-600 rounded-xl p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Enquiry Received!</h4>
                <p className="text-xs text-zinc-300 max-w-md mx-auto">
                  Thank you for reaching out to Parshuram Fitness Gym. Coach Dave or our front desk supervisor has received your message and will contact you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 px-4 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-xs font-bold text-white hover:border-[#D4AF37]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white text-xs placeholder-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                    />
                    {errors.fullName && <p className="text-[10px] text-[#D4AF37] mt-0.5">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white text-xs placeholder-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                    />
                    {errors.phone && <p className="text-[10px] text-[#D4AF37] mt-0.5">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white text-xs placeholder-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                    />
                    {errors.email && <p className="text-[10px] text-[#D4AF37] mt-0.5">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Preferred Plan / Topic</label>
                    <select
                      value={preferredPlan}
                      onChange={(e) => setPreferredPlan(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                    >
                      <option value="">General Facility Tour</option>
                      <option value="Monthly Warrior Plan">Monthly Warrior Plan</option>
                      <option value="Quarterly Discipline Plan">Quarterly Discipline Plan</option>
                      <option value="Annual Divine Elite Plan">Annual Divine Elite Plan</option>
                      <option value="Personal Coaching with Dave">Personal Coaching with Dave</option>
                      <option value="Powerlifting & Form Check">Powerlifting &amp; Form Check</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Your Message or Fitness Goal</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your fitness history, any past injuries, or what you want to achieve..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white text-xs placeholder-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                  />
                  {errors.message && <p className="text-[10px] text-[#D4AF37] mt-0.5">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-black/60 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting...' : 'Send Message to Dave'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050B17] text-white p-8">Loading contact form...</div>}>
      <ContactFormContent />
    </Suspense>
  );
}


