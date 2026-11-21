import { NextResponse } from 'next/server';

// Sliding-window IP rate limiter
const ipRequestHistory = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 4; // Max 4 messages per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipRequestHistory.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  validTimestamps.push(now);
  ipRequestHistory.set(ip, validTimestamps);
  return false;
}

export async function POST(req: Request) {
  try {
    // 1. Origin & Host verification (Anti-CSRF)
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');

    if (origin && host && !origin.includes(host) && !origin.includes('localhost')) {
      return NextResponse.json(
        { error: 'Akses Ditolak: Permintaan lintas domain (CSRF) dicegah.' },
        { status: 403 }
      );
    }

    // 2. IP Rate Limiting
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'unknown-ip';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan pesan. Harap tunggu 1 menit sebelum mencoba lagi.' },
        { status: 429 }
      );
    }

    // 3. Payload Parsing
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Payload tidak valid.' }, { status: 400 });
    }

    const { name, email, message, trap_website } = body;

    // 4. Honeypot check (Automated bot trap)
    if (trap_website) {
      // Silently accept bot requests without processing
      return NextResponse.json({ success: true, note: 'Filtered' });
    }

    // 5. Input validation & Sanitization
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Nama pengirim wajib diisi.' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Format email tidak valid.' }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json({ error: 'Pesan minimal 5 karakter.' }, { status: 400 });
    }

    // Length caps
    const cleanName = name.slice(0, 80).replace(/[<>]/g, '').trim();
    const cleanEmail = email.slice(0, 100).trim();
    const cleanMessage = message.slice(0, 2000).replace(/[<>]/g, '').trim();

    // 6. Forward to Discord Webhook if configured
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      const country = req.headers.get('x-vercel-ip-country') || 'ID';
      const city = req.headers.get('x-vercel-ip-city') || 'Indonesia';
      const userAgent = req.headers.get('user-agent') || 'Browser Client';

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'Kernel Dev Webhook',
          avatar_url: 'https://cdn-icons-png.flaticon.com/512/2092/2092663.png',
          embeds: [
            {
              title: '📬 Pesan Baru dari Portofolio Kernel Dalu',
              color: 1098497, // Emerald
              fields: [
                { name: '👤 Nama', value: cleanName, inline: true },
                { name: '📧 Email', value: cleanEmail, inline: true },
                { name: '💬 Pesan', value: cleanMessage, inline: false },
                { name: '🌐 Lokasi IP', value: `${city}, ${country} (\`${ip}\`)`, inline: true },
                { name: '🖥️ Info Klien', value: `\`${userAgent.substring(0, 80)}...\``, inline: false },
              ],
              footer: { text: 'Protected by Kernel Firewall & Anti-Spam' },
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      }).catch((err) => {
        console.warn('Webhook delivery notice:', err);
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Pesan Anda berhasil diterima dan diteruskan ke Dalu Raziq.'
    });
  } catch {
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem internal.' },
      { status: 500 }
    );
  }
}
