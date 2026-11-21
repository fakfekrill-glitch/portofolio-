'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, ExternalLink, Hash, ChevronRight } from 'lucide-react';

interface MarkdownViewerProps {
  content: string;
  repoUrl?: string;
}

interface CodeBlockItem {
  type: 'code';
  lang: string;
  code: string;
}

interface HeadingItem {
  type: 'h1' | 'h2' | 'h3' | 'h4';
  text: string;
}

interface ListItem {
  type: 'list';
  ordered: boolean;
  items: string[];
}

interface QuoteItem {
  type: 'quote';
  text: string;
}

interface ParagraphItem {
  type: 'p';
  text: string;
}

interface HrItem {
  type: 'hr';
}

interface ImageItem {
  type: 'image';
  alt: string;
  src: string;
}

type ParsedBlock =
  | CodeBlockItem
  | HeadingItem
  | ListItem
  | QuoteItem
  | ParagraphItem
  | HrItem
  | ImageItem;

export default function MarkdownViewer({ content, repoUrl }: MarkdownViewerProps) {
  const [copiedSnippetIdx, setCopiedSnippetIdx] = useState<number | null>(null);

  const handleCopySnippet = (code: string, idx: number) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(code);
      setCopiedSnippetIdx(idx);
      setTimeout(() => setCopiedSnippetIdx(null), 2000);
    }
  };

  if (!content || !content.trim()) {
    return (
      <div className="py-12 text-center text-slate-500 font-mono text-xs">
        <p>README kosong atau belum disediakan di repositori ini.</p>
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-400 hover:underline mt-2"
          >
            <span>Kunjungi Repositori di GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    );
  }

  // Parse markdown content into structured blocks
  const blocks = parseMarkdownToBlocks(content);

  return (
    <div className="markdown-body space-y-4 font-sans text-slate-200 text-sm leading-relaxed max-w-none">
      {blocks.map((block, idx) => {
        if (block.type === 'h1') {
          return (
            <div key={idx} className="pt-4 pb-2 border-b border-slate-800">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span className="w-2 h-6 sm:h-7 bg-emerald-500 rounded-sm shrink-0" />
                <span>{renderFormattedInline(block.text)}</span>
              </h1>
            </div>
          );
        }

        if (block.type === 'h2') {
          return (
            <div key={idx} className="pt-5 pb-1 border-b border-slate-800/80">
              <h2 className="text-lg sm:text-xl font-bold text-emerald-400 tracking-tight flex items-center gap-2">
                <Hash className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{renderFormattedInline(block.text)}</span>
              </h2>
            </div>
          );
        }

        if (block.type === 'h3') {
          return (
            <h3 key={idx} className="text-base sm:text-lg font-bold text-slate-100 pt-3">
              {renderFormattedInline(block.text)}
            </h3>
          );
        }

        if (block.type === 'h4') {
          return (
            <h4 key={idx} className="text-sm sm:text-base font-semibold text-slate-200 pt-2 font-mono">
              {renderFormattedInline(block.text)}
            </h4>
          );
        }

        if (block.type === 'hr') {
          return <hr key={idx} className="border-slate-800 my-6" />;
        }

        if (block.type === 'quote') {
          return (
            <blockquote
              key={idx}
              className="border-l-4 border-emerald-500 bg-slate-900/80 rounded-r-lg px-4 py-3 text-slate-300 italic text-xs sm:text-sm my-3 font-sans"
            >
              {renderFormattedInline(block.text)}
            </blockquote>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={idx} className="space-y-1.5 my-2 pl-1 sm:pl-2">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                  {block.ordered ? (
                    <span className="font-mono text-emerald-400 font-bold shrink-0 text-xs mt-0.5">
                      {itemIdx + 1}.
                    </span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <span className="flex-1">{renderFormattedInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'code') {
          const codeLines = block.code.split('\n');
          return (
            <div
              key={idx}
              className="my-3 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg font-mono text-xs"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-slate-300 uppercase tracking-wider">
                    {block.lang || 'BASH / CODE'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopySnippet(block.code, idx)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Salin kode"
                >
                  {copiedSnippetIdx === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-bold text-[10px]">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span className="text-[10px]">Salin</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code lines */}
              <div className="p-3.5 overflow-x-auto leading-relaxed text-slate-200">
                <pre className="font-mono text-[12px]">
                  {codeLines.map((line, lIdx) => {
                    const trimmed = line.trim();
                    const isComment = trimmed.startsWith('#') || trimmed.startsWith('//');
                    const isCmd =
                      trimmed.startsWith('$') ||
                      trimmed.startsWith('git') ||
                      trimmed.startsWith('npm') ||
                      trimmed.startsWith('yarn') ||
                      trimmed.startsWith('pnpm') ||
                      trimmed.startsWith('make') ||
                      trimmed.startsWith('export');

                    let lineClass = 'text-slate-300';
                    if (isComment) lineClass = 'text-slate-500 italic';
                    else if (isCmd) lineClass = 'text-emerald-400 font-bold';

                    return (
                      <div key={lIdx} className="table-row">
                        <span className="table-cell pr-4 select-none text-slate-600 text-right text-[11px]">
                          {lIdx + 1}
                        </span>
                        <span className={`table-cell ${lineClass}`}>{line || ' '}</span>
                      </div>
                    );
                  })}
                </pre>
              </div>
            </div>
          );
        }

        if (block.type === 'image') {
          return (
            <div key={idx} className="my-3 flex flex-wrap gap-2 items-center">
              <img
                src={block.src}
                alt={block.alt}
                className="max-h-12 object-contain rounded"
                loading="lazy"
              />
            </div>
          );
        }

        // Paragraph
        return (
          <p key={idx} className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {renderFormattedInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Parses raw markdown text into visual block elements
 */
function parseMarkdownToBlocks(markdown: string): ParsedBlock[] {
  const lines = markdown.split('\n');
  const blocks: ParsedBlock[] = [];

  let inCode = false;
  let codeLang = '';
  let codeBuffer: string[] = [];

  let currentList: { ordered: boolean; items: string[] } | null = null;

  const flushList = () => {
    if (currentList && currentList.items.length > 0) {
      blocks.push({
        type: 'list',
        ordered: currentList.ordered,
        items: [...currentList.items]
      });
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Code Block Fence (```)
    if (trimmed.startsWith('```')) {
      flushList();
      if (inCode) {
        blocks.push({
          type: 'code',
          lang: codeLang,
          code: codeBuffer.join('\n')
        });
        inCode = false;
        codeLang = '';
        codeBuffer = [];
      } else {
        inCode = true;
        codeLang = trimmed.replace(/^```/, '').trim() || 'sh';
        codeBuffer = [];
      }
      continue;
    }

    if (inCode) {
      codeBuffer.push(rawLine);
      continue;
    }

    // Empty line resets active list
    if (!trimmed) {
      flushList();
      continue;
    }

    // 2. Horizontal Rule (---, ***, ___)
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
      flushList();
      blocks.push({ type: 'hr' });
      continue;
    }

    // 3. Headings (#, ##, ###, ####)
    if (trimmed.startsWith('# ')) {
      flushList();
      blocks.push({ type: 'h1', text: trimmed.replace(/^#\s+/, '') });
      continue;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      blocks.push({ type: 'h2', text: trimmed.replace(/^##\s+/, '') });
      continue;
    }
    if (trimmed.startsWith('### ')) {
      flushList();
      blocks.push({ type: 'h3', text: trimmed.replace(/^###\s+/, '') });
      continue;
    }
    if (trimmed.startsWith('#### ')) {
      flushList();
      blocks.push({ type: 'h4', text: trimmed.replace(/^####\s+/, '') });
      continue;
    }

    // 4. Blockquotes (> ...)
    if (trimmed.startsWith('> ')) {
      flushList();
      blocks.push({ type: 'quote', text: trimmed.replace(/^>\s+/, '') });
      continue;
    }

    // 5. Unordered List Items (- , * , + )
    const bulletMatch = trimmed.match(/^[-*+]\s+(.*)$/);
    if (bulletMatch) {
      if (!currentList || currentList.ordered) {
        flushList();
        currentList = { ordered: false, items: [] };
      }
      currentList.items.push(bulletMatch[1]);
      continue;
    }

    // 6. Ordered List Items (1. , 2. )
    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      if (!currentList || !currentList.ordered) {
        flushList();
        currentList = { ordered: true, items: [] };
      }
      currentList.items.push(orderedMatch[1]);
      continue;
    }

    // 7. Standalone Markdown Image / Badge row: ![alt](url)
    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      flushList();
      blocks.push({
        type: 'image',
        alt: imageMatch[1] || 'Badge',
        src: imageMatch[2]
      });
      continue;
    }

    // 8. Regular Paragraph text
    flushList();
    blocks.push({ type: 'p', text: trimmed });
  }

  flushList();

  if (inCode && codeBuffer.length > 0) {
    blocks.push({
      type: 'code',
      lang: codeLang,
      code: codeBuffer.join('\n')
    });
  }

  return blocks;
}

/**
 * Formats inline elements: `code`, **bold**, *italic*, and [links](url)
 */
function renderFormattedInline(text: string): React.ReactNode {
  if (!text) return null;

  // Split tokens for inline code, links, bold, italic
  const tokenRegex = /(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (!part) return null;

    // Inline Code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      const codeVal = part.slice(1, -1);
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-800 text-emerald-300 font-mono text-[12px] border border-slate-700/60 font-semibold"
        >
          {codeVal}
        </code>
      );
    }

    // Markdown Link: [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];
      return (
        <a
          key={i}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 font-medium inline-flex items-center gap-0.5 mx-0.5"
        >
          <span>{linkText}</span>
          <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
      );
    }

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={i} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={i} className="italic text-slate-200">
          {part.slice(1, -1)}
        </em>
      );
    }

    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
