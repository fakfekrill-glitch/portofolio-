'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, ExternalLink, Hash, ChevronRight } from 'lucide-react';
import { parseGitHubUrl } from '@/lib/githubReadme';

interface MarkdownViewerProps {
  content: string;
  repoUrl?: string;
  githubRepo?: string;
  branch?: string;
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

interface TableItem {
  type: 'table';
  headers: string[];
  rows: string[][];
}

interface HtmlContainerItem {
  type: 'html-container';
  align: 'center' | 'left' | 'right';
  images: {
    src: string;
    alt?: string;
    width?: string;
    href?: string;
  }[];
  caption?: string;
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
  linkHref?: string;
}

type ParsedBlock =
  | CodeBlockItem
  | HeadingItem
  | ListItem
  | TableItem
  | HtmlContainerItem
  | QuoteItem
  | ParagraphItem
  | HrItem
  | ImageItem;

/**
 * Resolves relative repository image URLs to GitHub raw content URLs
 */
export function resolveAssetUrl(src: string, repo?: string, branch: string = 'main'): string {
  if (!src) return '';
  const trimmed = src.trim();

  // Already an absolute URL or data URI
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  if (!repo) return trimmed;
  const cleanPath = trimmed.replace(/^\.\//, '').replace(/^\//, '');
  return `https://raw.githubusercontent.com/${repo}/${branch}/${cleanPath}`;
}

export default function MarkdownViewer({
  content,
  repoUrl,
  githubRepo: propRepo,
  branch = 'main'
}: MarkdownViewerProps) {
  const [copiedSnippetIdx, setCopiedSnippetIdx] = useState<number | null>(null);

  // Extract repo identifier (owner/repo)
  const resolvedRepo =
    propRepo ||
    (repoUrl ? parseGitHubUrl(repoUrl)?.owner + '/' + parseGitHubUrl(repoUrl)?.repo : null) ||
    'fakfekrill-glitch/xiaomi_sm8150_kernel_e404_modified';

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
        // 1. H1 Title
        if (block.type === 'h1') {
          return (
            <div key={idx} className="pt-4 pb-2 border-b border-slate-800">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span className="w-2 h-6 sm:h-7 bg-emerald-500 rounded-sm shrink-0" />
                <span>{renderFormattedInline(block.text, resolvedRepo, branch)}</span>
              </h1>
            </div>
          );
        }

        // 2. H2 Subheading
        if (block.type === 'h2') {
          return (
            <div key={idx} className="pt-5 pb-1 border-b border-slate-800/80">
              <h2 className="text-lg sm:text-xl font-bold text-emerald-400 tracking-tight flex items-center gap-2">
                <Hash className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{renderFormattedInline(block.text, resolvedRepo, branch)}</span>
              </h2>
            </div>
          );
        }

        // 3. H3 Heading
        if (block.type === 'h3') {
          return (
            <h3 key={idx} className="text-base sm:text-lg font-bold text-slate-100 pt-3">
              {renderFormattedInline(block.text, resolvedRepo, branch)}
            </h3>
          );
        }

        // 4. H4 Heading
        if (block.type === 'h4') {
          return (
            <h4 key={idx} className="text-sm sm:text-base font-semibold text-slate-200 pt-2 font-mono">
              {renderFormattedInline(block.text, resolvedRepo, branch)}
            </h4>
          );
        }

        // 5. Horizontal Rule
        if (block.type === 'hr') {
          return <hr key={idx} className="border-slate-800 my-6" />;
        }

        // 6. Blockquote
        if (block.type === 'quote') {
          return (
            <blockquote
              key={idx}
              className="border-l-4 border-emerald-500 bg-slate-900/80 rounded-r-lg px-4 py-3 text-slate-300 italic text-xs sm:text-sm my-3 font-sans"
            >
              {renderFormattedInline(block.text, resolvedRepo, branch)}
            </blockquote>
          );
        }

        // 7. HTML Container (e.g. <div align="center"> <img ... /> </div>)
        if (block.type === 'html-container') {
          const alignClass =
            block.align === 'center'
              ? 'items-center text-center justify-center'
              : block.align === 'right'
              ? 'items-end text-right justify-end'
              : 'items-start text-left justify-start';

          return (
            <div key={idx} className={`my-6 flex flex-col ${alignClass} space-y-3 p-2 bg-slate-950/40 rounded-2xl border border-slate-800/60`}>
              {block.images.map((img, imgIdx) => {
                const resolvedSrc = resolveAssetUrl(img.src, resolvedRepo, branch);
                const widthStyle = img.width ? `${img.width}px` : undefined;

                const imgElement = (
                  <img
                    key={imgIdx}
                    src={resolvedSrc}
                    alt={img.alt || 'Documentation Proof'}
                    style={{ maxWidth: '100%', width: widthStyle }}
                    className="rounded-xl shadow-2xl border border-slate-800/80 object-contain transition-transform hover:scale-[1.01]"
                    loading="lazy"
                  />
                );

                if (img.href) {
                  return (
                    <a
                      key={imgIdx}
                      href={img.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block transition-transform hover:scale-105 active:scale-95"
                    >
                      {imgElement}
                    </a>
                  );
                }

                return imgElement;
              })}

              {block.caption && (
                <p className="text-xs text-slate-400 italic max-w-lg font-sans">
                  {renderFormattedInline(block.caption, resolvedRepo, branch)}
                </p>
              )}
            </div>
          );
        }

        // 8. Markdown Table
        if (block.type === 'table') {
          return (
            <div key={idx} className="my-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 shadow-md">
              <table className="min-w-full text-xs font-sans divide-y divide-slate-800">
                <thead className="bg-slate-900/90 text-slate-200 font-mono">
                  <tr>
                    {block.headers.map((h, hIdx) => (
                      <th
                        key={hIdx}
                        className="px-3.5 py-2.5 text-left font-bold border-r border-slate-800 last:border-r-0 whitespace-nowrap"
                      >
                        {renderFormattedInline(h, resolvedRepo, branch)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="px-3.5 py-2.5 border-r border-slate-800/60 last:border-r-0 align-top"
                        >
                          {renderFormattedInline(cell, resolvedRepo, branch)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // 9. List Items
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
                  <span className="flex-1">{renderFormattedInline(item, resolvedRepo, branch)}</span>
                </li>
              ))}
            </ul>
          );
        }

        // 10. Code Block
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
                      trimmed.startsWith('./compile') ||
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

        // 11. Standalone Image / Badge
        if (block.type === 'image') {
          const resolvedSrc = resolveAssetUrl(block.src, resolvedRepo, branch);
          const imgElem = (
            <img
              src={resolvedSrc}
              alt={block.alt}
              className="max-h-16 object-contain rounded inline-block"
              loading="lazy"
            />
          );

          if (block.linkHref) {
            return (
              <div key={idx} className="my-2 inline-block mr-2">
                <a
                  href={block.linkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-transform hover:scale-105"
                >
                  {imgElem}
                </a>
              </div>
            );
          }

          return (
            <div key={idx} className="my-2 inline-block mr-2">
              {imgElem}
            </div>
          );
        }

        // 12. General Paragraph
        return (
          <p key={idx} className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {renderFormattedInline(block.text, resolvedRepo, branch)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Parses raw markdown text into structured visual blocks
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

    // 2. HTML Containers (e.g. <div align="center"> ... </div> or <center> ... </center>)
    if (trimmed.startsWith('<div') || trimmed.startsWith('<center>')) {
      flushList();
      const htmlLines: string[] = [rawLine];
      let j = i + 1;
      let closed = trimmed.includes('</div>') || trimmed.includes('</center>');

      while (j < lines.length && !closed) {
        htmlLines.push(lines[j]);
        if (lines[j].includes('</div>') || lines[j].includes('</center>')) {
          closed = true;
          break;
        }
        j++;
      }

      i = j; // skip consumed lines
      const fullHtml = htmlLines.join('\n');

      const alignMatch = fullHtml.match(/align=[\"'](center|left|right)[\"']/i);
      const align = (alignMatch ? alignMatch[1].toLowerCase() : fullHtml.includes('<center>') ? 'center' : 'left') as 'center' | 'left' | 'right';

      // Extract all images inside the HTML block
      const images: { src: string; alt?: string; width?: string; href?: string }[] = [];
      const imgRegex = /<img\s+([^>]+?)\/?>/gi;
      let match: RegExpExecArray | null;

      while ((match = imgRegex.exec(fullHtml)) !== null) {
        const attrs = match[1];
        const src = attrs.match(/src=[\"']([^"']+)[\"']/i)?.[1];
        const alt = attrs.match(/alt=[\"']([^"']+)[\"']/i)?.[1];
        const width = attrs.match(/width=[\"']?(\d+)[\"']?/i)?.[1];

        if (src) {
          // Check if wrapped in anchor tag
          const imgIdx = match.index;
          const beforeImg = fullHtml.slice(0, imgIdx);
          const lastA = beforeImg.lastIndexOf('<a ');
          const lastCloseA = beforeImg.lastIndexOf('</a>');
          let href: string | undefined;

          if (lastA !== -1 && lastA > lastCloseA) {
            const aTag = fullHtml.slice(lastA, fullHtml.indexOf('>', lastA));
            href = aTag.match(/href=[\"']([^"']+)[\"']/i)?.[1];
          }

          images.push({ src, alt, width, href });
        }
      }

      // Extract caption/text
      const caption = fullHtml
        .replace(/<div[^>]*>|<\/div>|<center>|<\/center>/gi, '')
        .replace(/<img[^>]*\/?>/gi, '')
        .replace(/<a[^>]*>|<\/a>/gi, '')
        .replace(/<br\s*\/?>/gi, '')
        .replace(/<p[^>]*>|<\/p>/gi, '')
        .replace(/<i[^>]*>|<\/i>/gi, '')
        .trim();

      blocks.push({
        type: 'html-container',
        align,
        images,
        caption: caption || undefined
      });
      continue;
    }

    // 3. Markdown Tables (| Col 1 | Col 2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && i + 1 < lines.length) {
      const nextTrimmed = lines[i + 1].trim();
      if (nextTrimmed.startsWith('|') && nextTrimmed.includes('---')) {
        flushList();
        const headers = trimmed.slice(1, -1).split('|').map((c) => c.trim());
        const rows: string[][] = [];

        i += 2; // skip header and separator
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          const cells = lines[i].trim().slice(1, -1).split('|').map((c) => c.trim());
          rows.push(cells);
          i++;
        }
        i--; // back one line because outer loop increments

        blocks.push({
          type: 'table',
          headers,
          rows
        });
        continue;
      }
    }

    // Empty line resets active list
    if (!trimmed) {
      flushList();
      continue;
    }

    // 4. Horizontal Rule (---, ***, ___)
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
      flushList();
      blocks.push({ type: 'hr' });
      continue;
    }

    // 5. Headings (#, ##, ###, ####)
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

    // 6. Blockquotes (> ...)
    if (trimmed.startsWith('> ')) {
      flushList();
      blocks.push({ type: 'quote', text: trimmed.replace(/^>\s+/, '') });
      continue;
    }

    // 7. Unordered List Items (- , * , + )
    const bulletMatch = trimmed.match(/^[-*+]\s+(.*)$/);
    if (bulletMatch) {
      if (!currentList || currentList.ordered) {
        flushList();
        currentList = { ordered: false, items: [] };
      }
      currentList.items.push(bulletMatch[1]);
      continue;
    }

    // 8. Ordered List Items (1. , 2. )
    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      if (!currentList || !currentList.ordered) {
        flushList();
        currentList = { ordered: true, items: [] };
      }
      currentList.items.push(orderedMatch[1]);
      continue;
    }

    // 9. Linked Markdown Image: [![alt](src)](href)
    const linkedImgMatch = trimmed.match(/^\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)$/);
    if (linkedImgMatch) {
      flushList();
      blocks.push({
        type: 'image',
        alt: linkedImgMatch[1] || 'Badge',
        src: linkedImgMatch[2],
        linkHref: linkedImgMatch[3]
      });
      continue;
    }

    // 10. Standalone Markdown Image / Badge row: ![alt](url)
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

    // 11. Standalone raw <img> tag: <img src="..." alt="..." />
    const rawImgMatch = trimmed.match(/^<img\s+([^>]+?)\/?>$/i);
    if (rawImgMatch) {
      flushList();
      const attrs = rawImgMatch[1];
      const src = attrs.match(/src=[\"']([^"']+)[\"']/i)?.[1];
      const alt = attrs.match(/alt=[\"']([^"']+)[\"']/i)?.[1];
      const width = attrs.match(/width=[\"']?(\d+)[\"']?/i)?.[1];

      if (src) {
        blocks.push({
          type: 'html-container',
          align: 'center',
          images: [{ src, alt, width }]
        });
        continue;
      }
    }

    // 12. Regular Paragraph text
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
 * Formats inline elements: `code`, **bold**, *italic*, [links](url), [![img](src)](href), and raw HTML tags
 */
function renderFormattedInline(text: string, repo?: string, branch: string = 'main'): React.ReactNode {
  if (!text) return null;

  // Split tokens for linked images, markdown images, inline code, links, bold, italic, and HTML tags
  const tokenRegex = /(\[!\[[^\]]*\]\([^)]+\)\]\([^)]+\)|!\[[^\]]*\]\([^)]+\)|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|<img[^>]*\/?>|<a\s+[^>]+>|<\/a>|<br\s*\/?>|<[^>]+>)/gi;
  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (!part) return null;

    // 1. Linked Markdown Image: [![alt](src)](href)
    const linkedImgMatch = part.match(/^\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)$/);
    if (linkedImgMatch) {
      const alt = linkedImgMatch[1];
      const src = resolveAssetUrl(linkedImgMatch[2], repo, branch);
      const href = linkedImgMatch[3];

      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mx-1 my-0.5 align-middle transition-transform hover:scale-105"
        >
          <img src={src} alt={alt} className="max-h-7 inline-block rounded" loading="lazy" />
        </a>
      );
    }

    // 2. Markdown Image: ![alt](src)
    const imgMatch = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      const alt = imgMatch[1];
      const src = resolveAssetUrl(imgMatch[2], repo, branch);
      return (
        <img
          key={i}
          src={src}
          alt={alt}
          className="max-h-7 inline-block mx-1 my-0.5 align-middle rounded"
          loading="lazy"
        />
      );
    }

    // 3. Raw HTML Image Tag: <img src="..." alt="..." width="..." />
    if (part.toLowerCase().startsWith('<img')) {
      const srcMatch = part.match(/src=[\"']([^"']+)[\"']/i);
      const altMatch = part.match(/alt=[\"']([^"']+)[\"']/i);
      const widthMatch = part.match(/width=[\"']?(\d+)[\"']?/i);

      if (srcMatch) {
        const resolvedSrc = resolveAssetUrl(srcMatch[1], repo, branch);
        const alt = altMatch ? altMatch[1] : 'Image';
        const widthStyle = widthMatch ? `${widthMatch[1]}px` : undefined;

        return (
          <img
            key={i}
            src={resolvedSrc}
            alt={alt}
            style={{ maxWidth: '100%', width: widthStyle }}
            className="rounded-lg shadow-md inline-block my-1 align-middle"
            loading="lazy"
          />
        );
      }
      return null;
    }

    // 4. Raw HTML Break: <br> or <br/>
    if (/^<br\s*\/?>$/i.test(part)) {
      return <br key={i} />;
    }

    // 5. Raw HTML Closing Tags (strip)
    if (/^<\/(div|p|span|center|a|i|b|strong|em)>$/i.test(part)) {
      return null;
    }

    // 6. Raw HTML Opening Tags (strip or style)
    if (/^<(div|p|center)[^>]*>$/i.test(part)) {
      return null;
    }

    // 7. Inline Code: `code`
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

    // 8. Markdown Link: [text](url)
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

    // 9. Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={i} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // 10. Italic: *text*
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
