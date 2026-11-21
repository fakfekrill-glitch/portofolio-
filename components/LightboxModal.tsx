'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink, FileText, Image as ImageIcon, Copy, Check, Terminal, GitBranch } from 'lucide-react';
import { parseGitHubUrl } from '@/lib/githubReadme';
import MarkdownViewer from '@/components/MarkdownViewer';

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
  // Check if image is a real manual photo (not an SVG)
  const isManualPhoto = Boolean(imageSrc && !imageSrc.startsWith('data:image/svg+xml'));

  // Determine if this project is connected to a GitHub repository
  const githubInfo = parseGitHubUrl(proofUrl || '') || (initialRepo ? parseGitHubUrl(`github.com/${initialRepo}`) : null);
  const hasReadme = Boolean(initialReadme || githubInfo);

  // If there is no manual photo, default to README tab directly!
  const [activeTab, setActiveTab] = useState<'preview' | 'readme'>(
    isManualPhoto ? 'preview' : (hasReadme ? 'readme' : 'preview')
  );
  const [readmeText, setReadmeText] = useState<string>(initialReadme || '');
  const [loadingReadme, setLoadingReadme] = useState<boolean>(false);
  const [copiedReadme, setCopiedReadme] = useState<boolean>(false);

  // Reset tab on open
  useEffect(() => {
    if (isOpen) {
      setActiveTab(isManualPhoto ? 'preview' : (hasReadme ? 'readme' : 'preview'));
      setReadmeText(initialReadme || '');
    }
  }, [isOpen, initialReadme, isManualPhoto, hasReadme]);

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

  // Fetch README live if user is on README tab and it's not loaded yet
  useEffect(() => {
    if (isOpen && activeTab === 'readme' && !readmeText && githubInfo) {
      let isSubscribed = true;
      setLoadingReadme(true);

      const fetchReadme = async () => {
        try {
          // 1. Try local API route
          const apiRes = await fetch(
            `/api/github-readme?url=${encodeURIComponent(`https://github.com/${githubInfo.owner}/${githubInfo.repo}`)}`
          );
          if (apiRes.ok) {
            const json = await apiRes.json();
            if (json.success && json.data.readme && isSubscribed) {
              setReadmeText(json.data.readme);
              setLoadingReadme(false);
              return;
            }
          }

          // 2. Fallback: Raw usercontent direct fetch
          for (const branch of ['main', 'master', 'HEAD', 'dev']) {
            try {
              const rawRes = await fetch(
                `https://raw.githubusercontent.com/${githubInfo.owner}/${githubInfo.repo}/${branch}/README.md`
              );
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
            setReadmeText('# Gagal Memuat README\n\nPastikan repositori bersifat publik dan koneksi internet stabil.');
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
  }, [isOpen, activeTab, readmeText, githubInfo]);

  const handleCopyReadme = () => {
    if (typeof navigator !== 'undefined' && readmeText) {
      navigator.clipboard.writeText(readmeText);
      setCopiedReadme(true);
      setTimeout(() => setCopiedReadme(false), 2000);
    }
  };

  if (!isOpen) return null;

  const repoDirectUrl = githubInfo
    ? `https://github.com/${githubInfo.owner}/${githubInfo.repo}`
    : proofUrl || '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-2 sm:p-4 md:p-6 flex items-center justify-center cursor-pointer animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden shadow-2xl cursor-default"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 md:p-5 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <div className="min-w-0 pr-3 sm:pr-4">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-100 truncate flex items-center gap-2">
              <span>{title}</span>
            </h3>
            {subtitle && <p className="text-[11px] sm:text-xs text-slate-400 font-mono mt-0.5 truncate">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Tab Switcher if both manual photo and GitHub README are present */}
            {isManualPhoto && hasReadme && (
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md transition-all cursor-pointer ${
                    activeTab === 'preview'
                      ? 'bg-slate-800 text-emerald-400 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Foto Bukti</span>
                  <span className="sm:hidden">Foto</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('readme')}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md transition-all cursor-pointer ${
                    activeTab === 'readme'
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Scroll README</span>
                  <span className="sm:hidden">README</span>
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              aria-label="Tutup pratinjau"
              className="p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Display Area */}
        {activeTab === 'preview' && isManualPhoto ? (
          <div className="relative flex-1 bg-black/60 min-h-[300px] sm:min-h-[440px] flex flex-col items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <div className="relative max-w-full max-h-[70vh] flex items-center justify-center">
              <img
                src={imageSrc}
                alt={title}
                className="max-h-[66vh] max-w-full object-contain rounded-xl shadow-2xl border border-slate-800/80"
              />
            </div>
          </div>
        ) : (
          <div className="relative flex-1 bg-slate-950 min-h-[320px] sm:min-h-[440px] max-h-[72vh] overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col">
            {/* Embedded README Header Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-5 border-b border-slate-800 text-xs font-mono shrink-0">
              <div className="flex items-center gap-2 text-slate-300">
                <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold text-white truncate max-w-[200px] sm:max-w-none">
                  {githubInfo ? `${githubInfo.owner} / ${githubInfo.repo}` : title}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                  <GitBranch className="w-3 h-3 text-emerald-400" />
                  <span>main</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {readmeText && (
                  <button
                    type="button"
                    onClick={handleCopyReadme}
                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                    title="Salin isi README markdown"
                  >
                    {copiedReadme ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedReadme ? 'Disalin!' : 'Salin Markdown'}</span>
                  </button>
                )}

                {repoDirectUrl && (
                  <a
                    href={repoDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <span>Buka di GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Readme Content Rendered with MarkdownViewer */}
            {loadingReadme ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
                <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="font-mono text-xs">Menarik README asli dari repository GitHub...</p>
              </div>
            ) : (
              <div className="flex-1">
                <MarkdownViewer
                  content={readmeText}
                  repoUrl={repoDirectUrl}
                  githubRepo={githubInfo ? `${githubInfo.owner}/${githubInfo.repo}` : undefined}
                  branch="main"
                />
              </div>
            )}
          </div>
        )}

        {/* Modal Footer Info */}
        {(description || tags || proofUrl) && (
          <div className="p-3.5 sm:p-4 md:p-5 border-t border-slate-800 bg-slate-950/80 space-y-2.5 shrink-0">
            {description && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans line-clamp-2 sm:line-clamp-none">
                {description}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] sm:text-[11px] font-mono bg-slate-800/90 text-slate-300 rounded border border-slate-700"
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
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors ml-auto"
                >
                  <span>Lihat Source Code Repository</span>
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
