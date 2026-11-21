'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  ShieldAlert,
  Terminal,
  Wrench,
  Award,
  Camera,
  Mail,
  ExternalLink,
  ZoomIn,
  Copy,
  Check,
  Send,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';
import DiscordActivity from '@/components/DiscordActivity';
import LightboxModal from '@/components/LightboxModal';
import AestheticBanner from '@/components/AestheticBanner';
import { usePortfolioData } from '@/lib/portfolioStore';
import { ProjectProofItem, CertificateItem } from '@/lib/types';

// Custom Brand Icons (clean SVG)
const CustomInstagram = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
);

const CustomGithub = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path></svg>
);

const CustomSteam = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 0C5.373 0 .001 5.373.001 12c0 4.965 3.02 9.213 7.377 11.02l3.435-4.945c-.114-.347-.174-.72-.174-1.107 0-1.966 1.595-3.56 3.56-3.56.362 0 .71.06 1.038.16l3.456-2.467c.023-.122.036-.247.036-.374 0-1.774-1.438-3.213-3.212-3.213-1.774 0-3.213 1.44-3.213 3.213 0 .29.045.57.12.834L8.88 14.35a3.57 3.57 0 0 0-4.126-.724L2.3 17.152A11.95 11.95 0 0 1 .001 12C.001 5.373 5.373 0 12.001 0Zm3.56 10.574c-1.18 0-2.136.956-2.136 2.136 0 1.18.956 2.136 2.136 2.136 1.18 0 2.136-.956 2.136-2.136 0-1.18-.956-2.136-2.136-2.136Zm0 3.388c-.69 0-1.252-.56-1.252-1.252 0-.69.56-1.252 1.252-1.252.69 0 1.252.56 1.252 1.252 0 .69-.562 1.252-1.252 1.252ZM5.987 14.79c-.615 0-1.132.426-1.256.998L3.24 15.26c-.014-.085-.022-.172-.022-.258 0-.927.75-1.677 1.677-1.677.927 0 1.678.75 1.678 1.677 0 .093-.01.186-.026.276l-1.423.41a1.297 1.297 0 0 1 .862-1.304Zm2.228 2.264c.294.767.102 1.645-.55 2.203-.657.563-1.61.632-2.344.175L2.846 20.31a2.696 2.696 0 0 0 3.894-3.24l1.475-.014Z"/></svg>
);

const CustomFacebook = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

