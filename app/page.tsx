'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion'; // Tambahkan Variants di sini
import { MapPin, School, User, Mail, MessageSquare, ArrowRight, Camera, X, ZoomIn, Award } from 'lucide-react';
import Image from 'next/image';

// --- CUSTOM BRAND ICONS ---
const CustomInstagram = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

const CustomFacebook = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const CustomGithub = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
  </svg>
);

const CustomSteam = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.001 0C5.373 0 .001 5.373.001 12c0 4.965 3.02 9.213 7.377 11.02l3.435-4.945c-.114-.347-.174-.72-.174-1.107 0-1.966 1.595-3.56 3.56-3.56.362 0 .71.06 1.038.16l3.456-2.467c.023-.122.036-.247.036-.374 0-1.774-1.438-3.213-3.212-3.213-1.774 0-3.213 1.44-3.213 3.213 0 .29.045.57.12.834L8.88 14.35a3.57 3.57 0 0 0-4.126-.724L2.3 17.152A11.95 11.95 0 0 1 .001 12C.001 5.373 5.373 0 12.001 0Zm3.56 10.574c-1.18 0-2.136.956-2.136 2.136 0 1.18.956 2.136 2.136 2.136 1.18 0 2.136-.956 2.136-2.136 0-1.18-.956-2.136-2.136-2.136Zm0 3.388c-.69 0-1.252-.56-1.252-1.252 0-.69.56-1.252 1.252-1.252.69 0 1.252.56 1.252 1.252 0 .69-.562 1.252-1.252 1.252ZM5.987 14.79c-.615 0-1.132.426-1.256.998L3.24 15.26c-.014-.085-.022-.172-.022-.258 0-.927.75-1.677 1.677-1.677.927 0 1.678.75 1.678 1.677 0 .093-.01.186-.026.276l-1.423.41a1.297 1.297 0 0 1 .862-1.304Zm2.228 2.264c.294.767.102 1.645-.55 2.203-.657.563-1.61.632-2.344.175L2.846 20.31a2.696 2.696 0 0 0 3.894-3.24l1.475-.014Z"/>
  </svg>
);

// --- DATA PERSONAL ---
const personalInfo = {
  firstName: "DALU",
  lastName: "RAZIQ",
  fullName: "Dalu Raziq Hidayatullah",
  title: "Computer Engineering Enthusiast & Developer",
  bio: "Suka Rekayasa Perangkat Keras, Mengeksploit Celah Keamanan, Belajar IoT, Merakit Alat, Suka Makan Dan Tidur.",
  photoPath: "/images/profile.jpg", 
  school: "SMA Negeri 8 Surabaya",
  origin: "Surabaya, Indonesia",
  email: "dalu.raziq45@sma.belajar.id", 
  discord: "pushygamertag27",      
  instagram: "rzq.punk",       
  facebook: "Pushy",
  facebookLink: "https://www.facebook.com/share/1JBvzZ7Nq5/",
  githubMain: "dhritzz",
  githubSuspended: "dahlah270",
  steamLink: "https://steamcommunity.com/profiles/76561199395613672/"
};

// --- DATA PENGALAMAN ---
const experienceData = [
  {
    title: "🔒 Penetration Testing Tools",
    desc: "Mengeksplorasi sisi offensive security. Pernah bereksperimen mengembangkan alat uji keamanan seperti tracker nomor HP, simulasi phishing link, stress-testing jaringan (DDoS), manajemen botnet, hingga script spam SMS."
  },
  {
    title: "🤖 Smart Fish Feeder (IoT)",
    desc: "Sistem pakan otomatis berbasis mikrokontroler terintegrasi. Dilengkapi dengan notifikasi real-time ke Discord Webhook untuk laporan status pakan secara otomatis."
  },
  {
    title: "🎮 Modifikasi Firmware & Konsol",
    desc: "Ahli dalam modifikasi level sistem: flashing Custom ROM Android, manipulasi modul sistem (Magisk/KernelSU), serta modifikasi firmware PlayStation untuk jailbreak firmware Sony."
  },
  {
    title: "💻 Hardware Tuning & Assembly",
    desc: "Berpengalaman dalam merakit dan melakukan troubleshooting PC/Laptop. Fokus pada efisiensi komponen dan eksperimen hardware tuning untuk mencapai performa maksimal."
  }
];

