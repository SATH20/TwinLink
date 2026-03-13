'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Zap, Heart, Settings, Sparkles } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/profile', label: 'My Twin', icon: User },
  { href: '/simulation', label: 'Simulations', icon: Zap },
  { href: '/matches', label: 'Matches', icon: Heart },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 min-h-screen w-64 fixed left-0 top-0 transition-colors duration-300">
      <div className="p-6 space-y-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span className="font-bold text-xl text-slate-900 dark:text-slate-100">TwinLink</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
