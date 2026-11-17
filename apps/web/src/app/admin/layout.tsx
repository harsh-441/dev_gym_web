'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Members', href: '/admin/members', icon: Users },
    { label: 'Employees & Staff', href: '/admin/employees', icon: UserCheck },
    { label: 'Attendance & QR', href: '/admin/attendance', icon: CalendarCheck },
    { label: 'Leave Applications', href: '/admin/leaves', icon: CalendarOff },
    { label: 'Content & Exercises', href: '/admin/content', icon: BookOpen },
    { label: 'Membership Plans', href: '/admin/memberships', icon: CreditCard },
    { label: 'Prospective Enquiries', href: '/admin/enquiries', icon: MessageSquare },
    { label: 'System Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gym-black text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gym-charcoal border-r border-gym-border flex flex-col justify-between shrink-0">
        <div>
          {/* Dave Admin Profile Header */}
          <div className="p-5 border-b border-gym-border flex items-center space-x-3 bg-gym-black/40">
            <div className="w-10 h-10 rounded-xl bg-gym-red flex items-center justify-center font-black text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black uppercase tracking-wider text-white font-display block">
                Dave (Owner)
              </span>
              <span className="text-[10px] uppercase font-bold text-gym-silver tracking-widest block">
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
                      ? 'bg-gym-red text-white shadow-md shadow-red-950/60'
                      : 'text-zinc-400 hover:text-white hover:bg-gym-card'
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
        <div className="p-4 border-t border-gym-border space-y-2 bg-gym-black/30">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-gym-card"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/auth/login"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/30"
          >
            <LogOut className="w-4 h-4" />
            <span>Switch Role / Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gym-black overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
