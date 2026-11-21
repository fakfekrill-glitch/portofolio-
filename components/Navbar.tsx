'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Shield, Menu, X, Cpu, Terminal } from 'lucide-react';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Tentang', href: '#about' },
    { label: 'Arsenal', href: '#arsenal' },
    { label: 'Bukti Proyek', href: '#projects' },
    { label: 'Sertifikat', href: '#certificates' },
    { label: 'Kontak', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 pt-2.5 sm:pt-4 pointer-events-none transition-all">
      <div className="max-w-6xl mx-auto h-14 sm:h-16 px-3.5 sm:px-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 shadow-[0_12px_32px_rgba(0,0,0,0.5)] flex items-center justify-between relative overflow-hidden pointer-events-auto">
        {/* Subtle Top Glowing Line Accent */}
        <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent pointer-events-none" />

        {/* Futuristic Brand & Aesthetic Nickname */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative p-1.5 sm:p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 transition-all">
            <Cpu className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-mono font-black text-sm sm:text-base tracking-tight text-white flex items-center group-hover:text-emerald-300 transition-colors">
                <span className="text-emerald-400 mr-0.5">0x</span>FAKFEKRILL
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 uppercase">
                vayu
              </span>
            </div>
            <p className="hidden sm:block text-[10px] font-mono text-slate-400 -mt-0.5 tracking-tight">
              dalu raziq • qualcomm sm8150
            </p>
          </div>
        </Link>

        {/* Live Kernel Telemetry Ticker (Desktop) */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>BUILD: <strong className="text-slate-200">RE404 // 4.14-LTS</strong></span>
        </div>

        {/* Desktop Navigation Links (HUD Segments) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <ul className="flex items-center gap-1 text-xs font-mono text-slate-300 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="px-3 py-1.5 rounded-lg hover:text-emerald-400 hover:bg-slate-800/80 transition-all inline-block"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="h-5 w-px bg-slate-800 mx-1" />

          {/* Admin Dashboard Entry Button */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-400 transition-all shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin</span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle tema tampilan"
            className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </nav>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-1.5">
          <Link
            href="/admin"
            aria-label="Admin Dashboard"
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400"
          >
            <Shield className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle tema tampilan"
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu navigasi"
            aria-expanded={mobileMenuOpen}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Floating Island Glass Card) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden max-w-6xl mx-auto mt-2 pointer-events-auto bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3"
          >
            <ul className="space-y-1 text-sm font-mono text-slate-300">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-slate-800 hover:text-emerald-400 transition-colors min-h-[44px]"
                  >
                    <span>{link.label}</span>
                    <span className="text-[10px] text-slate-500 font-mono">0x0{navLinks.indexOf(link) + 1}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="pt-2 border-t border-slate-800/80">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-mono bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-bold min-h-[44px]"
              >
                <Shield className="w-4 h-4" />
                <span>Buka Admin Dashboard</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
