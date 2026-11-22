'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  Instagram,
  Navigation,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
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
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            Front Desk &amp; Member Assistance
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-display text-white mt-2">
            Contact Parshuram Fitness Club
          </h1>
          <p className="text-sm text-slate-300 mt-4 leading-relaxed">
            Established in 2016 in Meerut, Uttar Pradesh. Owned and directed by Kapil Dev and Dev Vats. Reach out for membership inquiries, facilities, personal coaching, or visit us in person.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Business Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-8 shadow-xl">
              <h3 className="text-xl font-bold uppercase font-display text-white mb-6 border-b border-[#1E305C] pb-3">
                Official Gym Information
              </h3>

              <div className="space-y-6 text-xs">
                {/* Physical Address */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0A1128] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white uppercase block mb-0.5">Gym Location</span>
                    <a
                      href={BRAND.googleMapsSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-[#D4AF37] leading-relaxed transition-colors block"
                    >
                      {BRAND.address}
                    </a>
                    <span className="text-[11px] text-[#D4AF37] font-semibold mt-1 inline-flex items-center space-x-1">
                      <span>Landmark: {BRAND.landmark}</span>
                    </span>
                  </div>
                </div>

                {/* Direct Phone Numbers */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0A1128] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white uppercase block mb-0.5">Call Us</span>
                    <p className="text-slate-300">
                      Primary: <a href="tel:9897191013" className="hover:text-[#D4AF37] font-semibold underline">9897191013</a>
                    </p>
                    <p className="text-slate-300 mt-0.5">
                      Secondary: <a href="tel:7983626564" className="hover:text-[#D4AF37] font-semibold underline">7983626564</a>
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Contact Persons: Kapil Dev &amp; Dev Vats</span>
                  </div>
                </div>

                {/* WhatsApp Chat */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0A1128] border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white uppercase block mb-0.5">WhatsApp Inquiry</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <a
                        href="https://wa.me/919897191013"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded bg-[#0A1128] border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-950/40 transition-colors inline-flex items-center space-x-1"
                      >
                        <span>9897191013</span>
                      </a>
                      <a
                        href="https://wa.me/917983626564"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded bg-[#0A1128] border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-950/40 transition-colors inline-flex items-center space-x-1"
                      >
                        <span>7983626564</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0A1128] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white uppercase block mb-0.5">Email Contact</span>
                    <a href={`mailto:${BRAND.email}`} className="text-slate-300 hover:text-[#D4AF37] underline">
                      {BRAND.email}
                    </a>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0A1128] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white uppercase block mb-0.5">Gym Opening Hours</span>
                    <p className="text-slate-300">
                      <strong>Monday to Saturday:</strong>
                    </p>
                    <p className="text-slate-300 text-[11px] mt-0.5">
                      • Morning: <strong>5:30 AM – 10:00 AM</strong>
                    </p>
                    <p className="text-slate-300 text-[11px]">
                      • Evening: <strong>5:00 PM – 10:00 PM</strong>
                    </p>
                    <p className="text-rose-400 font-bold mt-1 text-[11px]">
                      Sunday: CLOSED
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block italic">
                      {BRAND.openingHours.holidayNotice}
                    </span>
                  </div>
                </div>

                {/* Social Media */}
                <div className="flex items-start space-x-3.5 pt-2 border-t border-[#1E305C]">
                  <div className="w-10 h-10 rounded-xl bg-[#0A1128] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white uppercase block mb-0.5">Follow On Instagram</span>
                    <a
                      href={BRAND.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-[#D4AF37] font-semibold underline inline-flex items-center space-x-1"
                    >
                      <span>@parshuram_fitness_club</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Actions Card */}
            <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-6 shadow-xl">
              <h4 className="text-sm font-bold uppercase text-white mb-2">Google Maps &amp; Navigation</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Verify the location in Meerut using Meerut City Public School as the landmark. Click below for live interactive navigation:
              </p>
              <a
                href={BRAND.googleMapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions on Google Maps</span>
              </a>

              {/* Interactive Embedded Google Map */}
              <div className="rounded-xl overflow-hidden border border-[#1E305C] bg-[#0A1128] mt-4 aspect-video w-full shadow-inner">
                <iframe
                  title="Parshuram Fitness Club Interactive Map"
                  src="https://maps.google.com/maps?q=Parshuram+Fitness+Club%2C+Ram+Katori+Wali+Gali%2C+Near+Meerut+City+Public+School%2C+Meerut&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-[#101B37] rounded-2xl border border-[#1E305C] p-8 shadow-xl">
            <h3 className="text-xl font-bold uppercase font-display text-white mb-2">
              Send an Enquiry
            </h3>
            <p className="text-xs text-slate-300 mb-6">
              Fill out your details below to inquire about membership, personal training rates, or Karate batches.
            </p>

            {success ? (
              <div className="bg-[#050B17] border border-emerald-500/50 rounded-xl p-8 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white uppercase font-display">
                  Enquiry Submitted Successfully
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to Parshuram Fitness Club. Kapil Dev or Dev Vats will review your details and contact you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2 rounded-lg bg-[#101B37] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1E305C] transition-colors border border-[#1E305C]"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white text-xs placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
                    />
                    {errors.fullName && <p className="text-[10px] text-rose-400 mt-0.5">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9897191013"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white text-xs placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
                    />
                    {errors.phone && <p className="text-[10px] text-rose-400 mt-0.5">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white text-xs placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
                    />
                    {errors.email && <p className="text-[10px] text-rose-400 mt-0.5">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Preferred Plan / Topic</label>
                    <select
                      value={preferredPlan}
                      onChange={(e) => setPreferredPlan(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                    >
                      <option value="">General Facility Tour</option>
                      <option value="Monthly Membership (₹500)">Monthly Membership (₹500)</option>
                      <option value="3 Months Membership (₹1,300)">3 Months Membership (₹1,300)</option>
                      <option value="6 Months Membership (₹2,500)">6 Months Membership (₹2,500)</option>
                      <option value="Yearly Membership (₹5,000)">Yearly Membership (₹5,000)</option>
                      <option value="Personal Training (₹3,000)">Personal Training (₹3,000)</option>
                      <option value="Karate & Self-Defence Training">Karate &amp; Self-Defence Training</option>
                      <option value="Special Offer: Gym Bag">Special Offer: Gym Bag</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Your Message or Fitness Goal</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your fitness targets, experience, or any questions for coaches Kapil Dev & Dev Vats..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white text-xs placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
                  />
                  {errors.message && <p className="text-[10px] text-rose-400 mt-0.5">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-xs uppercase tracking-wider transition-all shadow-lg shadow-black/60 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting...' : 'Send Message to Kapil Dev & Dev Vats'}</span>
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
