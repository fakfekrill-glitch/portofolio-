'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Shield,
  Key,
  User,
  Award,
  FolderGit2,
  Lock,
  LogOut,
  Upload,
  Trash2,
  Save,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Download,
  RotateCcw,
  Eye,
  EyeOff,
  Layers,
  Zap
} from 'lucide-react';
import { usePortfolioData } from '@/lib/portfolioStore';
import { sha256, DEFAULT_ADMIN_HASH, validateAndReadImageFile, sanitizeString } from '@/lib/security';
import { CertificateItem, ProjectProofItem } from '@/lib/types';
import { parseGitHubUrl } from '@/lib/githubReadme';

const AUTH_STORAGE_KEY = 'dalu_admin_session';
const PASSKEY_HASH_KEY = 'dalu_admin_passkey_hash';
const LOCKOUT_KEY = 'dalu_admin_lockout';
const ATTEMPTS_KEY = 'dalu_admin_attempts';

export default function AdminPage() {
  const {
    data,
    updateProfile,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    addProject,
    updateProject,
    deleteProject,
    resetToDefaults,
    exportData,
    importData
  } = usePortfolioData();

  // Lazy Initializers to avoid setState in effect
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'authenticated';
  });

  const [lockoutSeconds, setLockoutSeconds] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const lockoutUntil = parseInt(localStorage.getItem(LOCKOUT_KEY) || '0', 10);
    const now = Date.now();
    return lockoutUntil > now ? Math.ceil((lockoutUntil - now) / 1000) : 0;
  });

  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'certificates' | 'projects' | 'security'>('profile');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile Form state initialized from store
  const [profileForm, setProfileForm] = useState(data.profile);
  const [avatarPreview, setAvatarPreview] = useState(data.profile.photoPath);

  // Certificate Form state
  const [certForm, setCertForm] = useState<Omit<CertificateItem, 'id'>>({
    title: '',
    issuer: '',
    date: '2026',
    image: '',
    description: '',
    credentialUrl: ''
  });
  const [certImagePreview, setCertImagePreview] = useState<string>('');
  const [editingCertId, setEditingCertId] = useState<string | null>(null);

  // Project Proof Form state
  const [projectForm, setProjectForm] = useState<Omit<ProjectProofItem, 'id'>>({
    title: '',
    category: 'Android Kernel',
    version: 'Linux 4.14.x',
    date: '2026',
    description: '',
    image: '',
    tags: ['POCO X3 Pro', 'sm8150'],
    proofUrl: ''
  });
  const [tagsInput, setTagsInput] = useState('POCO X3 Pro, sm8150, Kernel');
  const [projectImagePreview, setProjectImagePreview] = useState<string>('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [fetchingGithub, setFetchingGithub] = useState<boolean>(false);

  // Passkey change form
  const [newPasskey, setNewPasskey] = useState('');
  const [confirmPasskey, setConfirmPasskey] = useState('');
  const [passkeyNotice, setPasskeyNotice] = useState('');

  const jsonImportRef = useRef<HTMLInputElement>(null);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Lockout Countdown Timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(LOCKOUT_KEY);
          localStorage.removeItem(ATTEMPTS_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // Handle Login Submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    setAuthError('');
    const inputClean = pinInput.trim();
    if (!inputClean) return;

    // Check default passwords (including case-insensitive check for mobile phone keyboards)
    const isDefaultMatch =
      inputClean === 'vayu860-kernel' ||
      inputClean.toLowerCase() === 'vayu860-kernel' ||
      inputClean === 'NETRUNNER2077' ||
      inputClean.toLowerCase() === 'netrunner2077';

    const customHash = localStorage.getItem(PASSKEY_HASH_KEY);
    const hashedInput = await sha256(inputClean);

    const isMatch = customHash
      ? hashedInput === customHash
      : (isDefaultMatch || hashedInput === DEFAULT_ADMIN_HASH);

    if (isMatch) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'authenticated');
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_KEY);
      setLockoutSeconds(0);
      setIsAuthenticated(true);
      setPinInput('');
      showToast('Autentikasi berhasil. Selamat datang di Admin Dashboard.');
    } else {
      const attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0', 10) + 1;
      localStorage.setItem(ATTEMPTS_KEY, attempts.toString());

      if (attempts >= 5) {
        const lockoutTime = Date.now() + 5 * 60 * 1000;
        localStorage.setItem(LOCKOUT_KEY, lockoutTime.toString());
        setLockoutSeconds(300);
        setAuthError('Terlalu banyak percobaan gagal. Akses diblokir selama 5 menit.');
      } else {
        setAuthError(`Passphrase salah. Sisa kesempatan: ${5 - attempts}`);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    showToast('Sesi ditutup.');
  };

  // Avatar Upload Handler
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await validateAndReadImageFile(file, 4);
    if (!res.valid || !res.dataUrl) {
      alert(res.error || 'Gagal memproses gambar avatar');
      return;
    }
    setAvatarPreview(res.dataUrl);
    setProfileForm({ ...profileForm, photoPath: res.dataUrl });
    showToast('Foto avatar siap disimpan.');
  };

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...profileForm,
      fullName: sanitizeString(profileForm.fullName),
      title: sanitizeString(profileForm.title),
      device: sanitizeString(profileForm.device),
      soc: sanitizeString(profileForm.soc),
      kernelVersion: sanitizeString(profileForm.kernelVersion),
      bio: sanitizeString(profileForm.bio, 2000),
      email: sanitizeString(profileForm.email, 100),
      location: sanitizeString(profileForm.location, 100),
    });
    showToast('Profil kernel developer berhasil diperbarui!');
  };

  // Certificate Image Upload
  const handleCertImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await validateAndReadImageFile(file, 5);
    if (!res.valid || !res.dataUrl) {
      alert(res.error || 'Gagal memproses gambar sertifikat');
      return;
    }
    setCertImagePreview(res.dataUrl);
    setCertForm({ ...certForm, image: res.dataUrl });
  };

  // Save Certificate
  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title || !certForm.image) {
      alert('Judul dan file gambar sertifikat wajib diisi!');
      return;
    }

    if (editingCertId) {
      updateCertificate(editingCertId, {
        ...certForm,
        title: sanitizeString(certForm.title),
        issuer: sanitizeString(certForm.issuer),
        description: sanitizeString(certForm.description || '', 1000)
      });
      showToast('Sertifikat berhasil diperbarui!');
    } else {
      addCertificate({
        ...certForm,
        title: sanitizeString(certForm.title),
        issuer: sanitizeString(certForm.issuer),
        description: sanitizeString(certForm.description || '', 1000)
      });
      showToast('Sertifikat baru berhasil ditambahkan!');
    }

    setEditingCertId(null);
    setCertForm({ title: '', issuer: '', date: '2026', image: '', description: '', credentialUrl: '' });
    setCertImagePreview('');
  };

  const handleEditCert = (cert: CertificateItem) => {
    setEditingCertId(cert.id);
    setCertForm({
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date,
      image: cert.image,
      description: cert.description || '',
      credentialUrl: cert.credentialUrl || ''
    });
    setCertImagePreview(cert.image);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Project Image Upload
  const handleProjectImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await validateAndReadImageFile(file, 5);
    if (!res.valid || !res.dataUrl) {
      alert(res.error || 'Gagal memproses gambar bukti proyek');
      return;
    }
    setProjectImagePreview(res.dataUrl);
    setProjectForm({ ...projectForm, image: res.dataUrl });
  };

  // Save Project Proof
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.image) {
      alert('Judul proyek dan gambar bukti pengerjaan wajib diisi!');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => sanitizeString(t.trim()))
      .filter(Boolean);

    if (editingProjectId) {
      updateProject(editingProjectId, {
        ...projectForm,
        title: sanitizeString(projectForm.title),
        version: sanitizeString(projectForm.version),
        description: sanitizeString(projectForm.description, 1500),
        tags: tagsArray
      });
      showToast('Dokumentasi bukti proyek berhasil diperbarui!');
    } else {
      addProject({
        ...projectForm,
        title: sanitizeString(projectForm.title),
        version: sanitizeString(projectForm.version),
        description: sanitizeString(projectForm.description, 1500),
        tags: tagsArray
      });
      showToast('Dokumentasi bukti proyek baru berhasil ditambahkan!');
    }

    setEditingProjectId(null);
    setProjectForm({
      title: '',
      category: 'Android Kernel',
      version: 'Linux 4.14.x',
      date: '2026',
      description: '',
      image: '',
      tags: ['POCO X3 Pro', 'sm8150'],
      proofUrl: ''
    });
    setTagsInput('POCO X3 Pro, sm8150');
    setProjectImagePreview('');
  };

  const handleEditProject = (proj: ProjectProofItem) => {
    setEditingProjectId(proj.id);
    setProjectForm({
      title: proj.title,
      category: proj.category,
      version: proj.version,
      date: proj.date,
      description: proj.description,
      image: proj.image,
      tags: proj.tags,
      proofUrl: proj.proofUrl || '',
      githubRepo: proj.githubRepo || '',
      readmeContent: proj.readmeContent || ''
    });
    setTagsInput(proj.tags.join(', '));
    setProjectImagePreview(proj.image);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Auto-Fetch & Generate Screenshot from GitHub README
  const handleFetchGitHubReadme = async () => {
    if (!projectForm.proofUrl) {
      alert('Masukkan link repository GitHub terlebih dahulu pada kolom Tautan Repository!');
      return;
    }

    const parsed = parseGitHubUrl(projectForm.proofUrl);
    if (!parsed) {
      alert('Format link GitHub tidak dikenali. Contoh: https://github.com/fakfekrill-glitch/portofolio-');
      return;
    }

    setFetchingGithub(true);
    try {
      const res = await fetch(`/api/github-readme?url=${encodeURIComponent(projectForm.proofUrl)}`);
      const json = await res.json();

      if (res.ok && json.success) {
        const repoData = json.data;

        // 1. Set generated SVG screenshot as project image preview
        setProjectImagePreview(repoData.screenshotSvg);

        // 2. Autofill title if empty
        const newTitle =
          projectForm.title.trim() === ''
            ? repoData.repo.replace(/[-_]/g, ' ').toUpperCase()
            : projectForm.title;

        // 3. Autofill description if empty
        const newDesc =
          projectForm.description.trim() === ''
            ? repoData.description || `Repository GitHub ${repoData.fullName} untuk pengembangan kernel dan sistem POCO X3 Pro.`
            : projectForm.description;

        // 4. Autofill tags
        const existingTags = tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
        const combinedTags = Array.from(
          new Set([...existingTags, repoData.language, ...(repoData.topics || []), 'POCO X3 Pro', 'sm8150'])
        ).filter(Boolean);

        setTagsInput(combinedTags.join(', '));

        setProjectForm((prev) => ({
          ...prev,
          title: newTitle,
          description: newDesc,
          image: repoData.screenshotSvg,
          githubRepo: repoData.fullName,
          readmeContent: repoData.readme || ''
        }));

        showToast(`Berhasil generate screenshot README untuk ${repoData.fullName}!`);
      } else {
        alert(json.error || 'Gagal mengambil data README dari repositori GitHub.');
      }
    } catch {
      alert('Koneksi ke GitHub gagal. Pastikan URL benar dan web terhubung ke internet.');
    } finally {
      setFetchingGithub(false);
    }
  };

  // Change Admin Passkey
  const handleChangePasskey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasskey.length < 6) {
      setPasskeyNotice('Passphrase minimal harus 6 karakter.');
      return;
    }
    if (newPasskey !== confirmPasskey) {
      setPasskeyNotice('Konfirmasi passphrase tidak cocok.');
      return;
    }
    const newHash = await sha256(newPasskey);
    localStorage.setItem(PASSKEY_HASH_KEY, newHash);
    setNewPasskey('');
    setConfirmPasskey('');
    setPasskeyNotice('Passphrase berhasil diganti!');
    showToast('Passphrase master admin berhasil diubah.');
  };

  // JSON Import Handler
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const ok = importData(parsed);
        if (ok) {
          showToast('Data portofolio berhasil dipulihkan dari cadangan JSON!');
        } else {
          alert('Format data JSON tidak valid.');
        }
      } catch {
        alert('Gagal membaca file JSON cadangan.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ==========================================
  // VIEW 1: SECURITY GATE (LOGIN SCREEN)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-white">
              ADMIN CONTROL DECK
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              POCO X3 Pro Kernel Portfolio Management
            </p>
          </div>

          {lockoutSeconds > 0 ? (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs font-mono text-center space-y-2 mb-4">
              <div className="flex items-center justify-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>KEAMANAN AKTIF: TERKUNCI</span>
              </div>
              <p>Terlalu banyak percobaan salah.</p>
              <p className="text-white text-sm font-bold">Terkunci: {lockoutSeconds} detik</p>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem(LOCKOUT_KEY);
                  localStorage.removeItem(ATTEMPTS_KEY);
                  setLockoutSeconds(0);
                  setAuthError('');
                }}
                className="mt-2 px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-mono transition-colors cursor-pointer"
              >
                Buka Kunci Sekarang
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Master Security Passphrase
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Masukkan passphrase..."
                    required
                    autoFocus
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <p className="text-xs font-mono text-rose-400 bg-rose-950/30 p-2.5 rounded-lg border border-rose-900">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Otentikasi & Buka Dashboard</span>
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Portofolio Utama</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl font-mono text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-mono font-bold text-sm sm:text-base text-slate-100">
                  KERNEL ADMIN DECK
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Authenticated
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono hidden sm:block">
                POCO X3 Pro (vayu / bhima) • {data.profile.fullName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lihat Web</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-xs text-slate-400">Device Target</p>
            <p className="text-sm font-bold text-slate-100 mt-1 truncate">POCO X3 Pro</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-xs text-slate-400">SoC Platform</p>
            <p className="text-sm font-bold text-slate-100 mt-1 truncate">Snapdragon 860</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-xs text-slate-400">Total Sertifikat</p>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">{data.certificates.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-xs text-slate-400">Dokumentasi Proyek</p>
            <p className="text-lg font-bold text-cyan-400 mt-0.5">{data.projects.length}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 mb-6 overflow-x-auto scrollbar-hide gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-mono text-xs whitespace-nowrap transition-colors ${
              activeTab === 'profile'
                ? 'border-emerald-500 text-emerald-400 font-bold bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profil & Kernel</span>
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-mono text-xs whitespace-nowrap transition-colors ${
              activeTab === 'certificates'
                ? 'border-emerald-500 text-emerald-400 font-bold bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Upload & Kelola Sertifikat ({data.certificates.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-mono text-xs whitespace-nowrap transition-colors ${
              activeTab === 'projects'
                ? 'border-emerald-500 text-emerald-400 font-bold bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Upload & Kelola Bukti Proyek ({data.projects.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-mono text-xs whitespace-nowrap transition-colors ${
              activeTab === 'security'
                ? 'border-emerald-500 text-emerald-400 font-bold bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Backup & Keamanan</span>
          </button>
        </div>

        {/* TAB 1: PROFIL & KERNEL INFORMATION */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
              <h2 className="font-mono text-sm font-bold text-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                <span>Identitas & Informasi Kernel</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Gelar / Role</label>
                  <input
                    type="text"
                    value={profileForm.title}
                    onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Perangkat Utama</label>
                  <input
                    type="text"
                    value={profileForm.device}
                    onChange={(e) => setProfileForm({ ...profileForm, device: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Chipset / SoC</label>
                  <input
                    type="text"
                    value={profileForm.soc}
                    onChange={(e) => setProfileForm({ ...profileForm, soc: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Versi Kernel</label>
                  <input
                    type="text"
                    value={profileForm.kernelVersion}
                    onChange={(e) => setProfileForm({ ...profileForm, kernelVersion: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Kontak Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Deskripsi Singkat (Tentang Saya)
                </label>
                <textarea
                  rows={4}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="pt-2">
                <label className="block text-xs font-mono text-slate-400 mb-2">
                  Upload Foto Profil Web
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shrink-0 flex items-center justify-center p-1">
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 cursor-pointer">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Pilih Foto dari Komputer</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] font-mono text-slate-500 mt-1">
                      Maksimal 4MB. Format: JPG, PNG, WEBP.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
              <h2 className="font-mono text-sm font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Tautan Komunitas & Profil</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Discord User ID</label>
                  <input
                    type="text"
                    value={profileForm.discordId}
                    onChange={(e) => setProfileForm({ ...profileForm, discordId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">GitHub Username</label>
                  <input
                    type="text"
                    value={profileForm.github}
                    onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Instagram Handle</label>
                  <input
                    type="text"
                    value={profileForm.instagram}
                    onChange={(e) => setProfileForm({ ...profileForm, instagram: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Steam Profile URL</label>
                  <input
                    type="text"
                    value={profileForm.steamUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, steamUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-colors flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Profil</span>
            </button>
          </form>
        )}

        {/* TAB 2: UPLOAD & KELOLA SERTIFIKAT */}
        {activeTab === 'certificates' && (
          <div className="space-y-8">
            <form onSubmit={handleSaveCert} className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
              <h2 className="font-mono text-sm font-bold text-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>{editingCertId ? 'Edit Sertifikat' : 'Upload Sertifikat Baru'}</span>
                </span>
                {editingCertId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCertId(null);
                      setCertForm({ title: '', issuer: '', date: '2026', image: '', description: '', credentialUrl: '' });
                      setCertImagePreview('');
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Batal Edit
                  </button>
                )}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-slate-400 mb-1">Judul Sertifikat</label>
                  <input
                    type="text"
                    value={certForm.title}
                    onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                    placeholder="Contoh: Sertifikasi Rekayasa Sistem & Keamanan..."
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Tahun Terbit</label>
                  <input
                    type="text"
                    value={certForm.date}
                    onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Lembaga Penerbit</label>
                  <input
                    type="text"
                    value={certForm.issuer}
                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                    placeholder="Contoh: Lembaga Sertifikasi Nasional..."
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Tautan Verifikasi (Opsional)</label>
                  <input
                    type="url"
                    value={certForm.credentialUrl || ''}
                    onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Keterangan Tambahan</label>
                <textarea
                  rows={2}
                  value={certForm.description || ''}
                  onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                  placeholder="Deskripsi singkat kompetensi atau materi uji..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">
                  File Gambar Sertifikat (PNG / JPG / WEBP)
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 cursor-pointer">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Upload File Sertifikat</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleCertImageChange}
                      className="hidden"
                    />
                  </label>
                  {certImagePreview && (
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Gambar siap diunggah</span>
                    </div>
                  )}
                </div>

                {certImagePreview && (
                  <div className="mt-3 relative w-48 aspect-[4/3] rounded-lg overflow-hidden border border-slate-800 bg-black">
                    <img
                      src={certImagePreview}
                      alt="Pratinjau Sertifikat"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingCertId ? 'Perbarui Sertifikat' : 'Simpan Sertifikat'}</span>
              </button>
            </form>

            <div className="space-y-4">
              <h3 className="font-mono text-sm font-bold text-slate-200">
                Daftar Sertifikat Terpasang ({data.certificates.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-[4/3] bg-black/60 overflow-hidden">
                        <img
                          src={cert.image}
                          alt={cert.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-slate-300">
                          {cert.date}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-sm text-slate-100 truncate">{cert.title}</h4>
                        <p className="text-xs text-slate-400 font-mono mt-1 truncate">{cert.issuer}</p>
                        {cert.description && (
                          <p className="text-xs text-slate-400 mt-2 line-clamp-2">{cert.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="p-3 border-t border-slate-800/80 flex items-center justify-between bg-slate-950/40">
                      <button
                        onClick={() => handleEditCert(cert)}
                        className="text-xs font-mono text-emerald-400 hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus sertifikat "${cert.title}"?`)) {
                            deleteCertificate(cert.id);
                            showToast('Sertifikat berhasil dihapus.');
                          }
                        }}
                        className="text-xs font-mono text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: UPLOAD & KELOLA BUKTI PROYEK */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <form onSubmit={handleSaveProject} className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
              <h2 className="font-mono text-sm font-bold text-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-emerald-400" />
                  <span>{editingProjectId ? 'Edit Dokumentasi Bukti' : 'Upload Bukti Pengerjaan Proyek Baru'}</span>
                </span>
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProjectId(null);
                      setProjectForm({
                        title: '',
                        category: 'Android Kernel',
                        version: 'Linux 4.14.x',
                        date: '2026',
                        description: '',
                        image: '',
                        tags: ['POCO X3 Pro', 'sm8150'],
                        proofUrl: ''
                      });
                      setTagsInput('POCO X3 Pro, sm8150');
                      setProjectImagePreview('');
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Batal Edit
                  </button>
                )}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-slate-400 mb-1">Judul Bukti / Modul Proyek</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="Contoh: ReSukiSU + SuSFS Root Hiding Implementation..."
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Kategori</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        category: e.target.value as ProjectProofItem['category']
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    <option value="Android Kernel">Android Kernel</option>
                    <option value="Root & SuSFS">Root & SuSFS</option>
                    <option value="Toolchain & LLVM">Toolchain & LLVM</option>
                    <option value="Deployment">Deployment</option>
                    <option value="Hardware & Debugging">Hardware & Debugging</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Versi / Tag Build</label>
                  <input
                    type="text"
                    value={projectForm.version}
                    onChange={(e) => setProjectForm({ ...projectForm, version: e.target.value })}
                    placeholder="Linux 4.14.320 / Clang 18"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Tahun / Tanggal</label>
                  <input
                    type="text"
                    value={projectForm.date}
                    onChange={(e) => setProjectForm({ ...projectForm, date: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Tautan Repository GitHub / Rilis Project
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={projectForm.proofUrl || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, proofUrl: e.target.value })}
                    placeholder="https://github.com/fakfekrill-glitch/..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleFetchGitHubReadme}
                    disabled={fetchingGithub}
                    className="px-4 py-2.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors disabled:opacity-50 cursor-pointer min-h-[42px]"
                    title="Tarik README & Otomatis Buat Screenshot Code Window dari GitHub"
                  >
                    <Zap className={`w-3.5 h-3.5 ${fetchingGithub ? 'animate-spin text-cyan-400' : 'text-emerald-400'}`} />
                    <span>{fetchingGithub ? 'Menarik Data & Snapshot...' : 'Auto-Generate Screenshot README'}</span>
                  </button>
                </div>
                <p className="text-[11px] font-mono text-slate-500 mt-1">
                  ⚡ <strong>Auto-Snapshot</strong>: Masukkan link GitHub repo, lalu klik tombol di atas untuk otomatis generate screenshot card dari README & autofill info proyek.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Tag Kata Kunci (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="POCO X3 Pro, KernelSU, SuSFS, sm8150"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Deskripsi & Bukti Teknis Pengerjaan
                </label>
                <textarea
                  rows={3}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Jelaskan apa yang dikerjakan, patch yang diimplementasi, atau hasil pengujian..."
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">
                  Tangkapan Layar Bukti (Screenshot Build, Ramoops Log, Benchmarking)
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 cursor-pointer">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Upload Screenshot Bukti</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleProjectImageChange}
                      className="hidden"
                    />
                  </label>
                  {projectImagePreview && (
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Gambar bukti siap diunggah</span>
                    </div>
                  )}
                </div>

                {projectImagePreview && (
                  <div className="mt-3 relative max-w-sm aspect-video rounded-xl overflow-hidden border border-slate-800 bg-black shadow-lg">
                    <img
                      src={projectImagePreview}
                      alt="Pratinjau Bukti"
                      className="w-full h-full object-cover"
                    />
                    {projectImagePreview.startsWith('data:image/svg+xml') && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950/90 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
                        ⚡ Auto-Snapshot GitHub README
                      </span>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingProjectId ? 'Perbarui Bukti Proyek' : 'Simpan Bukti Proyek'}</span>
              </button>
            </form>

            <div className="space-y-4">
              <h3 className="font-mono text-sm font-bold text-slate-200">
                Daftar Dokumentasi & Bukti Pengerjaan ({data.projects.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-video bg-black/60 overflow-hidden">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {proj.category}
                        </div>
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-slate-300">
                          {proj.version}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-sm text-slate-100 truncate">{proj.title}</h4>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                          {proj.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {proj.tags.map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-950 text-slate-400 rounded border border-slate-800"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border-t border-slate-800/80 flex items-center justify-between bg-slate-950/40">
                      <button
                        onClick={() => handleEditProject(proj)}
                        className="text-xs font-mono text-emerald-400 hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus bukti proyek "${proj.title}"?`)) {
                            deleteProject(proj.id);
                            showToast('Bukti proyek berhasil dihapus.');
                          }
                        }}
                        className="text-xs font-mono text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BACKUP & SECURITY SETTINGS */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
              <h2 className="font-mono text-sm font-bold text-slate-100 flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Backup & Pemulihan Data Portofolio (JSON)</span>
              </h2>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Unduh seluruh data sertifikat, dokumentasi bukti, dan informasi profil sebagai file JSON
                sebagai cadangan aman. Anda dapat mengimpor file ini kapan saja atau memasukkannya ke
                repository GitHub.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={exportData}
                  className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup JSON</span>
                </button>

                <label className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>Restore dari File JSON</span>
                  <input
                    ref={jsonImportRef}
                    type="file"
                    accept="application/json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
              <h2 className="font-mono text-sm font-bold text-slate-100 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Ganti Master Passphrase Admin</span>
              </h2>

              <form onSubmit={handleChangePasskey} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Passphrase Baru (Minimal 6 karakter)
                  </label>
                  <input
                    type="password"
                    value={newPasskey}
                    onChange={(e) => setNewPasskey(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Konfirmasi Passphrase Baru
                  </label>
                  <input
                    type="password"
                    value={confirmPasskey}
                    onChange={(e) => setConfirmPasskey(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                {passkeyNotice && (
                  <p className="text-xs font-mono text-amber-400 bg-amber-950/20 p-2 rounded border border-amber-900">
                    {passkeyNotice}
                  </p>
                )}

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
                >
                  Ubah Passphrase
                </button>
              </form>
            </div>

            <div className="bg-slate-900 border border-rose-950 rounded-xl p-5 sm:p-6 space-y-3">
              <h2 className="font-mono text-sm font-bold text-rose-400 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                <span>Reset ke Data Asli (Factory Defaults)</span>
              </h2>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Kembalikan data profil, sertifikat asli, dan dokumentasi kernel POCO X3 Pro ke kondisi awal.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh data ke default awal?')) {
                    resetToDefaults();
                    showToast('Data berhasil direset ke pengaturan awal.');
                  }
                }}
                className="px-4 py-2 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 font-mono text-xs font-bold transition-colors cursor-pointer"
              >
                Reset Seluruh Data ke Awal
              </button>
            </div>
          </div>
        )}

        {/* Bottom Bar with Logout Button */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Sesi Admin Aktif • POCO X3 Pro</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              ← Kembali ke Web
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout dari Admin</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
