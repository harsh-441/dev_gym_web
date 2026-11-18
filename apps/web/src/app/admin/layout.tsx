'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarCheck,
  CalendarOff,
  BookOpen,
  CreditCard,
  MessageSquare,
  Settings,
  LogOut,
  Shield,
  ExternalLink
} from 'lucide-react';
import { BRAND } from '@parshuram/shared';
import BrandLogo from '@/components/BrandLogo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Access control: Only Dave (super_admin) or admin can access Owner panel
    const role = localStorage.getItem('pfg_user_role');
    const email = localStorage.getItem('pfg_user_email');

    // If no user is logged in, default set to Dave for dev inspection convenience, or redirect if non-admin logged in
    if (email && role && role !== 'super_admin' && role !== 'admin') {
      alert('Access Denied: The Owner Panel is strictly restricted to Dave (Super Admin).');
      router.push('/portal/member');
      return;
    }

    if (!email) {
      // Auto-initialize demo Dave session if entering directly
      localStorage.setItem('pfg_user_email', 'dave@parshuramgym.com');
      localStorage.setItem('pfg_user_role', 'super_admin');
      localStorage.setItem('pfg_user_name', 'Dave (Owner)');
    }

    setAuthorized(true);
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
    { label: 'Employees & Coaches', href: '/admin/employees', icon: UserCheck },
    { label: 'Attendance & QR', href: '/admin/attendance', icon: CalendarCheck },
    { label: 'Leave Applications', href: '/admin/leaves', icon: CalendarOff },
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
          {/* Dave Admin Profile Header */}
          <div className="p-5 border-b border-[#1E305C] flex items-center space-x-3 bg-[#050B17]/40">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B38F24] flex items-center justify-center font-black text-[#050B17] shadow-md">
              <Shield className="w-5 h-5 text-[#050B17]" />
            </div>
            <div>
              <span className="text-sm font-black uppercase tracking-wider text-white font-display block">
                Dave (Owner)
              </span>
              <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest block">
                Central Admin Panel
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
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
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom links */}
        <div className="p-4 border-t border-[#1E305C] space-y-2 bg-[#050B17]/30">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#101B37]"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/30 text-left transition-colors"
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
