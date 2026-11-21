/**
 * GitHub Repository & README Embedded Snapshot Generator
 * Provides robust URL parsing, metadata extraction, and automatic Base64 SVG
 * screenshot generation that authentically captures the real README document.
 */

export interface GitHubRepoInfo {
  owner: string;
  repo: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  defaultBranch: string;
  topics: string[];
  readme: string;
  htmlUrl: string;
}

export interface ReadmeBlock {
  type: 'h1' | 'h2' | 'h3' | 'p' | 'code' | 'bullet' | 'number' | 'quote';
  text?: string;
  lang?: string;
  lines?: string[];
}

/**
 * Robust extractor for owner and repo name from various GitHub URL shapes:
 * - https://github.com/owner/repo
 * - https://github.com/owner/repo?tab=readme-ov-file
 * - https://github.com/owner/repo#readme
 * - https://github.com/owner/repo/tree/main
 * - https://github.com/owner/repo/blob/main/README.md
 * - owner/repo
 * - https://github.com/owner (defaults to primary kernel repo)
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  if (!url) return null;

  // Clean URL by removing query strings (?tab=readme-ov-file), hash fragments (#readme), and trailing slashes
  const cleanUrl = url
    .trim()
    .split('?')[0]
    .split('#')[0]
    .replace(/\/+$/, '');

  // 1. Standard repo URL with optional subpath: https://github.com/owner/repo/...
  const fullMatch = cleanUrl.match(/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/i);
  if (fullMatch) {
    return {
      owner: fullMatch[1],
      repo: fullMatch[2].replace(/\.git$/i, '')
    };
  }

  // 2. Short form: owner/repo
  const shortMatch = cleanUrl.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);
  if (shortMatch && !cleanUrl.includes('://')) {
    return {
      owner: shortMatch[1],
      repo: shortMatch[2].replace(/\.git$/i, '')
    };
  }

  // 3. User profile only: https://github.com/owner -> fallback to default kernel repository
  const profileMatch = cleanUrl.match(/github\.com\/([a-zA-Z0-9_.-]+)$/i);
  if (profileMatch) {
    return {
      owner: profileMatch[1],
      repo: 'xiaomi_sm8150_kernel_e404_modified'
    };
  }

  return null;
}

/**
 * Strips markdown symbols, links, and bold markers for plain text display
 */
