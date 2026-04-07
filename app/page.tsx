'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants, useScroll, useSpring } from 'framer-motion'; 
import { MapPin, School, User, Mail, MessageSquare, ArrowRight, Camera, X, ZoomIn, Award, Home as HomeIcon, Briefcase, FileBadge, Image as ImageIcon, Phone, Terminal, Code, Cpu, ShieldAlert, Wrench, MoreVertical, ExternalLink, Send } from 'lucide-react';
import Image from 'next/image';

// --- CUSTOM BRAND ICONS ---
const CustomInstagram = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
);
const CustomFacebook = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const CustomGithub = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path></svg>
);
const CustomSteam = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 0C5.373 0 .001 5.373.001 12c0 4.965 3.02 9.213 7.377 11.02l3.435-4.945c-.114-.347-.174-.72-.174-1.107 0-1.966 1.595-3.56 3.56-3.56.362 0 .71.06 1.038.16l3.456-2.467c.023-.122.036-.247.036-.374 0-1.774-1.438-3.213-3.212-3.213-1.774 0-3.213 1.44-3.213 3.213 0 .29.045.57.12.834L8.88 14.35a3.57 3.57 0 0 0-4.126-.724L2.3 17.152A11.95 11.95 0 0 1 .001 12C.001 5.373 5.373 0 12.001 0Zm3.56 10.574c-1.18 0-2.136.956-2.136 2.136 0 1.18.956 2.136 2.136 2.136 1.18 0 2.136-.956 2.136-2.136 0-1.18-.956-2.136-2.136-2.136Zm0 3.388c-.69 0-1.252-.56-1.252-1.252 0-.69.56-1.252 1.252-1.252.69 0 1.252.56 1.252 1.252 0 .69-.562 1.252-1.252 1.252ZM5.987 14.79c-.615 0-1.132.426-1.256.998L3.24 15.26c-.014-.085-.022-.172-.022-.258 0-.927.75-1.677 1.677-1.677.927 0 1.678.75 1.678 1.677 0 .093-.01.186-.026.276l-1.423.41a1.297 1.297 0 0 1 .862-1.304Zm2.228 2.264c.294.767.102 1.645-.55 2.203-.657.563-1.61.632-2.344.175L2.846 20.31a2.696 2.696 0 0 0 3.894-3.24l1.475-.014Z"/></svg>
);

// --- DATA PERSONAL ---
const personalInfo = {
  firstName: "DALU",
  lastName: "RAZIQ",
  fullName: "Dalu Raziq Hidayatullah",
  title: "Computer Engineering Enthusiast & Developer",
  bio: "Suka Rekayasa Perangkat Keras, Mengeksploit Celah Keamanan, Belajar IoT, Merakit Alat, Suka Makan, Tidur, Main Game PES BITBOX PATCH 2026, PUBG, VALORANT, POINT BLANK, CS2.",
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

const techStackData = [
  { category: "Web Development", icon: Code, skills: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Node.js", "C++", "Python"] },
  { category: "Hardware & IoT", icon: Cpu, skills: ["ESP8266 / NodeMCU", "Arduino", "C++", "Sensor Integration", "Discord Webhooks"] },
  { category: "Security & Modding", icon: ShieldAlert, skills: ["Magisk / KernelSU", "Custom ROMs", "Penetration Tools"] },
  { category: "Tools & Software", icon: Wrench, skills: ["Git & GitHub", "VS Code", "Vercel", "Android Studio"] }
];

const experienceData = [
  { title: "🔒 Penetration Testing Tools", desc: "Mengeksplorasi sisi offensive security. Pernah bereksperimen mengembangkan alat uji keamanan seperti tracker nomor HP, simulasi phishing link, stress-testing jaringan (DDoS), manajemen botnet, hingga script spam SMS." },
  { title: "🤖 Smart Fish Feeder (IoT)", desc: "Sistem pakan otomatis berbasis mikrokontroler terintegrasi. Dilengkapi dengan notifikasi real-time ke Discord Webhook untuk laporan status pakan secara otomatis." },
  { title: "🎮 Modifikasi Firmware & Konsol", desc: "Ahli dalam modifikasi level sistem: flashing Custom ROM Android, manipulasi modul sistem (Magisk/KernelSU), serta modifikasi firmware PlayStation untuk jailbreak firmware Sony." },
  { title: "💻 Hardware Tuning & Assembly", desc: "Berpengalaman dalam merakit dan melakukan troubleshooting PC/Laptop. Fokus pada efisiensi komponen dan eksperimen hardware tuning untuk mencapai performa maksimal." }
];

const certificateImages = ["certificate1.png", "certificate2.png", "certificate.png"];

const fadeUp: Variants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };
const staggerContainer: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const modalVariant: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } }, exit: { opacity: 0, transition: { duration: 0.3, delay: 0.1 } } };
const imageVariant: Variants = { hidden: { scale: 0.9, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 300 } }, exit: { scale: 0.9, opacity: 0, transition: { duration: 0.3 } } };

