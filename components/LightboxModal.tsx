'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink, FileText, Image as ImageIcon, Copy, Check, Terminal, GitBranch } from 'lucide-react';
import { parseGitHubUrl } from '@/lib/githubReadme';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  title: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  proofUrl?: string;
  readmeContent?: string;
  githubRepo?: string;
}

export default function LightboxModal({
  isOpen,
  onClose,
  imageSrc,
  title,
  subtitle,
  description,
  tags,
  proofUrl,
  readmeContent: initialReadme,
  githubRepo: initialRepo
}: LightboxModalProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'readme'>('preview');
  const [readmeText, setReadmeText] = useState<string>(initialReadme || '');
  const [loadingReadme, setLoadingReadme] = useState<boolean>(false);
  const [copiedReadme, setCopiedReadme] = useState<boolean>(false);

  // Determine if this project is connected to a GitHub repository
  const githubInfo = parseGitHubUrl(proofUrl || '') || (initialRepo ? parseGitHubUrl(`github.com/${initialRepo}`) : null);

  // Reset tab on open
  useEffect(() => {
    if (isOpen) {
      setActiveTab('preview');
      setReadmeText(initialReadme || '');
    }
  }, [isOpen, initialReadme]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Fetch README live if user switches to README tab and it's not loaded yet
  useEffect(() => {
    if (activeTab === 'readme' && !readmeText && githubInfo) {
      let isSubscribed = true;
      setLoadingReadme(true);

      const fetchReadme = async () => {
        try {
          // 1. Try local API route
          const apiRes = await fetch(`/api/github-readme?url=${encodeURIComponent(`https://github.com/${githubInfo.owner}/${githubInfo.repo}`)}`);
          if (apiRes.ok) {
            const json = await apiRes.json();
            if (json.success && json.data.readme && isSubscribed) {
              setReadmeText(json.data.readme);
              setLoadingReadme(false);
              return;
            }
          }

          // 2. Fallback: Raw usercontent direct fetch
          for (const branch of ['main', 'master']) {
            try {
              const rawRes = await fetch(`https://raw.githubusercontent.com/${githubInfo.owner}/${githubInfo.repo}/${branch}/README.md`);
              if (rawRes.ok) {
                const text = await rawRes.text();
                if (isSubscribed) {
                  setReadmeText(text);
                  setLoadingReadme(false);
                  return;
                }
              }
            } catch {
              continue;
            }
          }

          if (isSubscribed) {
            setReadmeText('# Repository Info\n\nREADME belum disediakan di branch utama repositori ini.');
          }
        } catch {
          if (isSubscribed) {
            setReadmeText('# Gagal Memuat README\n\nPastikan repositori bersifat publik dan terhubung ke internet.');
          }
        } finally {
          if (isSubscribed) setLoadingReadme(false);
        }
      };

      fetchReadme();
      return () => {
        isSubscribed = false;
      };
    }
  }, [activeTab, readmeText, githubInfo]);

  const handleCopyReadme = () => {
    if (typeof navigator !== 'undefined' && readmeText) {
      navigator.clipboard.writeText(readmeText);
      setCopiedReadme(true);
      setTimeout(() => setCopiedReadme(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-3 sm:p-6 md:p-8 flex items-center justify-center cursor-pointer animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl cursor-default"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="min-w-0 pr-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-100 truncate">{title}</h3>
            {subtitle && <p className="text-xs text-slate-400 font-mono mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Tab Switcher if GitHub repo is detected */}
            {githubInfo && (
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-slate-800 text-emerald-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Bukti Screenshot</span>
                  <span className="sm:hidden">Bukti</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('readme')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                    activeTab === 'readme'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Embedded README</span>
                  <span className="sm:hidden">README</span>
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              aria-label="Tutup pratinjau"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Display Area */}
        {activeTab === 'preview' ? (
          <div className="relative flex-1 bg-black/40 min-h-[300px] sm:min-h-[420px] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
            <img
              src={imageSrc}
              alt={title}
              className="max-h-[68vh] max-w-full object-contain rounded-lg shadow-md"
            />
          </div>
        ) : (
          <div className="relative flex-1 bg-slate-950 min-h-[300px] sm:min-h-[420px] max-h-[68vh] overflow-y-auto p-4 sm:p-6 font-mono text-xs flex flex-col">
            {/* Embedded README Header Strip */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">{githubInfo?.owner} / {githubInfo?.repo}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                  <GitBranch className="w-3 h-3 text-emerald-400" />
                  <span>main</span>
                </span>
              </div>

              {readmeText && (
                <button
                  type="button"
                  onClick={handleCopyReadme}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedReadme ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReadme ? 'Disalin!' : 'Salin Markdown'}</span>
                </button>
              )}
            </div>

            {/* Readme Content */}
            {loadingReadme ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400 space-y-3">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p>Mengambil embedded README dari GitHub...</p>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none space-y-3 font-sans text-slate-300 text-sm leading-relaxed whitespace-pre-wrap selection:bg-emerald-500 selection:text-black">
                {readmeText}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer Info */}
        {(description || tags || proofUrl) && (
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/70 space-y-3">
            {description && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {description}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[11px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {proofUrl && (
                <a
                  href={proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>Buka Repository GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
