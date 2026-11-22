'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, MapPin, Phone, Mail, Instagram, ShieldCheck, Navigation, MessageCircle } from 'lucide-react';
import { BRAND, DEFAULT_APP_SETTINGS } from '@parshuram/shared';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="bg-[#050B17] border-t border-[#1E305C] text-slate-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <BrandLogo variant="footer" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Established in 2016 in Meerut, Uttar Pradesh. Owned and coached by Kapil Dev alongside Dev Vats. We offer cardio, strength training, weight training, CrossFit, functional movement, and Karate self-defence in a respectful and focused environment.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#101B37] text-[#D4AF37] hover:bg-[#17254A] transition-colors border border-[#1E305C]"
                aria-label="Follow Parshuram Fitness Club on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919897191013"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#101B37] text-emerald-400 hover:bg-[#17254A] transition-colors border border-[#1E305C]"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={BRAND.googleMapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#101B37] text-[#D4AF37] hover:bg-[#17254A] transition-colors border border-[#1E305C]"
                aria-label="Google Maps directions"
              >
                <Navigation className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Website Navigation */}
          <div>
            <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-2.5">
              Explore Our Club
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-[#D4AF37] transition-colors">About Us &amp; Mission</Link></li>
              <li><Link href="/pricing" className="hover:text-[#D4AF37] transition-colors">Membership Plans (from ₹500)</Link></li>
              <li><Link href="/facilities" className="hover:text-[#D4AF37] transition-colors">Gym Facilities (7 Zones)</Link></li>
              <li><Link href="/trainers" className="hover:text-[#D4AF37] transition-colors">Coaches: Kapil Dev &amp; Dev Vats</Link></li>
              <li><Link href="/rules" className="hover:text-[#D4AF37] transition-colors">Rules &amp; Regulations (9 Codes)</Link></li>
              <li><Link href="/gallery" className="hover:text-[#D4AF37] transition-colors">Gym Floor Gallery</Link></li>
              <li><Link href="/programs" className="hover:text-[#D4AF37] transition-colors">Workout Programs</Link></li>
              <li><Link href="/nutrition" className="hover:text-[#D4AF37] transition-colors">Nutrition &amp; Indian Meals</Link></li>
            </ul>
          </div>

          {/* Operational Hours */}
          <div>
            <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-2.5">
              Gym Facility Hours
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">Monday – Saturday</span>
                  <span className="text-slate-300 block">• Morning: 5:30 AM – 10:00 AM</span>
                  <span className="text-slate-300 block">• Evening: 5:00 PM – 10:00 PM</span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-rose-400">Sunday</span>
                  <span className="text-slate-400">CLOSED</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#101B37] border border-[#1E305C] text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center text-amber-300 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  <span>Holiday Notice</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  The gym informs members one day before any scheduled holiday.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Details & Verified Address */}
          <div>
            <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-2.5">
              Verified Location
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <a
                  href={BRAND.googleMapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-[#D4AF37] leading-relaxed transition-colors"
                >
                  {BRAND.address}
                  <span className="block text-[10px] text-[#D4AF37] mt-0.5">
                    Landmark: {BRAND.landmark}
                  </span>
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-slate-300">
                  <a href="tel:9897191013" className="hover:text-white underline">9897191013</a>,{' '}
                  <a href="tel:7983626564" className="hover:text-white underline">7983626564</a>
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`mailto:${BRAND.email}`} className="text-slate-300 hover:text-white underline">
                  {BRAND.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-[#1E305C] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {BRAND.name}. Established 2016 in Meerut, UP. Owner: Kapil Dev.</p>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="hover:text-white transition-colors">Member Login</Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-white transition-colors">Owner Console</Link>
            <span>•</span>
            <Link href="/rules" className="hover:text-white transition-colors">Rules</Link>
            <span>•</span>
            <Link href="/pricing" className="text-[#D4AF37] hover:underline">Membership Pricing</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