// --- HELPER UNTUK MENGAMBIL ASSET GAMBAR DARI LANYARD ---
const getAssetUrl = (appId: string, assetId: string) => {
  if (!assetId) return 'https://cdn.discordapp.com/embed/avatars/0.png';
  if (assetId.startsWith('spotify:')) {
    return `https://i.scdn.co/image/${assetId.split(':')[1]}`;
  }
  if (assetId.startsWith('mp:external/')) {
    return `https://media.discordapp.net/external/${assetId.replace('mp:external/', '')}`;
  }
  return `https://cdn.discordapp.com/app-assets/${appId}/${assetId}.png`;
};

// --- DISCORD PROFILE CARD (INSTANT WEBSOCKET REAL-TIME) ---
const DiscordProfileCard = ({ discordId }: { discordId: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [activity, setActivity] = useState<string | null>(null);
  const [currentMillis, setCurrentMillis] = useState<number | null>(null);
  const [totalMillis, setTotalMillis] = useState<number | null>(null);
  const [playbackActive, setPlaybackActive] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [listeningDetails, setListeningDetails] = useState<any>(null);

  useEffect(() => {
    let ws: WebSocket;
    let heartbeatInterval: NodeJS.Timeout;

    const connectWebSocket = () => {
      ws = new WebSocket('wss://api.lanyard.rest/socket');
      ws.onopen = () => ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: discordId } }));

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.op === 1) {
          heartbeatInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ op: 3 }));
          }, msg.d.heartbeat_interval);
        } else if (msg.op === 0) {
          if (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE') {
            const userData = msg.d[discordId] || msg.d;
            setData(userData);
            
            if (userData.activities && userData.activities.length > 0) {
              const acts = userData.activities;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const listening = acts.find((a: any) => a.type === 2 || a.name.toLowerCase().includes("music") || a.name.toLowerCase().includes("spotify") || (a.name.toLowerCase() === "youtube music" && a.type === 0));
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const watching = acts.find((a: any) => a.type === 3 || (a.name.toLowerCase().includes("youtube") && !a.name.toLowerCase().includes("music")) || a.name.toLowerCase().includes("netflix"));
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const playing = acts.find((a: any) => a.type === 0 && a.name.toLowerCase() !== "youtube music");
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const customStatus = acts.find((a: any) => a.type === 4);

              if (listening) {
                const song = listening.details || listening.name;
                const artist = listening.state ? ` - ${listening.state}` : '';
                setActivity(`🎵 Listening: ${song}${artist}`);
                setListeningDetails(listening);

                if (listening.timestamps && listening.timestamps.start && listening.timestamps.end) {
                  setPlaybackActive(true);
                  const startUnix = listening.timestamps.start;
                  const endUnix = listening.timestamps.end;
                  const durationMillis = endUnix - startUnix;
                  setTotalMillis(durationMillis);
                  listening.startUnix = startUnix;
                  listening.endUnix = endUnix;
                } else {
                  setPlaybackActive(false);
                  setTotalMillis(null);
                }
              } else if (watching) {
                const title = watching.details || watching.name;
                const state = watching.state ? ` - ${watching.state}` : '';
                setActivity(`▶️ Watching: ${title}${state}`);
                setPlaybackActive(false);
              } else if (playing) {
                const details = playing.details ? ` - ${playing.details}` : '';
                setActivity(`🎮 Playing: ${playing.name}${details}`);
                setPlaybackActive(false);
              } else if (customStatus && customStatus.state) {
                setActivity(`💬 ${customStatus.state}`);
                setPlaybackActive(false);
              } else {
                setActivity(`✨ Active: ${acts[0].name}`);
                setPlaybackActive(false);
              }
            } else {
              setActivity(null);
              setPlaybackActive(false);
            }
          }
        }
      };

      ws.onclose = () => {
        clearInterval(heartbeatInterval);
        setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();
    return () => {
      if (ws) ws.close();
      clearInterval(heartbeatInterval);
    };
  }, [discordId]);

  useEffect(() => {
    if (!playbackActive || !listeningDetails?.startUnix || !totalMillis) {
      setCurrentMillis(null);
      return;
    }

    const startUnix = listeningDetails.startUnix;

    const updateProgress = () => {
      const now = Date.now();
      const currentPos = Math.max(0, Math.min(totalMillis, now - startUnix));
      setCurrentMillis(currentPos);
    };

    updateProgress();
    const intervalId = setInterval(updateProgress, 1000);

    return () => clearInterval(intervalId);
  }, [playbackActive, listeningDetails, totalMillis]);

  if (!data) return null;

  const { discord_user, discord_status } = data;
  const avatarUrl = discord_user.avatar 
    ? `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.webp?size=128`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  const statusConfig = {
    online: { color: 'bg-green-500', shadow: 'shadow-[0_0_10px_rgba(34,197,94,0.8)]', text: 'Online' },
    idle: { color: 'bg-yellow-500', shadow: 'shadow-[0_0_10px_rgba(234,179,8,0.8)]', text: 'Idle' },
    dnd: { color: 'bg-red-500', shadow: 'shadow-[0_0_10px_rgba(239,68,68,0.8)]', text: 'Do Not Disturb' },
    offline: { color: 'bg-neutral-500', shadow: '', text: 'Offline' }
  };
  
  const currentStatus = statusConfig[discord_status as keyof typeof statusConfig] || statusConfig.offline;

  const formatMusicTime = (millis: number | null): string => {
    if (millis === null) return "00:00";
    const seconds = Math.floor(millis / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // --- LOGIKA URL MUSIK ---
  const getMusicUrl = () => {
    if (!listeningDetails) return '#';
    if (listeningDetails.sync_id) {
      return `https://open.spotify.com/track/${listeningDetails.sync_id}`;
    }
    const query = encodeURIComponent(`${listeningDetails.details || ''} ${listeningDetails.state || ''}`);
    return `https://music.youtube.com/search?q=${query}`;
  };

  return (
    <motion.div variants={fadeUp} className="col-span-1 sm:col-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5865F2]/10 to-transparent border border-[#5865F2]/20 hover:border-[#5865F2]/50 transition-all duration-500 p-5 sm:p-6 shadow-sm hover:shadow-xl">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#5865F2]/10 rounded-full blur-3xl group-hover:bg-[#5865F2]/20 transition-all duration-500"></div>
      
      <div className="flex items-start gap-4 sm:gap-6 relative z-10">
        <div className="relative shrink-0 pt-1">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#5865F2]/30 group-hover:border-[#5865F2] transition-colors">
            <img src={avatarUrl} alt="Discord Avatar" className="w-full h-full object-cover" />
          </div>
          <div className={`absolute bottom-0 right-0 w-5 h-5 border-4 border-white dark:border-neutral-950 rounded-full ${currentStatus.color} ${currentStatus.shadow}`}></div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-black text-lg sm:text-2xl tracking-tight truncate text-neutral-900 dark:text-white">
              {discord_user.display_name || discord_user.username}
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white ${currentStatus.color}`}>
              {currentStatus.text}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 font-medium mb-2.5 truncate">@{discord_user.username}</p>

          {playbackActive && listeningDetails ? (
            <a href={getMusicUrl()} target="_blank" rel="noopener noreferrer" className="block space-y-3 pt-2 mt-2 border-t border-[#5865F2]/10 group/music cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors relative">
              <div className="flex items-center gap-2 justify-between">
                <p className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">Listening to {listeningDetails.name || "Music"}</p>
                <ExternalLink size={14} className="text-neutral-400 group-hover/music:text-blue-500 transition-colors shrink-0" />
              </div>
              
              <div className="flex items-center gap-3">
                {listeningDetails.assets?.large_image && (
                  <div className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-[#5865F2]/20 shadow-sm group-hover/music:shadow-md transition-shadow">
                    <img src={getAssetUrl(listeningDetails.application_id, listeningDetails.assets.large_image)} alt="Album Art" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 overflow-hidden">
                  <p className="text-lg sm:text-xl font-bold tracking-tight text-neutral-950 dark:text-white truncate group-hover/music:text-blue-500 transition-colors">{listeningDetails.details || "Judul Lagu Tidak Diketahui"}</p>
                  <p className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">{listeningDetails.state || "Artis Tidak Diketahui"}</p>
                  {listeningDetails.assets?.large_text && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{listeningDetails.assets.large_text}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3 pt-1.5 font-mono text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                <span>{formatMusicTime(currentMillis)}</span>
                <div className="flex-1 relative h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                  <div className="absolute inset-0 bg-neutral-300 dark:bg-neutral-700"></div>
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: totalMillis ? `${((currentMillis || 0) / totalMillis) * 100}%` : "0%" }} 
                    transition={{ duration: 1, ease: "linear" }}
                    className="absolute top-0 left-0 h-full bg-neutral-900 dark:bg-white group-hover/music:bg-blue-500 rounded-full transition-colors" 
                  />
                </div>
                <span>{formatMusicTime(totalMillis)}</span>
              </div>
            </a>
          ) : activity ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#5865F2]/10 border border-[#5865F2]/20 text-[#5865F2] text-xs sm:text-sm font-semibold max-w-full mt-1">
              <span className="truncate">{activity}</span>
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5865F2] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5865F2]"></span>
              </span>
            </div>
          ) : (
            <p className="text-xs text-neutral-400 italic truncate mt-1">Sedang tidak memutar game/lagu</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- KOMPONEN KARTU SOSIAL BIASA ---
interface SocialCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  href: string;
  isSuspended?: boolean;
}

const SocialCard = ({ icon: Icon, label, value, href, isSuspended = false }: SocialCardProps) => (
  <motion.a 
    href={href} target="_blank" rel="noopener noreferrer" variants={fadeUp}
    className={`group flex items-center gap-3 sm:gap-4 p-4 md:p-5 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 
      ${isSuspended 
        ? 'bg-neutral-50 dark:bg-neutral-900/50 border-red-200 dark:border-red-900/30 hover:border-red-400 dark:hover:border-red-500 opacity-80' 
        : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500'}`}
  >
    <div className={`p-2.5 sm:p-3 rounded-xl shrink-0 ${isSuspended ? 'bg-red-50 dark:bg-red-950/50 text-red-500' : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'}`}>
      <Icon size={20} className="sm:w-6 sm:h-6" />
    </div>
    <div className="overflow-hidden flex-1">
      <p className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider truncate">{label}</p>
      <p className={`text-sm sm:text-base md:text-lg font-semibold tracking-tight transition-colors truncate
        ${isSuspended ? 'text-red-600 dark:text-red-400 line-through decoration-red-500/50' : 'text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
        {value}
      </p>
    </div>
    <ArrowRight size={16} className={`ml-1 shrink-0 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 hidden sm:block ${isSuspended ? 'text-red-500' : 'text-blue-500'}`} />
  </motion.a>
);

export default function Home() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('Memuat...');

  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'system', text: 'ROOT_ACCESS_GRANTED. Vercel Cloud Server Connected.' },
    { type: 'system', text: 'Type "help" to see available commands.' }
  ]);
  
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // --- STATE UNTUK FORM WEBHOOK ---
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // --- LOGIKA PROGRESS BAR SCROLL ---
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // --- OPTIMISASI UX: Menutup modal dengan tombol Escape ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
        setShowEasterEgg(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => setPhotos(data))
      .catch((err) => console.error("Gagal memuat galeri:", err));
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour12: false }));
    };
    updateClock(); 
    const timerId = setInterval(updateClock, 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (selectedImage || showEasterEgg) {
      document.body.style.overflow = 'hidden';
      if (showEasterEgg) setTimeout(() => terminalInputRef.current?.focus(), 500);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    }
  }, [selectedImage, showEasterEgg]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.href;
    const targetId = href.replace(/.*\#/, "");
    const elem = document.getElementById(targetId);
    if (elem) {
      const yOffset = -80; 
      const y = elem.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleImageClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      setShowEasterEgg(true);
      setClickCount(0);
    }
    setTimeout(() => setClickCount(0), 3000);
  };

  // --- LOGIKA MENGIRIM PESAN LEWAT API ROUTE YANG AMAN ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormStatus('loading');

    try {
      // Kita kirim data ke API buatan kita sendiri (/api/gallery), BUKAN ke Discord langsung
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });

      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        throw new Error('Gagal mengirim');
      }
    } catch (error) {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  // --- LOGIKA MESIN TERMINAL ---
  const handleTerminalCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const fullCmd = inputValue.trim().toLowerCase();
      setInputValue('');
      if (!fullCmd) return;

      const args = fullCmd.split(' ');
      const cmd = args[0];

      setTerminalHistory(prev => [...prev, { type: 'input', text: `root@proot:~$ ${fullCmd}` }]);

      switch (cmd) {
        case 'help':
          setTerminalHistory(prev => [...prev, 
            { type: 'output', text: 'Available commands:' },
            { type: 'output', text: '  sysinfo    - Extract local & network target specs' },
            { type: 'output', text: '  ip         - Fetch target public IP Address' },
            { type: 'output', text: '  lookup     - OSINT IP/Domain lookup (e.g., lookup github.com)' },
            { type: 'output', text: '  serverinfo - Display Vercel host details' },
            { type: 'output', text: '  clear      - Clear the terminal screen' },
            { type: 'output', text: '  exit       - Close terminal' }
          ]);
          break;
        
        case 'lookup':
          if (args.length < 2) {
            setTerminalHistory(prev => [...prev, { type: 'error', text: 'Usage: lookup <ip/domain>' }]);
            break;
          }
          const target = args[1];
          setTerminalHistory(prev => [...prev, { type: 'system', text: `Initiating OSINT scan on ${target}...` }]);
          
          try {
            let ipToScan = target;
            const isIp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(target);
            
            if (!isIp) {
              setTerminalHistory(prev => [...prev, { type: 'system', text: `Resolving domain ${target}...` }]);
              const dnsRes = await fetch(`https://dns.google/resolve?name=${target}&type=A`);
              const dnsData = await dnsRes.json();
              if (dnsData.Answer && dnsData.Answer.length > 0) {
                ipToScan = dnsData.Answer[0].data;
                setTerminalHistory(prev => [...prev, { type: 'system', text: `Resolved to IP: ${ipToScan}` }]);
              } else {
                throw new Error('Domain resolution failed.');
              }
            }

            setTerminalHistory(prev => [...prev, { type: 'system', text: `Extracting geolocation and ISP data for ${ipToScan}...` }]);
            const osintRes = await fetch(`https://ipwho.is/${ipToScan}`);
            const osintData = await osintRes.json();

            if (!osintData.success) {
               throw new Error(osintData.message || 'Invalid IP/Domain');
            }

            setTerminalHistory(prev => [...prev, 
              { type: 'output', text: '-----------------------------------------' },
              { type: 'output', text: '[ OSINT REPORT ]' },
              { type: 'output', text: `Target       : ${target}` },
              { type: 'output', text: `IP Address   : ${osintData.ip}` },
              { type: 'output', text: `Location     : ${osintData.city}, ${osintData.region}, ${osintData.country}` },
              { type: 'output', text: `Coordinates  : ${osintData.latitude}, ${osintData.longitude}` },
              { type: 'output', text: `ISP / Org    : ${osintData.connection.isp} / ${osintData.connection.org}` },
              { type: 'output', text: `ASN          : ${osintData.connection.asn}` },
              { type: 'output', text: '-----------------------------------------' }
            ]);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (err: any) {
            setTerminalHistory(prev => [...prev, { type: 'error', text: `OSINT Scan Failed: ${err.message}` }]);
          }
          break;

        case 'sysinfo':
          setTerminalHistory(prev => [...prev, { type: 'system', text: 'Initiating deep scan on target network and system...' }]);
          try {
            const ua = navigator.userAgent;
            let os = "Unknown OS", osVersion = "Unknown";
            if (ua.includes("Win")) { os = "Windows"; osVersion = ua.match(/Windows NT ([\d.]+)/)?.[1] || "NT"; } 
            else if (ua.includes("Android")) { os = "Android"; osVersion = ua.match(/Android ([\d.]+)/)?.[1] || ""; } 
            else if (ua.includes("Mac")) { os = "MacOS"; osVersion = ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, '.') || ""; } 
            else if (ua.includes("iPhone") || ua.includes("iPad")) { os = "iOS"; osVersion = ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, '.') || ""; } 
            else if (ua.includes("Linux")) { os = "Linux"; }

            let browser = "Unknown";
            if (ua.includes("Chrome") && !ua.includes("Edg") && !ua.includes("OPR")) browser = "Chrome";
            else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
            else if (ua.includes("Firefox")) browser = "Firefox";
            else if (ua.includes("Edg")) browser = "Edge";
            else if (ua.includes("OPR") || ua.includes("Opera")) browser = "Opera";

            const res = await fetch('https://ipwho.is/');
            const data = await res.json();
            
            setTerminalHistory(prev => [...prev, 
              { type: 'output', text: '-----------------------------------------' },
              { type: 'output', text: '[ TARGET ANALYSIS COMPLETED ]' },
              { type: 'output', text: `User OS      : ${os} ${osVersion}` },
              { type: 'output', text: `Browser      : ${browser}` },
              { type: 'output', text: `IP Address   : ${data.ip || 'Hidden'}` },
              { type: 'output', text: `Location     : ${data.city || 'Unknown'}, ${data.country || 'Unknown'}` },
              { type: 'output', text: `ISP / Org    : ${data.connection?.isp || 'Unknown'}` },
              { type: 'output', text: '-----------------------------------------' }
            ]);
          } catch (err) {
            setTerminalHistory(prev => [...prev, { type: 'error', text: 'Target firewall detected. Failed to extract network data.' }]);
          }
          break;

        case 'ip':
          setTerminalHistory(prev => [...prev, { type: 'system', text: 'Bypassing proxy... Fetching public IP...' }]);
          try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            setTerminalHistory(prev => [...prev, { type: 'output', text: `TARGET ACQUIRED: Public IP Address is ${data.ip}` }]);
          } catch (err) {
            setTerminalHistory(prev => [...prev, { type: 'error', text: 'Connection blocked. Failed to fetch IP.' }]);
          }
          break;

        case 'serverinfo':
          setTerminalHistory(prev => [...prev, 
            { type: 'output', text: 'HOST       : Vercel Edge Network' },
            { type: 'output', text: 'REGION     : Washington, D.C., USA (iad1)' },
            { type: 'output', text: 'FRAMEWORK  : Next.js v16.2.1 (Turbopack)' },
            { type: 'output', text: 'STATUS     : Online & Secured' }
          ]);
          break;

        case 'clear':
          setTerminalHistory([]);
          break;

        case 'exit':
          setShowEasterEgg(false);
          setTerminalHistory([
            { type: 'system', text: 'ROOT_ACCESS_GRANTED. Vercel Cloud Server Connected.' },
            { type: 'system', text: 'Type "help" to see available commands.' }
          ]);
          break;

        default:
          setTerminalHistory(prev => [...prev, { type: 'error', text: `Command not found: ${cmd}. Type "help" for a list of commands.` }]);
          break;
      }
    }
  };

  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-32 overflow-hidden relative">
      
      {/* --- SCROLL PROGRESS BAR --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 sm:h-2 bg-gradient-to-r from-blue-600 to-cyan-400 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* --- FLOATING NAVIGATION DOCK --- */}
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 px-3 sm:px-6 py-2.5 sm:py-3 rounded-full flex gap-2 sm:gap-6 md:gap-8 shadow-2xl w-max max-w-[95vw] overflow-x-auto scrollbar-hide"
      >
        <a href="#about" onClick={handleScroll} className="flex flex-col items-center gap-1 text-neutral-500 hover:text-blue-500 transition-colors group px-2">
          <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors"><HomeIcon size={20} className="w-5 h-5 sm:w-6 sm:h-6" /></div>
          <span className="text-[10px] font-medium hidden sm:block">Tentang</span>
        </a>
        <a href="#skills" onClick={handleScroll} className="flex flex-col items-center gap-1 text-neutral-500 hover:text-blue-500 transition-colors group px-2">
          <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors"><Cpu size={20} className="w-5 h-5 sm:w-6 sm:h-6" /></div>
          <span className="text-[10px] font-medium hidden sm:block">Arsenal</span>
        </a>
        <a href="#experience" onClick={handleScroll} className="flex flex-col items-center gap-1 text-neutral-500 hover:text-blue-500 transition-colors group px-2">
          <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors"><Briefcase size={20} className="w-5 h-5 sm:w-6 sm:h-6" /></div>
          <span className="text-[10px] font-medium hidden sm:block">Keahlian</span>
        </a>
        <a href="#certificates" onClick={handleScroll} className="flex flex-col items-center gap-1 text-neutral-500 hover:text-blue-500 transition-colors group px-2">
          <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors"><FileBadge size={20} className="w-5 h-5 sm:w-6 sm:h-6" /></div>
          <span className="text-[10px] font-medium hidden sm:block">Sertifikat</span>
        </a>
        <a href="#gallery" onClick={handleScroll} className="flex flex-col items-center gap-1 text-neutral-500 hover:text-blue-500 transition-colors group px-2">
          <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors"><ImageIcon size={20} className="w-5 h-5 sm:w-6 sm:h-6" /></div>
          <span className="text-[10px] font-medium hidden sm:block">Galeri</span>
        </a>
        <a href="#contact" onClick={handleScroll} className="flex flex-col items-center gap-1 text-neutral-500 hover:text-blue-500 transition-colors group px-2">
          <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors"><Phone size={20} className="w-5 h-5 sm:w-6 sm:h-6" /></div>
          <span className="text-[10px] font-medium hidden sm:block">Kontak</span>
        </a>
      </motion.nav>

      {/* --- HERO SECTION --- */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[85vh] flex items-center mb-16 md:mb-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full">
          
          <motion.div 
            className="lg:col-span-5 relative order-1 mb-4 lg:mb-0 w-full flex justify-center"
            initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp}
          >
            <div className="hidden lg:block absolute -top-6 -left-6 w-32 h-32 border-l-4 border-t-4 border-blue-500/30 rounded-tl-3xl z-0"></div>
            <div className="hidden lg:block absolute -bottom-6 -right-6 w-32 h-32 border-r-4 border-b-4 border-cyan-500/30 rounded-br-3xl z-0"></div>
            
            <div 
              onClick={handleImageClick}
              className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-full lg:h-[600px] lg:max-w-none rounded-full lg:rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-neutral-900 z-10 group cursor-crosshair mx-auto"
            >
              <Image src={personalInfo.photoPath} alt={`Foto Profil`} fill priority className={`object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-out ${clickCount > 0 ? 'scale-105 opacity-90' : ''}`} sizes="(max-w-768px) 100vw, 40vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent opacity-100 lg:opacity-60 group-hover:opacity-30 transition-opacity rounded-full lg:rounded-none"></div>
              
              <div className="absolute bottom-4 left-0 right-0 text-center lg:text-left lg:bottom-6 lg:left-6 z-20 text-white lg:right-auto">
                <p className="text-[8px] sm:text-[10px] lg:text-xs uppercase tracking-widest font-medium opacity-80 hidden lg:block">Portfolio</p>
                <p className="text-sm sm:text-lg lg:text-2xl font-extrabold tracking-tighter drop-shadow-md lg:drop-shadow-none">{personalInfo.firstName} <span className="font-light">{personalInfo.lastName}</span></p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-7 space-y-4 sm:space-y-6 lg:space-y-8 order-2 text-center lg:text-left"
            initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400 text-[10px] sm:text-xs font-mono mx-auto lg:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Status: Online • WIB {currentTime}
            </motion.div>

            <motion.h2 variants={fadeUp} className="text-[10px] sm:text-xs lg:text-base text-blue-500 font-semibold tracking-widest uppercase mt-2">
               {personalInfo.title}
            </motion.h2>
            
            <motion.h1 variants={fadeUp} className="text-3xl sm:text-5xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[1.1] relative">
              Membangun <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Sistem & Ekosistem.</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="max-w-2xl mx-auto lg:mx-0 text-sm sm:text-base lg:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed px-4 lg:px-0">
              Hai 👋, Saya {personalInfo.fullName}. {personalInfo.bio}
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-4 pt-2 lg:pt-4 text-[10px] sm:text-xs lg:text-sm font-medium text-neutral-700 dark:text-neutral-300">
              <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-3 py-2 sm:px-4 sm:py-3 rounded-full shadow-sm w-auto">
                <User size={14} className="text-blue-500 shrink-0 sm:w-4 sm:h-4" /><span className="truncate">{personalInfo.fullName}</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-3 py-2 sm:px-4 sm:py-3 rounded-full shadow-sm w-auto">
                <School size={14} className="text-blue-500 shrink-0 sm:w-4 sm:h-4" /><span className="truncate">{personalInfo.school}</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-3 py-2 sm:px-4 sm:py-3 rounded-full shadow-sm w-auto">
                <MapPin size={14} className="text-blue-500 shrink-0 sm:w-4 sm:h-4" /><span className="truncate">{personalInfo.origin}</span>
              </div>
            </motion.div>
            
            <motion.div variants={fadeUp} className="pt-4 lg:pt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a href="#experience" onClick={handleScroll} className="w-full sm:w-auto text-center px-8 py-3 sm:px-10 sm:py-4 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-full font-bold text-sm sm:text-base hover:scale-105 transition-transform shadow-lg cursor-pointer">
                Eksplorasi Karya 🛠️
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- TEXT MARQUEE --- */}
      <section className="w-full bg-blue-600 text-white py-3 sm:py-4 md:py-5 overflow-hidden my-12 sm:my-16 md:my-24 transform -rotate-2 scale-105 shadow-xl">
        <motion.div animate={{ x: [0, -1500] }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="whitespace-nowrap flex gap-6 sm:gap-8 md:gap-12 text-sm sm:text-xl md:text-3xl font-black uppercase tracking-widest">
          <span>• Web Development • IoT Systems • Hardware Tuning • Offensive Security • System Modding</span>
          <span>• Web Development • IoT Systems • Hardware Tuning • Offensive Security • System Modding</span>
        </motion.div>
      </section>

      {/* --- TECH ARSENAL / SKILLS --- */}
      <section id="skills" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp} className="flex flex-col items-center text-center mb-10 sm:mb-16">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-2xl mb-4"><Cpu size={32} /></div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-4">Tech Arsenal & Tools</h2>
          <p className="text-sm sm:text-base text-neutral-500 max-w-2xl">Review Alat Dan Skill Bahasa Pemrograman.</p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {techStackData.map((tech, index) => (
            <motion.div key={index} variants={fadeUp} className="p-6 sm:p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <tech.icon className="text-blue-500 w-6 h-6 sm:w-8 sm:h-8" />
                <h3 className="font-bold text-lg">{tech.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {tech.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 shadow-sm">{skill}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- EXPERIENCE SECTION --- */}
      <section id="experience" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 border-t dark:border-neutral-800">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp} className="text-2xl sm:text-4xl md:text-6xl font-black mb-8 sm:mb-12 md:mb-20 border-b-2 pb-4 sm:pb-6 dark:border-neutral-800 tracking-tighter">
          Eksplorasi & Keahlian ✨
        </motion.h2>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-10">
          {experienceData.map((exp, index) => (
            <motion.div key={index} variants={fadeUp} className="group p-5 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-500 relative overflow-hidden shadow-sm hover:shadow-xl md:hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-full h-1 sm:h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <h3 className="text-lg sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 md:mb-5 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">{exp.title}</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-xs sm:text-sm md:text-lg">{exp.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- CERTIFICATES --- */}
      <section id="certificates" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp} className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12 md:mb-16 border-b-2 pb-4 sm:pb-6 dark:border-neutral-800">
          <Award className="text-blue-500 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tighter">Prestasi & Sertifikat</h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {certificateImages.map((cert, index) => (
            <motion.div key={index} variants={fadeUp} onClick={() => setSelectedImage(`/certificates/${cert}`)} className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden group border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
              <Image src={`/certificates/${cert}`} alt={`Sertifikat ${index + 1}`} fill className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out" sizes="(max-w-768px) 100vw, 50vw, 33vw" />
              <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                 <div className="p-2 sm:p-3 rounded-full bg-white/20 backdrop-blur-sm text-white scale-50 group-hover:scale-100 transition-transform duration-300"><ZoomIn className="w-5 h-5 sm:w-6 sm:h-6" /></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- DYNAMIC GALLERY SECTION --- */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp} className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12 md:mb-16 border-b-2 pb-4 sm:pb-6 dark:border-neutral-800">
          <Camera className="text-blue-500 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tighter">Dokumentasi & Bukti</h2>
        </motion.div>
        {photos.length === 0 ? (
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp} className="text-neutral-500 text-center py-8 sm:py-10 bg-neutral-100 dark:bg-neutral-900 rounded-[1.5rem] sm:rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 text-xs sm:text-sm md:text-base">
            Belum ada foto. Masukkan foto ke folder <code className="bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded">public/projects</code>.
          </motion.p>
        ) : (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {photos.map((photo, index) => (
              <motion.div key={index} variants={fadeUp} onClick={() => setSelectedImage(`/projects/${photo}`)} className="relative aspect-square rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden group border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-300">
                <Image src={`/projects/${photo}`} alt={`Dokumentasi ${index + 1}`} fill priority={index < 4} className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-in-out" sizes="(max-w-768px) 50vw, 33vw, 25vw" />
                <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/60 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                   <div className="p-1.5 sm:p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-sm text-white scale-50 group-hover:scale-100 transition-transform duration-300"><ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* --- FOOTER (CONTACT & SOCIAL MEDIA WITH WEBHOOK FORM) --- */}
      <footer id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-24 lg:pb-16 border-t dark:border-neutral-800">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 items-start">
          
          <motion.div variants={fadeUp} className="lg:col-span-5 flex flex-col h-full">
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-none mb-3 sm:mb-4 md:mb-6">Kirim <br className="hidden lg:block"/> Pesan</h2>
              <p className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-400">Pesan yang dikirim dari sini akan langsung masuk ke server Discord pribadiku. Coba saja!</p>
            </div>

            {/* --- FORM DISCORD WEBHOOK --- */}
            <form onSubmit={handleSendMessage} className="space-y-4 flex-1">
              <div className="space-y-4">
                <input 
                  type="text" placeholder="Nama Kamu" required 
                  className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                />
                <input 
                  type="email" placeholder="Email Kamu" required 
                  className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm" 
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
                />
                <textarea 
                  placeholder="Isi pesan, tawaran proyek, atau sapaan hangat..." required rows={4} 
                  className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm resize-none" 
                  value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} 
                />
              </div>
              <button 
                type="submit" disabled={formStatus === 'loading'} 
                className="w-full py-3.5 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-black font-bold transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                {formStatus === 'loading' ? 'Mengirim Data...' : 
                 formStatus === 'success' ? 'Terkirim! ✅' : 
                 formStatus === 'error' ? 'Gagal Terkirim ❌' : 
                 <><Send size={18} /> Kirim via Webhook</>}
              </button>
            </form>
          </motion.div>

          <motion.div variants={staggerContainer} className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mt-8 lg:mt-0">
            <DiscordProfileCard discordId="582206666431266816" />
            <SocialCard icon={Mail} label="Kirim Email" value={personalInfo.email} href={`mailto:${personalInfo.email}`} />
            <SocialCard icon={CustomInstagram} label="Instagram" value={`@${personalInfo.instagram}`} href={`https://instagram.com/${personalInfo.instagram}`} />
            <SocialCard icon={CustomFacebook} label="Facebook" value={personalInfo.facebook} href={personalInfo.facebookLink} />
            <SocialCard icon={CustomGithub} label="GitHub" value={`@${personalInfo.githubMain}`} href={`https://github.com/${personalInfo.githubMain}`} />
            <SocialCard icon={CustomGithub} label="GitHub (Suspended)" value={`@${personalInfo.githubSuspended}`} href={`https://github.com/${personalInfo.githubSuspended}`} isSuspended={true} />
            <SocialCard icon={CustomSteam} label="Steam Profile" value="Sagiri" href={personalInfo.steamLink} />
          </motion.div>

        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp} className="text-center pt-12 sm:pt-16 md:pt-24 mt-10 sm:mt-12 md:mt-16 border-t dark:border-neutral-800">
          <p className="text-[10px] sm:text-xs md:text-sm text-neutral-500 font-medium">© {new Date().getFullYear()} {personalInfo.fullName}. All rights reserved. Made with ❤️ in Surabaya.</p>
        </motion.div>
      </footer>

      {/* --- OVERLAY MODAL FOTO --- */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div key="modal" variants={modalVariant} initial="hidden" animate="visible" exit="hidden" onClick={() => setSelectedImage(null)} className="fixed inset-0 z-50 bg-neutral-950/95 p-2 sm:p-4 flex items-center justify-center cursor-pointer backdrop-blur-sm">
            <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2 sm:p-3 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md text-white hover:bg-white/20 transition-colors">
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <motion.div variants={imageVariant} className="relative w-full max-w-7xl h-[70vh] sm:h-[80vh] md:h-[90vh] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden cursor-default shadow-2xl flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <Image src={selectedImage} alt="Full preview" fill className="object-contain" priority />
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 p-1 sm:p-1.5 md:p-2 px-2 sm:px-3 md:px-4 rounded-md sm:rounded-lg bg-black/50 text-white/70 text-[8px] sm:text-[10px] md:text-xs font-mono backdrop-blur-sm truncate max-w-[80%]">{selectedImage.split('/').pop()}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- EASTER EGG OVERLAY (INTERACTIVE TERMINAL) --- */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div key="easter-egg" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md" onClick={() => setShowEasterEgg(false)}>
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="bg-black border border-green-500/50 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.2)] sm:shadow-[0_0_30px_rgba(34,197,94,0.3)] w-full max-w-3xl h-[60vh] sm:h-[70vh] flex flex-col overflow-hidden relative" onClick={(e) => { e.stopPropagation(); terminalInputRef.current?.focus(); }}>
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-950/20 border-b border-green-500/30 shrink-0">
                <Terminal className="text-green-500 w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                <h3 className="text-green-500 font-mono text-sm sm:text-base md:text-lg font-bold tracking-widest truncate">daluraziq@server:~</h3>
                <button onClick={() => setShowEasterEgg(false)} className="ml-auto text-green-500/50 hover:text-green-500 p-1"><X size={18} className="sm:w-5 sm:h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-1.5 sm:space-y-2 font-mono text-[10px] sm:text-xs md:text-sm lg:text-base scrollbar-thin scrollbar-thumb-green-500/20 scrollbar-track-transparent">
                {terminalHistory.map((item, index) => (
                  <div key={index} className={`${item.type === 'system' ? 'text-green-400 opacity-80' : ''} ${item.type === 'input' ? 'text-white' : ''} ${item.type === 'output' ? 'text-green-300' : ''} ${item.type === 'error' ? 'text-red-400' : ''}`}>
                    <pre className="whitespace-pre-wrap font-inherit break-words">{item.text}</pre>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 sm:gap-2 mt-2">
                  <span className="text-green-500 shrink-0">root@proot:~$</span>
                  <input ref={terminalInputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleTerminalCommand} className="flex-1 bg-transparent border-none outline-none text-white font-mono min-w-0" spellCheck="false" autoComplete="off" autoFocus />
                </div>
                <div ref={terminalEndRef} className="h-4 sm:h-0" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}