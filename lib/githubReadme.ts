/**
 * GitHub Repository & README Embedded Snapshot Generator
 * Provides parsing, metadata fetching, and automatic Base64 SVG screenshot generation
 * for project proofs without needing external screenshot services.
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

/**
 * Robust extractor for owner and repo name from various GitHub URL shapes:
 * - https://github.com/owner/repo
 * - https://github.com/owner/repo/tree/main
 * - https://github.com/owner/repo/blob/main/README.md
 * - owner/repo
 * - https://github.com/owner (defaults to primary kernel repo)
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  if (!url) return null;
  const cleanUrl = url.trim().replace(/\/$/, '');

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
 * Clean and truncate README markdown for excerpt display
 */
export function extractReadmeSummary(markdown: string): { title: string; summary: string; lines: string[] } {
  if (!markdown) {
    return { title: '', summary: '', lines: [] };
  }

  const rawLines = markdown.split('\n');
  let title = '';
  const lines: string[] = [];

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detect first H1 as title
    if (!title && trimmed.startsWith('# ')) {
      title = trimmed.replace(/^#\s+/, '').trim();
      continue;
    }

    // Skip badges / image links in summary
    if (trimmed.startsWith('[!') || trimmed.startsWith('![') || trimmed.startsWith('<img') || trimmed.startsWith('<div')) {
      continue;
    }

    // Collect clean readable lines
    const cleanLine = trimmed
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // remove links keep text
      .replace(/[*_`]/g, '') // strip markdown markers
      .replace(/^[-*+]\s+/, '• '); // convert bullets

    if (cleanLine.length > 0 && lines.length < 8) {
      lines.push(cleanLine.slice(0, 85));
    }
  }

  const summary = lines.slice(0, 3).join(' ');
  return { title, summary, lines };
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
 * Generates an aesthetic, crisp 16:9 Base64 SVG Data URI that acts as an authentic
 * GitHub README code-window screenshot for the project card.
 */
export function generateReadmeScreenshotSvg(data: {
  owner: string;
  repo: string;
  title?: string;
  description?: string;
  language?: string;
  stars?: number;
  readme?: string;
  tags?: string[];
}): string {
  const {
    owner,
    repo,
    title = repo,
    description = 'Android Kernel & Low-level System Engineering Module',
    language = 'C / C++',
    stars = 0,
    readme = '',
    tags = ['kernel', 'sm8150', 'vayu']
  } = data;

  const { title: readmeTitle, lines: readmeLines } = extractReadmeSummary(readme);
  const displayTitle = readmeTitle || title || repo;
  const safeTitle = escapeXml(displayTitle.slice(0, 48));
  const safeDesc = escapeXml((description || 'Repository kernel dan modul low-level POCO X3 Pro').slice(0, 140));
  const safeLang = escapeXml(language || 'C / Assembly');
  const safeOwner = escapeXml(owner);
  const safeRepo = escapeXml(repo);

  const dynamicLines = readmeLines.length > 0
    ? readmeLines.slice(0, 3)
    : [
        '# Verified Kernel: Qualcomm Snapdragon 860 (sm8150)',
        '# Integrated Features: ReSukiSU + SuSFS Stealth Mount + eBPF',
        '# Recovery Support: TWRP and OrangeFox Flashable Zip'
      ];

  // SVG representation formatted as a modern developer HUD / GitHub code window
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675" preserveAspectRatio="xMidYMid meet">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="60%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="accentGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#06b6d4" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
    </linearGradient>
    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" stroke-width="0.7" opacity="0.35"/>
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="675" fill="url(#bg)"/>
  <rect width="1200" height="675" fill="url(#grid)"/>

  <!-- Top Laser Accent -->
  <rect x="0" y="0" width="1200" height="3" fill="url(#accentGlow)"/>

  <!-- Code Window Outer Shell -->
  <rect x="60" y="45" width="1080" height="585" rx="16" fill="#0b1120" stroke="#1e293b" stroke-width="1.5"/>

  <!-- Window Header Bar -->
  <rect x="60" y="45" width="1080" height="54" rx="16" fill="#070c18"/>
  <rect x="60" y="83" width="1080" height="16" fill="#070c18"/>
  <line x1="60" y1="99" x2="1140" y2="99" stroke="#1e293b" stroke-width="1"/>

  <!-- Traffic Light Window Controls -->
  <circle cx="95" cy="72" r="6" fill="#ef4444"/>
  <circle cx="115" cy="72" r="6" fill="#f59e0b"/>
  <circle cx="135" cy="72" r="6" fill="#10b981"/>

  <!-- Browser / File Path Tab -->
  <rect x="170" y="58" width="480" height="28" rx="6" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
  <text x="185" y="77" fill="#94a3b8" font-family="monospace" font-size="12">github.com / ${safeOwner} / ${safeRepo} / README.md</text>

  <!-- Branch / Badge Indicators (Right Header) -->
  <rect x="940" y="58" width="80" height="26" rx="6" fill="#020617" stroke="#10b981" stroke-width="1" stroke-opacity="0.4"/>
  <text x="955" y="75" fill="#10b981" font-family="monospace" font-size="11" font-weight="bold">main</text>

  <rect x="1030" y="58" width="80" height="26" rx="6" fill="#020617" stroke="#334155" stroke-width="1"/>
  <text x="1045" y="75" fill="#e2e8f0" font-family="monospace" font-size="11">★ ${stars}</text>

  <!-- Inner Code / Document Area -->
  <g transform="translate(100, 140)">
    <!-- GitHub Repo Icon + Header -->
    <path d="M0 4 C0 1.8 1.8 0 4 0 L24 0 C26.2 0 28 1.8 28 4 L28 24 C28 26.2 26.2 28 24 28 L4 28 C1.8 28 0 26.2 0 24 Z" fill="#10b981" opacity="0.15"/>
    <path d="M14 6 C9.58 6 6 9.58 6 14 C6 17.53 8.29 20.53 11.47 21.59 C11.87 21.66 12.02 21.42 12.02 21.21 L12.02 19.86 C9.8 20.34 9.33 18.79 9.33 18.79 C8.97 17.87 8.45 17.62 8.45 17.62 C7.72 17.12 8.51 17.13 8.51 17.13 C9.32 17.19 9.74 17.96 9.74 17.96 C10.45 19.19 11.62 18.83 12.08 18.63 C12.15 18.11 12.36 17.76 12.59 17.56 C10.82 17.36 8.95 16.68 8.95 13.63 C8.95 12.76 9.26 12.06 9.77 11.5 C9.69 11.3 9.42 10.49 9.85 9.4 C9.85 9.4 10.52 9.18 12.05 10.21 C12.69 10.03 13.37 9.94 14.05 9.94 C14.73 9.94 15.41 10.03 16.05 10.21 C17.58 9.18 18.25 9.4 18.25 9.4 C18.68 10.49 18.41 11.3 18.33 11.5 C18.84 12.06 19.15 12.76 19.15 13.63 C19.15 16.69 17.27 17.36 15.5 17.55 C15.79 17.8 16.04 18.29 16.04 19.04 L16.04 21.21 C16.04 21.42 16.19 21.67 16.59 21.59 C19.77 20.52 22.05 17.53 22.05 14 C22.05 9.58 18.47 6 14 6 Z" fill="#10b981"/>

    <text x="38" y="20" fill="#64748b" font-family="monospace" font-size="14">${safeOwner} /</text>
    <text x="${38 + safeOwner.length * 8.5 + 16}" y="20" fill="#38bdf8" font-family="monospace" font-size="16" font-weight="bold">${safeRepo}</text>

    <!-- H1 Title -->
    <text x="0" y="70" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="800" letter-spacing="-0.5">${safeTitle}</text>

    <!-- Description Paragraph -->
    <text x="0" y="105" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="400">${safeDesc}</text>

    <!-- Tag Pills Strip -->
    <g transform="translate(0, 130)">
      <rect x="0" y="0" width="${safeLang.length * 9 + 20}" height="24" rx="12" fill="#042f2e" stroke="#10b981" stroke-width="1"/>
      <text x="10" y="16" fill="#34d399" font-family="monospace" font-size="11" font-weight="bold">${safeLang}</text>
      ${tags.slice(0, 4).map((tag, i) => {
        const offset = (safeLang.length * 9 + 30) + i * 110;
        const safeT = escapeXml(tag);
        return `<rect x="${offset}" y="0" width="${safeT.length * 8 + 18}" height="24" rx="12" fill="#0f172a" stroke="#334155" stroke-width="1"/>
        <text x="${offset + 9}" y="16" fill="#94a3b8" font-family="monospace" font-size="11">${safeT}</text>`;
      }).join('')}
    </g>

    <!-- Terminal Code Block Area (Excerpt from README) -->
    <g transform="translate(0, 180)">
      <rect x="0" y="0" width="1000" height="240" rx="10" fill="#050914" stroke="#1e293b" stroke-width="1"/>
      <line x1="0" y1="32" x2="1000" y2="32" stroke="#1e293b" stroke-width="1"/>
      <text x="16" y="21" fill="#64748b" font-family="monospace" font-size="11">TERMINAL // KERNEL COMPILATION &amp; SETUP</text>

      <!-- Terminal Lines -->
      <text x="20" y="65" fill="#10b981" font-family="monospace" font-size="13">$ git clone https://github.com/${safeOwner}/${safeRepo}.git</text>
      <text x="20" y="95" fill="#38bdf8" font-family="monospace" font-size="13">$ export ARCH=arm64 &amp;&amp; export SUBARCH=arm64</text>
      <text x="20" y="125" fill="#cbd5e1" font-family="monospace" font-size="13"># Target: Qualcomm Snapdragon 860 (sm8150 / vayu / bhima)</text>
      ${dynamicLines.map((line, idx) => `
      <text x="20" y="${155 + idx * 28}" fill="#94a3b8" font-family="monospace" font-size="12">${escapeXml(line)}</text>
      `).join('')}
    </g>
  </g>

  <!-- Watermark Bottom Right -->
  <text x="1115" y="610" text-anchor="end" fill="#334155" font-family="monospace" font-size="11" letter-spacing="1">POCO X3 PRO // 0xFAKFEKRILL EMBEDDED ENGINE</text>
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