export function cleanMarkdownText(str: string): string {
  if (!str) return '';
  return str
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // remove links keep text
    .replace(/[*_`]/g, '') // remove bold/italic/code markers
    .replace(/<[^>]*>/g, '') // remove html tags
    .trim();
}

/**
 * Word wraps text to a maximum line length
 */
export function wordWrap(text: string, maxLen = 88): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const w of words) {
    if (!current) {
      current = w;
    } else if ((current + ' ' + w).length <= maxLen) {
      current += ' ' + w;
    } else {
      lines.push(current);
      current = w;
    }
  }

  if (current) lines.push(current);
  return lines;
}

/**
 * Parses markdown into structured blocks for SVG rendering
 */
export function parseMarkdownBlocks(markdown: string): ReadmeBlock[] {
  if (!markdown) return [];

  const rawLines = markdown.split('\n');
  const blocks: ReadmeBlock[] = [];

  let inCode = false;
  let codeLang = '';
  let codeLines: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const rawLine = rawLines[i];
    const trimmed = rawLine.trim();

    // Fenced Code Block
    if (trimmed.startsWith('```')) {
      if (inCode) {
        blocks.push({ type: 'code', lang: codeLang, lines: codeLines });
        inCode = false;
        codeLang = '';
        codeLines = [];
      } else {
        inCode = true;
        codeLang = trimmed.replace(/^```/, '').trim() || 'sh';
        codeLines = [];
      }
      continue;
    }

    if (inCode) {
      codeLines.push(rawLine);
      continue;
    }

    if (!trimmed) continue;

    // Skip standalone badges or image links
    if (
      trimmed.startsWith('[!') ||
      trimmed.startsWith('![') ||
      trimmed.startsWith('<img') ||
      trimmed.startsWith('<div') ||
      trimmed.startsWith('<p')
    ) {
      continue;
    }

    // Headings
    if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'h1', text: cleanMarkdownText(trimmed.replace(/^#\s+/, '')) });
    } else if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', text: cleanMarkdownText(trimmed.replace(/^##\s+/, '')) });
    } else if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', text: cleanMarkdownText(trimmed.replace(/^###\s+/, '')) });
    } else if (trimmed.startsWith('> ')) {
      blocks.push({ type: 'quote', text: cleanMarkdownText(trimmed.replace(/^>\s+/, '')) });
    } else if (/^[-*+]\s+/.test(trimmed)) {
      blocks.push({ type: 'bullet', text: cleanMarkdownText(trimmed.replace(/^[-*+]\s+/, '')) });
    } else if (/^\d+\.\s+/.test(trimmed)) {
      blocks.push({ type: 'number', text: cleanMarkdownText(trimmed.replace(/^\d+\.\s+/, '')) });
    } else {
      blocks.push({ type: 'p', text: cleanMarkdownText(trimmed) });
    }
  }

  if (inCode && codeLines.length > 0) {
    blocks.push({ type: 'code', lang: codeLang, lines: codeLines });
  }

  return blocks;
}

/**
 * Clean and extract summary metadata from markdown
 */
export function extractReadmeSummary(markdown: string): { title: string; summary: string; lines: string[] } {
  if (!markdown) {
    return { title: '', summary: '', lines: [] };
  }

  const blocks = parseMarkdownBlocks(markdown);
  let title = '';
  const textLines: string[] = [];

  for (const block of blocks) {
    if (!title && block.type === 'h1' && block.text) {
      title = block.text;
      continue;
    }

    if (block.text && textLines.length < 8) {
      textLines.push(block.text.slice(0, 90));
    }
  }

  const summary = textLines.slice(0, 3).join(' ');
  return { title, summary, lines: textLines };
}

/**
 * Convert SVG string to universal Base64 data URI supported by all browsers
 */
export function svgToBase64DataUrl(svgString: string): string {
  if (typeof window !== 'undefined') {
    try {
      const encoded = btoa(unescape(encodeURIComponent(svgString)));
      return `data:image/svg+xml;base64,${encoded}`;
    } catch {
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
    }
  } else {
    try {
      const buffer = Buffer.from(svgString, 'utf-8');
      return `data:image/svg+xml;base64,${buffer.toString('base64')}`;
    } catch {
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
    }
  }
}

/**
 * Generates an authentic, high-resolution 1200x720 Base64 SVG Data URI that acts as
 * a genuine GitHub README document screenshot for the project card and lightbox viewer.
 */
export function generateReadmeScreenshotSvg(data: {
  owner: string;
  repo: string;
  title?: string;
  description?: string;
  language?: string;
  stars?: number;
  branch?: string;
  readme?: string;
  tags?: string[];
}): string {
  const {
    owner,
    repo,
    title = repo,
    description = '',
    language = 'TypeScript',
    stars = 0,
    branch = 'main',
    readme = ''
  } = data;

  const safeOwner = escapeXml(owner);
  const safeRepo = escapeXml(repo);
  const safeLang = escapeXml(language || 'Code');
  const safeBranch = escapeXml(branch || 'main');

  // Parse authentic README content into structured blocks
  const blocks = parseMarkdownBlocks(readme);

  // If no blocks were found (empty readme or fetch failed), create a clean default template
  if (blocks.length === 0) {
    blocks.push({
      type: 'h1',
      text: title || repo.replace(/[-_]/g, ' ').toUpperCase()
    });
    if (description) {
      blocks.push({ type: 'p', text: description });
    }
    blocks.push({ type: 'h2', text: 'Overview & Target Specifications' });
    blocks.push({
      type: 'p',
      text: `Repository resmi ${safeOwner}/${safeRepo} untuk pengembangan sistem Android dan low-level engineering device POCO X3 Pro.`
    });
    blocks.push({
      type: 'code',
      lang: 'bash',
      lines: [
        `git clone https://github.com/${safeOwner}/${safeRepo}.git`,
        `cd ${safeRepo}`,
        `# Verified deployment on Qualcomm Snapdragon 860 (sm8150)`
      ]
    });
  }

  // Count total raw lines for the GitHub file strip
  const totalLines = readme ? readme.split('\n').length : blocks.length * 4;

  // Render SVG elements dynamically from parsed blocks
  let curY = 150;
  const maxY = 620;
  const docElements: string[] = [];

  // Check if first block is an H1. If not, render repo title header
  const hasH1 = blocks.some((b) => b.type === 'h1');
  if (!hasH1) {
    docElements.push(
      `<text x="75" y="${curY}" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="800" letter-spacing="-0.5">${escapeXml(title || repo)}</text>`
    );
    docElements.push(
      `<line x1="75" y1="${curY + 10}" x2="1115" y2="${curY + 10}" stroke="#21262d" stroke-width="1"/>`
    );
    curY += 38;
  }

  for (const block of blocks) {
    if (curY >= maxY) break;

    // H1 Heading
    if (block.type === 'h1' && block.text) {
      docElements.push(
        `<text x="75" y="${curY}" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="800" letter-spacing="-0.5">${escapeXml(block.text.slice(0, 75))}</text>`
      );
      docElements.push(
        `<line x1="75" y1="${curY + 8}" x2="1115" y2="${curY + 8}" stroke="#21262d" stroke-width="1"/>`
      );
      curY += 36;
      continue;
    }

    // H2 Subheading
    if (block.type === 'h2' && block.text) {
      curY += 8;
      docElements.push(
        `<text x="75" y="${curY}" fill="#58a6ff" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700">${escapeXml(block.text.slice(0, 85))}</text>`
      );
      docElements.push(
        `<line x1="75" y1="${curY + 6}" x2="1115" y2="${curY + 6}" stroke="#21262d" stroke-width="0.8"/>`
      );
      curY += 28;
      continue;
    }

    // H3 Sub-subheading
    if (block.type === 'h3' && block.text) {
      curY += 6;
      docElements.push(
        `<text x="75" y="${curY}" fill="#e6edf3" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600">${escapeXml(block.text.slice(0, 90))}</text>`
      );
      curY += 24;
      continue;
    }

    // Paragraph
    if (block.type === 'p' && block.text) {
      const wrapped = wordWrap(block.text, 92);
      for (const wline of wrapped) {
        if (curY >= maxY) break;
        docElements.push(
          `<text x="75" y="${curY}" fill="#c9d1d9" font-family="system-ui, -apple-system, sans-serif" font-size="12.5" font-weight="400">${escapeXml(wline)}</text>`
        );
        curY += 19;
      }
      curY += 6;
      continue;
    }

    // Fenced Code Block
    if (block.type === 'code' && block.lines) {
      const displayLines = block.lines.slice(0, 7);
      const boxH = 26 + displayLines.length * 19;

      docElements.push(
        `<rect x="75" y="${curY}" width="1035" height="${boxH}" rx="6" fill="#161b22" stroke="#30363d" stroke-width="1"/>`
      );
      // Lang badge
      docElements.push(
        `<rect x="1035" y="${curY + 4}" width="65" height="17" rx="4" fill="#21262d"/>`
      );
      docElements.push(
        `<text x="1067" y="${curY + 16}" text-anchor="middle" fill="#8b949e" font-family="monospace" font-size="10">${escapeXml(block.lang || 'code')}</text>`
      );

      displayLines.forEach((cline, cidx) => {
        const codeY = curY + 22 + cidx * 19;
        const trimmedCode = cline.trim();
        const isComment = trimmedCode.startsWith('#') || trimmedCode.startsWith('//');
        const isCmd =
          trimmedCode.startsWith('$') ||
          trimmedCode.startsWith('npm') ||
          trimmedCode.startsWith('yarn') ||
          trimmedCode.startsWith('pnpm') ||
          trimmedCode.startsWith('git') ||
          trimmedCode.startsWith('make') ||
          trimmedCode.startsWith('export');

        const textColor = isComment ? '#8b949e' : isCmd ? '#7ee787' : '#a5d6ff';
        docElements.push(
          `<text x="92" y="${codeY}" fill="${textColor}" font-family="monospace" font-size="12">${escapeXml(cline.slice(0, 95))}</text>`
        );
      });

      curY += boxH + 14;
      continue;
    }

    // Unordered Bullet List Item
    if (block.type === 'bullet' && block.text) {
      docElements.push(`<circle cx="82" cy="${curY - 4}" r="2.5" fill="#38bdf8"/>`);
      docElements.push(
        `<text x="94" y="${curY}" fill="#c9d1d9" font-family="system-ui, -apple-system, sans-serif" font-size="12.5">${escapeXml(block.text.slice(0, 90))}</text>`
      );
      curY += 21;
      continue;
    }

    // Numbered List Item
    if (block.type === 'number' && block.text) {
      docElements.push(
        `<text x="78" y="${curY}" fill="#10b981" font-family="monospace" font-size="12" font-weight="bold">#</text>`
      );
      docElements.push(
        `<text x="94" y="${curY}" fill="#c9d1d9" font-family="system-ui, -apple-system, sans-serif" font-size="12.5">${escapeXml(block.text.slice(0, 90))}</text>`
      );
      curY += 21;
      continue;
    }

    // Blockquote
    if (block.type === 'quote' && block.text) {
      docElements.push(
        `<line x1="77" y1="${curY - 12}" x2="77" y2="${curY + 4}" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>`
      );
      docElements.push(
        `<text x="88" y="${curY}" fill="#8b949e" font-family="system-ui, -apple-system, sans-serif" font-size="12.5" font-style="italic">${escapeXml(block.text.slice(0, 88))}</text>`
      );
      curY += 22;
      continue;
    }
  }

  // Construct complete 1200x720 SVG GitHub README Snapshot
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" width="1200" height="720" preserveAspectRatio="xMidYMid meet">
  <defs>
    <linearGradient id="bgGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="50%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>
    <linearGradient id="laserBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#06b6d4" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="bottomFade" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0d1117" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0d1117" stop-opacity="0.95"/>
    </linearGradient>
    <pattern id="dotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="12" cy="12" r="0.75" fill="#334155" opacity="0.35"/>
    </pattern>
  </defs>

  <!-- Outer Background -->
  <rect width="1200" height="720" fill="url(#bgGlow)"/>
  <rect width="1200" height="720" fill="url(#dotGrid)"/>

  <!-- Top Laser Accent -->
  <rect x="0" y="0" width="1200" height="3" fill="url(#laserBar)"/>

  <!-- Code Window Outer Shell -->
  <rect x="45" y="30" width="1110" height="655" rx="12" fill="#0d1117" stroke="#30363d" stroke-width="1.5"/>

  <!-- Window Header Bar -->
  <path d="M 45 42 Q 45 30 57 30 L 1143 30 Q 1155 30 1155 42 L 1155 76 L 45 76 Z" fill="#070c18"/>
  <line x1="45" y1="76" x2="1155" y2="76" stroke="#30363d" stroke-width="1"/>

  <!-- Traffic Light Window Controls -->
  <circle cx="75" cy="53" r="6" fill="#ff5f56"/>
  <circle cx="95" cy="53" r="6" fill="#ffbd2e"/>
  <circle cx="115" cy="53" r="6" fill="#27c93f"/>

  <!-- Browser / File Path Tab -->
  <rect x="145" y="40" width="520" height="26" rx="6" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
  <text x="160" y="57" fill="#94a3b8" font-family="monospace" font-size="11.5">github.com / ${safeOwner} / ${safeRepo} / README.md</text>

  <!-- Language Badge (Right Header) -->
  <rect x="795" y="40" width="105" height="26" rx="6" fill="#020617" stroke="#334155" stroke-width="1"/>
  <text x="810" y="57" fill="#38bdf8" font-family="monospace" font-size="11">${safeLang}</text>

  <!-- Branch Badge (Right Header) -->
  <rect x="910" y="40" width="105" height="26" rx="6" fill="#020617" stroke="#10b981" stroke-width="1" stroke-opacity="0.5"/>
  <circle cx="925" cy="53" r="3.5" fill="#10b981"/>
  <text x="935" y="57" fill="#34d399" font-family="monospace" font-size="11" font-weight="bold">${safeBranch}</text>

  <!-- Stars Badge -->
  <rect x="1025" y="40" width="85" height="26" rx="6" fill="#020617" stroke="#334155" stroke-width="1"/>
  <text x="1040" y="57" fill="#e2e8f0" font-family="monospace" font-size="11">★ ${stars}</text>

  <!-- GitHub README Subheader Strip -->
  <rect x="45" y="77" width="1110" height="40" fill="#161b22"/>
  <line x1="45" y1="117" x2="1155" y2="117" stroke="#30363d" stroke-width="1"/>

  <!-- Document Icon + Filename -->
  <path d="M 72 90 L 80 90 L 84 94 L 84 104 L 72 104 Z" fill="none" stroke="#7ee787" stroke-width="1.5"/>
  <text x="92" y="99" fill="#f0f6fc" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="bold">README.md</text>
  <text x="180" y="99" fill="#8b949e" font-family="system-ui, -apple-system, sans-serif" font-size="11.5">• ${totalLines} baris • Markdown</text>

  <!-- Preview Tab Indicator (Right of Subheader) -->
  <rect x="1010" y="84" width="75" height="24" rx="5" fill="#21262d" stroke="#10b981" stroke-width="1"/>
  <text x="1026" y="100" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="bold">Preview</text>
  <rect x="1092" y="84" width="50" height="24" rx="5" fill="#161b22"/>
  <text x="1106" y="100" fill="#8b949e" font-family="system-ui, -apple-system, sans-serif" font-size="11">Code</text>

  <!-- Document Body Rendered Elements -->
  <g id="readmeContent">
    ${docElements.join('\n    ')}
  </g>

  <!-- Bottom Gradient Fade for Authentic Multi-Page Appearance -->
  <rect x="46" y="570" width="1108" height="114" fill="url(#bottomFade)" rx="10" pointer-events="none"/>

  <!-- Scrollbar Track & Thumb Simulation (Right Side) -->
  <rect x="1142" y="125" width="4" height="520" rx="2" fill="#161b22"/>
  <rect x="1142" y="145" width="4" height="120" rx="2" fill="#30363d"/>

  <!-- Footer Watermark Bar -->
  <line x1="45" y1="655" x2="1155" y2="655" stroke="#1e293b" stroke-width="1"/>
  <text x="65" y="673" fill="#10b981" font-family="monospace" font-size="10.5" font-weight="bold">⚡ AUTHENTIC GITHUB README EMBEDDED</text>
  <text x="1135" y="673" text-anchor="end" fill="#64748b" font-family="monospace" font-size="10">POCO X3 PRO // 0xFAKFEKRILL REPO ENGINE</text>
</svg>`;

  return svgToBase64DataUrl(svg);
}

function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
