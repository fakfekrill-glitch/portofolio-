'use client';

import { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  title: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  proofUrl?: string;
}

export default function LightboxModal({
  isOpen,
  onClose,
  imageSrc,
  title,
  subtitle,
  description,
  tags,
  proofUrl
}: LightboxModalProps) {
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

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 sm:p-6 md:p-8 flex items-center justify-center cursor-pointer animate-fade-in"
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
          <button
            onClick={onClose}
            aria-label="Tutup pratinjau"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Image Display */}
        <div className="relative flex-1 bg-black/40 min-h-[300px] sm:min-h-[400px] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
          <img
            src={imageSrc}
            alt={title}
            className="max-h-[68vh] max-w-full object-contain rounded-lg shadow-md"
          />
        </div>

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
                  <span>Verifikasi Tautan Bukti</span>
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
