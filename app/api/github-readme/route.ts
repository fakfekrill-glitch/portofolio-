import { NextResponse } from 'next/server';
import { parseGitHubUrl, generateReadmeScreenshotSvg, GitHubRepoInfo } from '@/lib/githubReadme';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ success: false, error: 'Parameter url wajib diisi' }, { status: 400 });
  }

  const parsed = parseGitHubUrl(targetUrl);
  if (!parsed) {
    return NextResponse.json(
      { success: false, error: 'URL GitHub tidak valid. Contoh: https://github.com/owner/repo' },
      { status: 400 }
    );
  }

  const { owner, repo } = parsed;

  try {
    let repoData: Partial<GitHubRepoInfo> = {
      owner,
      repo,
      fullName: `${owner}/${repo}`,
      htmlUrl: `https://github.com/${owner}/${repo}`,
      description: '',
      stars: 0,
      forks: 0,
      language: 'C',
      defaultBranch: 'main',
      topics: [],
      readme: ''
    };

    // 1. Fetch Repository Metadata from GitHub API
    try {
      const apiRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          'User-Agent': 'fakfekrill-portfolio-bot/1.0',
          Accept: 'application/vnd.github.v3+json'
        },
        next: { revalidate: 3600 } // cache for 1 hour on Vercel Edge
      });

      if (apiRes.ok) {
        const json = await apiRes.json();
        repoData = {
          ...repoData,
          description: json.description || '',
          stars: json.stargazers_count || 0,
          forks: json.forks_count || 0,
          language: json.language || 'C',
          defaultBranch: json.default_branch || 'main',
          topics: json.topics || []
        };
      }
    } catch {
      // API call failed or rate-limited; will proceed with fallback
    }

    // 2. Fetch README Content (Try raw usercontent first to bypass rate limits)
    let readmeText = '';
    const branchesToTry = [repoData.defaultBranch || 'main', 'main', 'master'];

    for (const b of branchesToTry) {
      try {
        const rawRes = await fetch(
          `https://raw.githubusercontent.com/${owner}/${repo}/${b}/README.md`,
          {
            headers: { 'User-Agent': 'fakfekrill-portfolio-bot/1.0' },
            next: { revalidate: 3600 }
          }
        );
        if (rawRes.ok) {
          readmeText = await rawRes.text();
          break;
        }
      } catch {
        continue;
      }
    }

    // If raw markdown not found, try API readme
    if (!readmeText) {
      try {
        const apiReadmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
          headers: {
            'User-Agent': 'fakfekrill-portfolio-bot/1.0',
            Accept: 'application/vnd.github.v3.raw'
          }
        });
        if (apiReadmeRes.ok) {
          readmeText = await apiReadmeRes.text();
        }
      } catch {
        // Ignored
      }
    }

    repoData.readme = readmeText;

    // 3. Generate High-Res SVG Screenshot
    const screenshotSvg = generateReadmeScreenshotSvg({
      owner,
      repo,
      title: repoData.description ? `${repo} — ${repoData.description.slice(0, 32)}` : repo,
      description: repoData.description || 'Android Kernel Module & Low-Level System Engineering',
      language: repoData.language || 'C / C++',
      stars: repoData.stars || 0,
      readme: readmeText,
      tags: repoData.topics && repoData.topics.length > 0 ? repoData.topics : ['sm8150', 'vayu', 'kernel']
    });

    return NextResponse.json({
      success: true,
      data: {
        ...repoData,
        screenshotSvg
      }
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Gagal mengambil data repository GitHub';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
