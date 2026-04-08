import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// --- VARIABEL UNTUK RATE LIMITING (ANTI-SPAM) ---
// Menyimpan IP dan waktu terakhir mereka mengirim pesan
const rateLimitMap = new Map<string, number>();

// --- FUNGSI GET: Untuk mengambil foto galeri ---
export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'public', 'projects');
    if (!fs.existsSync(dir)) return NextResponse.json([]);
    const filenames = fs.readdirSync(dir);
    const images = filenames.filter((file) => file.match(/\.(jpg|jpeg|png|gif|webp)$/i));
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json([]);
  }
}

// --- FUNGSI POST: Webhook Discord dengan Anti-Spam & Origin Check ---
export async function POST(req: Request) {
  try {
    // 🚨 SECURITY 1: ORIGIN CHECK 🚨
    // Blokir request jika tidak berasal dari domain/website-mu sendiri
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');
    
    // (Abaikan pengecekan origin jika sedang dijalankan di localhost untuk testing)
    if (origin && !origin.includes('localhost') && !origin.includes(host || '')) {
       console.warn(`[BLOCKED] Unauthorized API request from: ${origin}`);
       return NextResponse.json({ error: 'Akses Ditolak: Invalid Origin' }, { status: 403 });
    }

    // Mengambil IP Address pengunjung
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown IP';

    // 🚨 SECURITY 2: RATE LIMITING (ANTI-SPAM) 🚨
    // Batasi 1 pesan per 5 menit untuk setiap IP Address
    const now = Date.now();
    const cooldownPeriod = 5 * 60 * 1000; // 5 Menit dalam milidetik

    if (rateLimitMap.has(ipAddress)) {
      const lastRequestTime = rateLimitMap.get(ipAddress)!;
      if (now - lastRequestTime < cooldownPeriod) {
        const remainingTime = Math.ceil((cooldownPeriod - (now - lastRequestTime)) / 1000 / 60);
        return NextResponse.json({ 
          error: `Terlalu banyak request. Silakan coba lagi dalam ${remainingTime} menit.` 
        }, { status: 429 });
      }
    }
    // Catat waktu request IP ini
    rateLimitMap.set(ipAddress, now);

    // 1. Terima data dari Frontend
    const { name, email, message } = await req.json();

    // 🚨 SECURITY 3: DATA VALIDATION & SANITIZATION 🚨
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    // Batasi panjang karakter (mencegah payload raksasa yang bikin server lag)
    if (name.length > 50 || email.length > 100 || message.length > 1500) {
      return NextResponse.json({ error: 'Input melebihi batas karakter yang diizinkan' }, { status: 400 });
    }

    // Regex sederhana untuk mengecek format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Format email tidak valid' }, { status: 400 });
    }

    // Lanjut mengirim ke Discord...
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const country = req.headers.get('x-vercel-ip-country') || 'Unknown';
    const city = req.headers.get('x-vercel-ip-city') || 'Unknown';

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: "CyberSec Bot",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/2092/2092663.png", // Icon shield/security
        embeds: [{
          title: "🚨 Pesan Terverifikasi",
          description: "Pesan ini lolos dari Origin Check & Anti-Spam Firewall.",
          color: 2895667, // Warna Hijau Aman
          fields: [
            { name: "👤 Pengirim", value: `${name} (${email})`, inline: false },
            { name: "💬 Pesan", value: `>>> ${message}`, inline: false },
            { name: "🌐 Network Trace", value: `\`IP: ${ipAddress}\`\n\`Geo: ${city}, ${country}\``, inline: false }
          ],
          footer: { text: "Secured by Custom API Firewall" },
          timestamp: new Date().toISOString()
        }]
      })
    });

    if (!response.ok) throw new Error('Discord API Error');

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("System Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}