export default function HomePage() {
  const { data } = usePortfolioData();
  const { profile, certificates, projects, arsenal } = data;

  // Active Category Filter for Projects
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Lightbox Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    imageSrc: '',
    title: '',
    subtitle: '',
    description: '',
    tags: [] as string[],
    proofUrl: ''
  });

  // Contact Form state
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    trap_website: '' // honeypot
  });
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // Email Copy State
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Local Clock (WIB)
  const [wibTime, setWibTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setWibTime(
        now.toLocaleTimeString('id-ID', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const handleOpenCertificate = (cert: CertificateItem) => {
    setModalData({
      imageSrc: cert.image,
      title: cert.title,
      subtitle: `${cert.issuer} • ${cert.date}`,
      description: cert.description || 'Sertifikasi kompetensi resmi dalam bidang teknologi dan rekayasa komputasi.',
      tags: ['Sertifikasi', cert.date],
      proofUrl: cert.credentialUrl || ''
    });
    setModalOpen(true);
  };

  const handleOpenProject = (proj: ProjectProofItem) => {
    setModalData({
      imageSrc: proj.image,
      title: proj.title,
      subtitle: `${proj.category} • ${proj.version} • ${proj.date}`,
      description: proj.description,
      tags: proj.tags,
      proofUrl: proj.proofUrl || ''
    });
    setModalOpen(true);
  };

  const handleOpenProfilePhoto = () => {
    setModalData({
      imageSrc: profile.photoPath,
      title: profile.fullName,
      subtitle: `${profile.title} • ${profile.device}`,
      description: `${profile.bio} — Spesialis Kompilasi Linux Kernel Qualcomm Snapdragon 860 (sm8150).`,
      tags: ['Foto Profil', profile.device, profile.soc],
      proofUrl: ''
    });
    setModalOpen(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setSendSuccess(false);
    setSendError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setSendSuccess(true);
        setFormState({ name: '', email: '', message: '', trap_website: '' });
      } else {
        setSendError(json.error || 'Gagal mengirim pesan.');
      }
    } catch {
      setSendError('Koneksi terputus. Silakan coba kembali.');
    } finally {
      setSending(false);
    }
  };

  // Filter projects based on active tab
  const filteredProjects =
    selectedCategory === 'Semua'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  const categories = [
    'Semua',
    'Android Kernel',
    'Root & SuSFS',
    'Toolchain & LLVM',
    'Deployment',
    'Hardware & Debugging'
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden">
      {/* Aesthetic Background Banner Layer */}
      <AestheticBanner />

      {/* Lightbox Preview Modal */}
      <LightboxModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageSrc={modalData.imageSrc}
        title={modalData.title}
        subtitle={modalData.subtitle}
        description={modalData.description}
        tags={modalData.tags}
        proofUrl={modalData.proofUrl}
      />

      {/* Main Foreground Content */}
      <div className="relative z-10">
        {/* =======================================================
            SECTION 1: HERO & PROFILE (Dalu Raziq Hidayatullah)
            ======================================================= */}
        <section
          id="about"
          className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 max-w-7xl mx-auto px-4 sm:px-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Profile Card + Discord Activity Directly Below */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 space-y-4"
            >
              {/* Profile Photo Card (Uncropped Full Resolution) */}
              <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
                <div
                  onClick={handleOpenProfilePhoto}
                  className="relative w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center cursor-pointer group"
                  title="Klik untuk melihat foto resolusi penuh"
                >
                  <img
                    src={profile.photoPath}
                    alt={profile.fullName}
                    className="w-full h-auto max-h-[620px] object-contain rounded-xl group-hover:scale-[1.01] transition-transform duration-300"
                  />
                  {/* Subtle inspection badge on hover */}
                  <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                    <span className="px-3 py-1.5 rounded-full bg-slate-900/90 text-white backdrop-blur-sm border border-slate-700 shadow-lg flex items-center gap-1.5 text-xs font-mono">
                      <ZoomIn className="w-4 h-4 text-emerald-400" />
                      <span>Resolusi Penuh</span>
                    </span>
                  </div>
                </div>

                {/* Profile Identity Details (Placed clearly below photo, zero obstruction) */}
                <div className="mt-3.5 pt-1">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase">
                          Active Kernel Developer
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                        {profile.fullName}
                      </h2>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-emerald-400 border border-emerald-500/30 shrink-0">
                      {profile.device}
                    </span>
                  </div>
                </div>

                {/* Hardware Spec Strip */}
                <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Target Device</span>
                    <span className="text-slate-200 font-semibold">{profile.device}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">SoC Architecture</span>
                    <span className="text-slate-200 font-semibold">{profile.soc}</span>
                  </div>
                </div>
              </div>

              {/* DISCORD ACTIVITY CARD DIRECTLY BELOW PROFILE PHOTO */}
              <div id="discord-presence">
                <DiscordActivity discordId={profile.discordId} />
              </div>
            </motion.div>

            {/* Right Column: Bio & Technical Narrative */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Status Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Surabaya, Indonesia • WIB {wibTime || '21:30'}</span>
              </div>

              {/* Main Headline */}
              <div>
                <p className="font-mono text-xs sm:text-sm text-emerald-400 tracking-wider uppercase font-semibold">
                  {profile.title}
                </p>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mt-2 leading-[1.1]">
                  Rekayasa Kernel & <br className="hidden sm:inline" />
                  <span className="text-emerald-400">Modifikasi Sistem Tingkat Rendah.</span>
                </h1>
              </div>

              {/* Bio Paragraph */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                {profile.bio}
              </p>

              {/* Key Technical Highlights Box */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 font-mono text-xs backdrop-blur-sm">
                <div className="flex items-center gap-2 text-slate-200 font-bold border-b border-slate-800 pb-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>SPESIFIKASI PROYEK & KONTRIBUSI KERNEL</span>
                </div>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>
                      <strong className="text-white">POCO X3 Pro (vayu / bhima):</strong> Kompilasi kernel berbasis Qualcomm Snapdragon 860 (sm8150).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>
                      <strong className="text-white">ReSukiSU & SuSFS Integration:</strong> Isolasi filesystem mount stealth untuk proteksi integritas aplikasi dan bypass pendeteksi root.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>
                      <strong className="text-white">eBPF Subsystem & Networking:</strong> Implementasi filter socket dan paket logging langsung di kernel space.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>
                      <strong className="text-white">AnyKernel3 Packaging:</strong> Distribusi paket flashable untuk recovery TWRP dan OrangeFox.
                    </span>
                  </li>
                </ul>
              </div>

              {/* CTAs with Smooth Tap & Hover Feedback */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href="#projects"
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs sm:text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Lihat Bukti Pengerjaan Proyek</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.a>

                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href="#contact"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>Hubungi Saya</span>
                </motion.a>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-4 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Salin alamat email"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span className="truncate">{copiedEmail ? 'Email Disalin!' : profile.email}</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* =======================================================
            SECTION 2: ARSENAL KERNEL & TEKNOLOGI
            ======================================================= */}
        <section id="arsenal" className="py-16 sm:py-20 border-t border-slate-850/80 bg-slate-900/40 backdrop-blur-[2px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-2xl mx-auto mb-12"
            >
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                {"// ARSENAL KERNEL & LOW-LEVEL"}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-2">
                Keahlian & Ekosistem Rekayasa
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Kompilasi downstream kernel, keamanan tingkat root, optimasi toolchain, serta diagnostik perangkat Qualcomm.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {arsenal.map((item, idx) => {
                const icons = [Cpu, ShieldAlert, Terminal, Wrench];
                const IconComponent = icons[idx % icons.length];

                return (
                  <motion.div
                    key={item.category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/40 transition-colors flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-base text-slate-100 font-mono">{item.category}</h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                      {item.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 text-[11px] font-mono bg-slate-950 text-slate-300 rounded border border-slate-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =======================================================
            SECTION 3: BUKTI PENGERJAAN PROYEK & DOKUMENTASI
            ======================================================= */}
        <section id="projects" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12 border-b border-slate-800 pb-6"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                <Camera className="w-4 h-4" />
                <span>DOKUMENTASI & BUKTI PENGERJAAN ({projects.length})</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                Bukti Karya & Patch Kernel
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Dokumentasi tangkapan layar kompilasi, rilis build zip kernel, modul SuSFS, pstore crash dump, dan verifikasi perangkat POCO X3 Pro.
              </p>
            </div>

            <div className="text-xs font-mono text-slate-400 hidden sm:block">
              Klik kartu untuk memperbesar & melihat detail
            </div>
          </motion.div>

          {/* Category Filters (Mobile Touch & Swipe Optimized) */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer shrink-0 whitespace-nowrap min-h-[38px] ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white font-bold shadow'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOpenProject(project)}
                className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-md hover:shadow-xl"
              >
                <div>
                  {/* Thumbnail with Zoom icon overlay */}
                  <div className="relative aspect-video bg-black/60 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="p-2.5 rounded-full bg-slate-900/80 text-white backdrop-blur-sm">
                        <ZoomIn className="w-5 h-5 text-emerald-400" />
                      </span>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950/80 text-emerald-400 border border-emerald-500/30">
                      {project.category}
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950/80 text-slate-300 border border-slate-800">
                      {project.version}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-base text-slate-100 group-hover:text-emerald-400 transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed font-sans">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Tags & Actions */}
                <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs font-mono">
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="px-1.5 py-0.5 text-[10px] bg-slate-900 text-slate-400 rounded border border-slate-800"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <span className="text-emerald-400 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Lihat Bukti</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* =======================================================
            SECTION 4: PRESTASI & SERTIFIKAT
            ======================================================= */}
        <section id="certificates" className="py-16 sm:py-20 border-t border-slate-850/80 bg-slate-900/30 backdrop-blur-[2px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12 border-b border-slate-800 pb-6"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                  <Award className="w-4 h-4" />
                  <span>PRESTASI & SERTIFIKASI ({certificates.length})</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                  Sertifikat Resmi
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Bukti kompetensi dan sertifikasi uji keahlian di bidang komputasi dan teknologi.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert, idx) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenCertificate(cert)}
                  className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-md hover:shadow-xl"
                >
                  <div>
                    <div className="relative aspect-[4/3] bg-black/60 overflow-hidden">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="p-2.5 rounded-full bg-slate-900/80 text-white backdrop-blur-sm">
                          <ZoomIn className="w-5 h-5 text-emerald-400" />
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950/80 text-slate-300 border border-slate-800">
                        {cert.date}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-base text-slate-100 group-hover:text-emerald-400 transition-colors leading-snug">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-1.5">{cert.issuer}</p>
                      {cert.description && (
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                          {cert.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs font-mono text-emerald-400">
                    <span>Pratinjau Resolusi Penuh</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =======================================================
            SECTION 5: KONTAK & EMAIL
            ======================================================= */}
        <section id="contact" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Direct Info & Social Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 space-y-6"
            >
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                  {"// TERHUBUNG DENGAN SAYA"}
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-2">
                  Kontak Langsung
                </h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Ingin berdiskusi seputar custom kernel POCO X3 Pro (vayu/bhima), pengujian patch SuSFS, atau kolaborasi open source? Silakan hubungi saya melalui jalur resmi berikut.
                </p>
              </div>

              {/* Email Card Highlight */}
              <div className="p-5 rounded-xl bg-slate-900/90 backdrop-blur-sm border border-emerald-500/30 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Alamat Email Utama
                  </span>
                  <a
                    href={`mailto:${profile.email}`}
                    className="font-mono text-sm sm:text-base font-bold text-white hover:text-emerald-400 transition-colors truncate block"
                  >
                    {profile.email}
                  </a>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-3 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-mono flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer min-h-[38px]"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Disalin' : 'Salin'}</span>
                </motion.button>
              </div>

              {/* Verified Social Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href={`https://github.com/${profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-slate-900/90 backdrop-blur-sm border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-200 group-hover:text-emerald-400">
                    <CustomGithub size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono text-slate-400">GitHub</p>
                    <p className="text-xs font-mono font-bold text-slate-200 truncate">@{profile.github}</p>
                  </div>
                </motion.a>

                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href={`https://instagram.com/${profile.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-slate-900/90 backdrop-blur-sm border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-200 group-hover:text-pink-400">
                    <CustomInstagram size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono text-slate-400">Instagram</p>
                    <p className="text-xs font-mono font-bold text-slate-200 truncate">@{profile.instagram}</p>
                  </div>
                </motion.a>

                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href={profile.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-slate-900/90 backdrop-blur-sm border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-200 group-hover:text-blue-400">
                    <CustomFacebook size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono text-slate-400">Facebook</p>
                    <p className="text-xs font-mono font-bold text-slate-200 truncate">{profile.facebook}</p>
                  </div>
                </motion.a>

                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href={profile.steamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-slate-900/90 backdrop-blur-sm border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-200 group-hover:text-cyan-400">
                    <CustomSteam size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono text-slate-400">Steam Community</p>
                    <p className="text-xs font-mono font-bold text-slate-200 truncate">Sagiri</p>
                  </div>
                </motion.a>
              </div>
            </motion.div>

            {/* Right Column: Secure Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl"
            >
              <h3 className="font-mono text-base font-bold text-white mb-2">
                Kirim Pesan Langsung
              </h3>
              <p className="text-xs text-slate-400 font-sans mb-6">
                Pesan terproteksi enkripsi SSL dan firewall rate-limiting, langsung diteruskan ke inbox saya.
              </p>

              <form onSubmit={handleSendMessage} className="space-y-4">
                {/* Honeypot field (hidden from real users, traps automated bots) */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <input
                    type="text"
                    name="trap_website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formState.trap_website}
                    onChange={(e) => setFormState({ ...formState, trap_website: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Nama Anda"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-base sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Alamat Email</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-base sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Isi Pesan</label>
                  <textarea
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Tuliskan pesan, pertanyaan kernel, atau tawaran kolaborasi..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-base sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-sans resize-none"
                  />
                </div>

                {sendSuccess && (
                  <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Pesan Anda berhasil dikirim! Terima kasih telah menghubungi Dalu Raziq.</span>
                  </div>
                )}

                {sendError && (
                  <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-mono">
                    {sendError}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={sending}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer min-h-[46px]"
                >
                  {sending ? (
                    <span>Mengirim pesan...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Pesan Sekarang</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* =======================================================
            FOOTER
            ======================================================= */}
        <footer className="border-t border-slate-850 py-10 bg-slate-950/90 backdrop-blur-sm text-xs font-mono text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-slate-300 font-bold">{profile.fullName}</span> • POCO X3 Pro Kernel Developer
              <p className="text-[11px] text-slate-600 mt-0.5">
                Qualcomm Snapdragon 860 (vayu / bhima) • Surabaya, Indonesia
              </p>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <a href="#about" className="hover:text-emerald-400 transition-colors">Tentang</a>
              <a href="#projects" className="hover:text-emerald-400 transition-colors">Proyek</a>
              <a href="#certificates" className="hover:text-emerald-400 transition-colors">Sertifikat</a>
              <a href="/admin" className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
                <Lock className="w-3 h-3" />
                <span>Admin Deck</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