// --- SERTIFIKAT (FOTO SAJA) ---
const certificateImages = [
  "certificate1.png",
  "certificate2.png",
  "certificate.png"
];

// --- ANIMATION VARIANTS (FIXED TYPES) ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const modalVariant: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3, delay: 0.1 } }
};

const imageVariant: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    transition: { type: "spring", damping: 25, stiffness: 300 } 
  },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.3 } }
};

// --- KOMPONEN KARTU SOSIAL ---
const SocialCard = ({ icon: Icon, label, value, href, isSuspended = false }: any) => (
  <motion.a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    variants={fadeUp}
    className={`group flex items-center gap-4 p-4 md:p-5 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 
      ${isSuspended 
        ? 'bg-neutral-50 dark:bg-neutral-900/50 border-red-200 dark:border-red-900/30 hover:border-red-400 dark:hover:border-red-500 opacity-80' 
        : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500'}`}
  >
    <div className={`p-3 rounded-xl ${isSuspended ? 'bg-red-50 dark:bg-red-950/50 text-red-500' : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'}`}>
      <Icon size={24} />
    </div>
    <div className="overflow-hidden">
      <p className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider truncate">{label}</p>
      <p className={`text-base md:text-lg font-semibold tracking-tight transition-colors truncate
        ${isSuspended ? 'text-red-600 dark:text-red-400 line-through decoration-red-500/50' : 'text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
        {value}
      </p>
    </div>
    <ArrowRight size={18} className={`ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 ${isSuspended ? 'text-red-500' : 'text-blue-500'}`} />
  </motion.a>
);

export default function Home() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => setPhotos(data))
      .catch((err) => console.error("Gagal memuat galeri:", err));
  }, []);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedImage]);

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12 overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section id="about" className="max-w-7xl mx-auto px-6 min-h-[85vh] flex items-center mb-16 md:mb-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          
          <motion.div 
            className="md:col-span-7 space-y-6 md:space-y-8 order-2 md:order-1"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp} className="text-xs md:text-base text-blue-500 font-semibold tracking-widest uppercase">
              🚀 {personalInfo.title}
            </motion.h2>
            
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[1.05] relative">
              Membangun <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Sistem & Ekosistem.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="max-w-2xl text-base md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Hai 👋, Saya {personalInfo.fullName}. {personalInfo.bio}
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-2 md:pt-4 text-xs md:text-sm font-medium text-neutral-700 dark:text-neutral-300">
              <div className="flex items-center gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-3 rounded-full shadow-sm w-full sm:w-auto">
                <User size={16} className="text-blue-500 shrink-0" />
                <span className="truncate">{personalInfo.fullName}</span>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-3 rounded-full shadow-sm w-full sm:w-auto">
                <School size={16} className="text-blue-500 shrink-0" />
                <span className="truncate">{personalInfo.school}</span>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-3 rounded-full shadow-sm w-full sm:w-auto">
                <MapPin size={16} className="text-blue-500 shrink-0" />
                <span className="truncate">{personalInfo.origin}</span>
              </div>
            </motion.div>
            
            <motion.div variants={fadeUp} className="pt-4 md:pt-6">
              <a href="#experience" className="inline-block w-full sm:w-auto text-center px-10 py-4 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
                Eksplorasi Karya 🛠️
              </a>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="md:col-span-5 relative order-1 md:order-2 mb-8 md:mb-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] } as any}
          >
            <div className="hidden md:block absolute -top-6 -left-6 w-32 h-32 border-l-4 border-t-4 border-blue-500/30 rounded-tl-3xl z-0"></div>
            <div className="hidden md:block absolute -bottom-6 -right-6 w-32 h-32 border-r-4 border-b-4 border-cyan-500/30 rounded-br-3xl z-0"></div>
            
            <div className="relative aspect-square md:aspect-auto md:h-[600px] rounded-[2rem] md:rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-neutral-900 z-10 group mx-auto max-w-[300px] md:max-w-none">
              <Image 
                src={personalInfo.photoPath}
                alt={`Foto Profil ${personalInfo.fullName}`}
                fill
                priority
                className="object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-out"
                sizes="(max-w-768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent opacity-100 md:opacity-60 group-hover:opacity-30 transition-opacity"></div>
              
              <div className="absolute bottom-6 left-6 z-20 text-white">
                <p className="text-[10px] md:text-xs uppercase tracking-widest font-medium opacity-80">Portfolio</p>
                <p className="text-xl md:text-2xl font-extrabold tracking-tighter">{personalInfo.firstName} <span className="font-light">{personalInfo.lastName}</span></p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- TEXT MARQUEE --- */}
      <section className="w-full bg-blue-600 text-white py-4 md:py-5 overflow-hidden my-16 md:my-24 transform -rotate-2 scale-105 shadow-xl">
        <motion.div 
          animate={{ x: [0, -1500] }} 
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="whitespace-nowrap flex gap-8 md:gap-12 text-xl md:text-3xl font-black uppercase tracking-widest"
        >
          <span>• Web Development • IoT Systems • Hardware Tuning • Offensive Security • System Modding</span>
          <span>• Web Development • IoT Systems • Hardware Tuning • Offensive Security • System Modding</span>
          <span>• Web Development • IoT Systems • Hardware Tuning • Offensive Security • System Modding</span>
        </motion.div>
      </section>

      {/* --- EXPERIENCE SECTION --- */}
      <section id="experience" className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <motion.h2 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="text-3xl md:text-6xl font-black mb-12 md:mb-20 border-b-2 pb-6 dark:border-neutral-800 tracking-tighter"
        >
          Eksplorasi & Keahlian ✨
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {experienceData.map((exp, index) => (
            <motion.div 
              key={index}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="group p-6 md:p-10 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-500 relative overflow-hidden shadow-sm hover:shadow-xl md:hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <h3 className="text-xl md:text-3xl font-bold mb-3 md:mb-5 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                {exp.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm md:text-lg">
                {exp.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- CERTIFICATES --- */}
      <section id="certificates" className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="flex items-center gap-3 md:gap-4 mb-12 md:mb-16 border-b-2 pb-6 dark:border-neutral-800"
        >
          <Award className="text-blue-500 w-8 h-8 md:w-10 md:h-10" />
          <h2 className="text-3xl md:text-6xl font-black tracking-tighter">
            Prestasi & Sertifikat
          </h2>
        </motion.div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} 
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {certificateImages.map((cert, index) => (
            <motion.div 
              key={index}
              variants={fadeUp}
              onClick={() => setSelectedImage(`/certificates/${cert}`)}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden group border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <Image 
                src={`/certificates/${cert}`}
                alt={`Sertifikat ${index + 1}`}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
                sizes="(max-w-768px) 100vw, 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                 <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white scale-50 group-hover:scale-100 transition-transform duration-300">
                   <ZoomIn className="w-6 h-6" />
                 </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- DYNAMIC GALLERY SECTION --- */}
      <section id="gallery" className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="flex items-center gap-3 md:gap-4 mb-10 md:mb-16 border-b-2 pb-6 dark:border-neutral-800"
        >
          <Camera className="text-blue-500 w-8 h-8 md:w-10 md:h-10" />
          <h2 className="text-3xl md:text-6xl font-black tracking-tighter">
            Dokumentasi & Bukti
          </h2>
        </motion.div>

        {photos.length === 0 ? (
          <p className="text-neutral-500 text-center py-10 bg-neutral-100 dark:bg-neutral-900 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 text-sm md:text-base">
            Belum ada foto. Masukkan foto ke folder <code className="bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded">public/projects</code>.
          </p>
        ) : (
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} 
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
          >
            {photos.map((photo, index) => (
              <motion.div 
                key={index}
                variants={fadeUp}
                onClick={() => setSelectedImage(`/projects/${photo}`)}
                className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden group border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                <Image 
                  src={`/projects/${photo}`}
                  alt={`Dokumentasi ${index + 1}`}
                  fill
                  priority={index < 4}
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  sizes="(max-w-768px) 50vw, 33vw, 25vw"
                />
                
                <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/60 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                   <div className="p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-sm text-white scale-50 group-hover:scale-100 transition-transform duration-300">
                     <ZoomIn className="w-5 h-5 md:w-6 md:h-6" />
                   </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* --- FOOTER --- */}
      <footer id="contact" className="max-w-7xl mx-auto px-6 pt-16 md:pt-20 pb-16">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} 
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center"
        >
          <motion.div variants={fadeUp} className="md:col-span-5 space-y-4 md:space-y-6 text-center md:text-left">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">Found <br/> Me On</h2>
            <p className="text-base md:text-xl text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto md:mx-0">
              Silakan Hubungi Saya Jika Bertanya Sesuatu.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            
            <SocialCard 
              icon={Mail} 
              label="Kirim Email" 
              value={personalInfo.email} 
              href={`mailto:${personalInfo.email}`} 
            />

            <SocialCard 
              icon={MessageSquare} 
              label="Discord Username" 
              value={personalInfo.discord} 
              href="https://discord.com/" 
            />

            <SocialCard 
              icon={CustomInstagram} 
              label="Instagram" 
              value={`@${personalInfo.instagram}`} 
              href={`https://instagram.com/${personalInfo.instagram}`} 
            />

            <SocialCard 
              icon={CustomFacebook} 
              label="Facebook" 
              value={personalInfo.facebook} 
              href={personalInfo.facebookLink} 
            />

            <SocialCard 
              icon={CustomGithub} 
              label="GitHub" 
              value={`@${personalInfo.githubMain}`} 
              href={`https://github.com/${personalInfo.githubMain}`} 
            />

            <SocialCard 
              icon={CustomGithub} 
              label="GitHub (Suspended)" 
              value={`@${personalInfo.githubSuspended}`} 
              href={`https://github.com/${personalInfo.githubSuspended}`} 
              isSuspended={true}
            />

            <SocialCard 
              icon={CustomSteam} 
              label="Steam Profile" 
              value="Sagiri" 
              href={personalInfo.steamLink} 
            />

          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center pt-16 md:pt-24 border-t dark:border-neutral-800 mt-12 md:mt-16">
          <p className="text-xs md:text-sm text-neutral-500">
            © {new Date().getFullYear()} {personalInfo.fullName}. All rights reserved. Made with ❤️ in Surabaya.
          </p>
        </motion.div>
      </footer>

      {/* --- OVERLAY PREMIUM FULL PREVIEW --- */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            key="modal"
            variants={modalVariant}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-neutral-950/95 p-2 md:p-4 flex items-center justify-center cursor-pointer backdrop-blur-sm"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-2 md:p-3 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <motion.div
              variants={imageVariant}
              className="relative w-full max-w-7xl h-[80vh] md:h-[90vh] rounded-2xl md:rounded-3xl overflow-hidden cursor-default shadow-2xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                src={selectedImage}
                alt="Full preview tanpa terpotong"
                fill
                className="object-contain"
                priority
              />
              <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 p-1.5 md:p-2 px-3 md:px-4 rounded-lg bg-black/50 text-white/70 text-[10px] md:text-xs font-mono backdrop-blur-sm truncate max-w-[80%]">
                {selectedImage.split('/').pop()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}