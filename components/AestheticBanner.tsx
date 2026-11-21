'use client';

import { motion } from 'framer-motion';

export default function AestheticBanner() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. Fine CAD Schematic Dot Grid with Radial Mask */}
      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.10] [mask-image:radial-gradient(ellipse_at_top,white_15%,transparent_75%)]"
        style={{
          backgroundImage: `radial-gradient(rgba(16, 185, 129, 0.5) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* 2. Top Ambient Banner Gradient */}
      <div className="absolute top-0 left-0 right-0 h-[460px] sm:h-[640px] bg-gradient-to-b from-emerald-950/20 via-slate-900/35 to-transparent" />

      {/* 3. Qualcomm SM8150 (Snapdragon 860) Silicon Die Topology SVG */}
      <div className="absolute top-6 sm:top-12 -right-16 sm:right-[-20px] md:right-8 lg:right-16 w-[320px] sm:w-[480px] md:w-[620px] aspect-square opacity-[0.05] dark:opacity-[0.07] text-emerald-400">
        <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Outer Substrate */}
          <rect x="25" y="25" width="450" height="450" rx="32" stroke="currentColor" strokeWidth="2" strokeDasharray="8 6" />
          <rect x="60" y="60" width="380" height="380" rx="20" stroke="currentColor" strokeWidth="2.5" />

          {/* Kryo 485 CPU Cluster Layout */}
          <rect x="85" y="85" width="150" height="150" rx="10" stroke="currentColor" strokeWidth="1.5" />
          <text x="95" y="110" fill="currentColor" fontSize="12" fontFamily="monospace" letterSpacing="2">KRYO-485</text>
          <rect x="95" y="125" width="60" height="45" rx="4" stroke="currentColor" strokeWidth="1" />
          <rect x="165" y="125" width="60" height="45" rx="4" stroke="currentColor" strokeWidth="1" />
          <rect x="95" y="178" width="60" height="45" rx="4" stroke="currentColor" strokeWidth="1" />
          <rect x="165" y="178" width="60" height="45" rx="4" stroke="currentColor" strokeWidth="1" />

          {/* Adreno 640 GPU Block */}
          <rect x="255" y="85" width="160" height="150" rx="10" stroke="currentColor" strokeWidth="1.5" />
          <text x="265" y="110" fill="currentColor" fontSize="12" fontFamily="monospace" letterSpacing="2">ADRENO-640</text>
          <path d="M265 130H400M265 155H400M265 180H400M265 205H400" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />

          {/* System Cache & Interconnect */}
          <rect x="85" y="255" width="330" height="60" rx="8" stroke="currentColor" strokeWidth="1.5" />
          <text x="95" y="290" fill="currentColor" fontSize="12" fontFamily="monospace" letterSpacing="3">SYSTEM CACHE // NOC BUS</text>

          {/* Memory Controller / Modem */}
          <rect x="85" y="335" width="160" height="90" rx="10" stroke="currentColor" strokeWidth="1.5" />
          <text x="95" y="360" fill="currentColor" fontSize="11" fontFamily="monospace">LPDDR4X // 2133MHz</text>
          <rect x="265" y="335" width="150" height="90" rx="10" stroke="currentColor" strokeWidth="1.5" />
          <text x="275" y="360" fill="currentColor" fontSize="11" fontFamily="monospace">UFS 3.1 PHY</text>

          {/* Pinout Leads */}
          <line x1="10" y1="120" x2="60" y2="120" stroke="currentColor" strokeWidth="2" />
          <line x1="10" y1="160" x2="60" y2="160" stroke="currentColor" strokeWidth="2" />
          <line x1="10" y1="200" x2="60" y2="200" stroke="currentColor" strokeWidth="2" />
          <line x1="10" y1="280" x2="60" y2="280" stroke="currentColor" strokeWidth="2" />
          <line x1="10" y1="360" x2="60" y2="360" stroke="currentColor" strokeWidth="2" />

          <line x1="440" y1="120" x2="490" y2="120" stroke="currentColor" strokeWidth="2" />
          <line x1="440" y1="160" x2="490" y2="160" stroke="currentColor" strokeWidth="2" />
          <line x1="440" y1="200" x2="490" y2="200" stroke="currentColor" strokeWidth="2" />
          <line x1="440" y1="280" x2="490" y2="280" stroke="currentColor" strokeWidth="2" />
          <line x1="440" y1="360" x2="490" y2="360" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      {/* 4. Elegant Breathing Atmospheric Glows (GPU Accelerated) */}
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.12, 0.20, 0.12],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[-60px] left-[5%] sm:left-[12%] w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] rounded-full bg-emerald-500/12 blur-[90px] sm:blur-[130px] transform-gpu pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1, 1.09, 1],
          opacity: [0.06, 0.12, 0.06],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2.5,
        }}
        className="absolute top-[320px] right-[2%] sm:right-[8%] w-[260px] sm:w-[440px] h-[260px] sm:h-[440px] rounded-full bg-cyan-500/10 blur-[100px] sm:blur-[140px] transform-gpu pointer-events-none"
      />

      {/* 5. Minimalist Telemetry Etchings along border */}
      <div className="hidden xl:flex flex-col gap-3 absolute left-6 top-32 font-mono text-[9px] text-slate-700/60 tracking-widest uppercase">
        <span className="[writing-mode:vertical-lr] rotate-180">DEVICE // POCO X3 PRO</span>
        <span className="w-px h-12 bg-slate-800/80 mx-auto" />
        <span className="[writing-mode:vertical-lr] rotate-180">SOC // SM8150 (VAYU / BHIMA)</span>
      </div>

      <div className="hidden xl:flex flex-col gap-3 absolute right-6 top-48 font-mono text-[9px] text-slate-700/60 tracking-widest uppercase">
        <span className="[writing-mode:vertical-lr]">KERNEL // 4.14.348-OPENELA</span>
        <span className="w-px h-12 bg-slate-800/80 mx-auto" />
        <span className="[writing-mode:vertical-lr]">TOOLCHAIN // CLANG 18 + LTO</span>
      </div>
    </div>
  );
}
