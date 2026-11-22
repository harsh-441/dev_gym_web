'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LinkComponent from 'next/link';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  BookOpen,
  CreditCard,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { BRAND } from '@parshuram/shared';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('pfg_user_token');
    if (!token) {
      router.replace('/auth/login');
      return;
    }
    fetch('/api/admin/videos', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
      .then((response) => {
        if (response.ok) setAuthorized(true);
        else router.replace('/auth/login');
      })
      .catch(() => router.replace('/auth/login'));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('pfg_user_token');
    localStorage.removeItem('pfg_user_email');
    localStorage.removeItem('pfg_user_role');
    localStorage.removeItem('pfg_user_name');
    router.push('/auth/login');
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Members', href: '/admin/members', icon: Users },
    { label: 'Member Attendance', href: '/admin/attendance', icon: CalendarCheck },
    { label: 'Content & Exercises', href: '/admin/content', icon: BookOpen },
    { label: 'Membership Plans', href: '/admin/memberships', icon: CreditCard },
    { label: 'Prospective Enquiries', href: '/admin/enquiries', icon: MessageSquare },
    { label: 'System Settings', href: '/admin/settings', icon: Settings },
  ];

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#050B17] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B17] text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0A1128] border-r border-[#1E305C] flex flex-col justify-between shrink-0">
        <div>
          {/* Owner Profile Header */}
          <div className="p-5 border-b border-[#1E305C] flex items-center space-x-3 bg-[#050B17]/40">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#D4AF37] shadow-md">
              <img src="/images/kapil-dev-owner.jpeg" alt="Kapil Dev" className="h-full w-full object-cover" />
            </div>
            <div>
              <span className="text-sm font-black uppercase tracking-wider text-white font-display block">
                Kapil Dev (Owner)
              </span>
              <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest block">
                Owner Administration
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <LinkComponent
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] shadow-md shadow-black/50 font-black'
                      : 'text-slate-300 hover:text-white hover:bg-[#101B37]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </LinkComponent>
              );
            })}
          </nav>
        </div>

        {/* Bottom links */}
        <div className="p-4 border-t border-[#1E305C] space-y-2 bg-[#050B17]/30">
          <LinkComponent
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#101B37]"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
          </LinkComponent>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/30 text-left transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Switch Role / Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-[#050B17] overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
