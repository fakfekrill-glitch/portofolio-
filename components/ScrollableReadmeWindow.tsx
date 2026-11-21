'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, GitBranch, Maximize2, ExternalLink, FileText } from 'lucide-react';
import MarkdownViewer from '@/components/MarkdownViewer';
import { parseGitHubUrl } from '@/lib/githubReadme';

interface ScrollableReadmeWindowProps {
  owner?: string;
  repo?: string;
  proofUrl?: string;
  githubRepo?: string;
  initialContent?: string;
  maxHeight?: string;
  showExpandButton?: boolean;
  onExpand?: () => void;
  className?: string;
}

export default function ScrollableReadmeWindow({
  owner: propOwner,
  repo: propRepo,
  proofUrl,
  githubRepo,
  initialContent = '',
  maxHeight = 'max-h-[220px]',
  showExpandButton = false,
  onExpand,
  className = ''
}: ScrollableReadmeWindowProps) {
  const [content, setContent] = useState<string>(initialContent);
  const [loading, setLoading] = useState<boolean>(!initialContent);

  // Extract owner and repo from various inputs
  const parsed =
    (propOwner && propRepo ? { owner: propOwner, repo: propRepo } : null) ||
    (githubRepo ? parseGitHubUrl(`github.com/${githubRepo}`) : null) ||
    (proofUrl ? parseGitHubUrl(proofUrl) : null) || {
      owner: 'fakfekrill-glitch',
      repo: 'portofolio-'
    };

  const { owner, repo } = parsed;

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
      setLoading(false);
      return;
    }

    let isSubscribed = true;
    setLoading(true);

    const fetchReadme = async () => {
      try {
        // 1. Try local API
        const res = await fetch(`/api/github-readme?url=${encodeURIComponent(`https://github.com/${owner}/${repo}`)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.readme && isSubscribed) {
            setContent(json.data.readme);
            setLoading(false);
            return;
          }
        }

        // 2. Fallback to raw usercontent
        for (const branch of ['main', 'master', 'HEAD', 'dev']) {
          try {
            const raw = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`);
            if (raw.ok) {
              const text = await raw.text();
              if (isSubscribed) {
                setContent(text);
                setLoading(false);
                return;
              }
            }
          } catch {
            continue;
          }
        }

        if (isSubscribed) {
          setContent(`# ${repo}\n\nDokumentasi modul kernel & repositori GitHub POCO X3 Pro.`);
        }
      } catch {
        if (isSubscribed) {
          setContent(`# ${repo}\n\nREADME sedang disinkronkan dengan GitHub.`);
        }
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };

    fetchReadme();

    return () => {
      isSubscribed = false;
    };
  }, [owner, repo, initialContent]);

  const repoDirectUrl = `https://github.com/${owner}/${repo}`;
  const lineCount = content ? content.split('\n').length : 0;

  return (
    <div
      className={`rounded-xl border border-slate-800 bg-[#0d1117] overflow-hidden flex flex-col shadow-xl select-text ${className}`}
      onClick={(e) => {
        // Prevent accidental card click when user is interacting with text/scroll inside the README
        e.stopPropagation();
      }}
    >
      {/* Dev Window Header (macOS / GitHub style) */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#070c18] border-b border-[#30363d] text-xs font-mono shrink-0 select-none">
        {/* Window controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>

        {/* Path breadcrumbs */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs px-2">
          <Terminal className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="truncate">{owner}/{repo}/README.md</span>
        </div>

        {/* Actions / Branch */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-emerald-400 border border-emerald-500/30">
            <GitBranch className="w-2.5 h-2.5" />
            <span>main</span>
          </span>

          {showExpandButton && onExpand && (
            <button
              type="button"
              onClick={onExpand}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Buka README ukuran penuh"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}

          <a
            href={repoDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
            title="Kunjungi repository di GitHub"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* GitHub Document Header Strip */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#161b22] border-b border-[#30363d] text-[11px] font-mono text-slate-400 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-white font-bold">README.md</span>
          <span className="text-slate-500">• {lineCount} baris</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-semibold border border-slate-700">
            Live Scrollable
          </span>
        </div>
      </div>

      {/* Live Scrollable Markdown Content */}
      <div
        className={`flex-1 overflow-y-auto p-3.5 sm:p-4 text-xs font-sans leading-relaxed text-slate-300 ${maxHeight} scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent hover:scrollbar-thumb-emerald-500/40`}
      >
        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-2 text-slate-500 font-mono text-xs">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span>Memuat live README dari GitHub...</span>
          </div>
        ) : (
          <MarkdownViewer content={content} repoUrl={repoDirectUrl} />
        )}
      </div>

      {/* Bottom status bar */}
      <div className="px-3 py-1 bg-[#090d16] border-t border-[#1e293b] flex items-center justify-between text-[10px] font-mono text-slate-500 shrink-0 select-none">
        <span className="flex items-center gap-1 text-emerald-400/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Bisa di-scroll langsung</span>
        </span>
        <span className="hidden sm:inline">POCO X3 Pro • SM8150</span>
      </div>
    </div>
  );
}
