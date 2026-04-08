import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const rateLimitMap = new Map<string, number>();

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

export async function POST(req: Request) {
  try {
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');
    
    if (origin && !origin.includes('localhost') && !origin.includes(host || '')) {
       return NextResponse.json({ error: 'Akses Ditolak: Invalid Origin' }, { status: 403 });
    }

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown IP';
    const now = Date.now();
    const cooldownPeriod = 5 * 60 * 1000; 

    if (rateLimitMap.has(ipAddress)) {
      const lastRequestTime = rateLimitMap.get(ipAddress)!;
      if (now - lastRequestTime < cooldownPeriod) {
        const remainingTime = Math.ceil((cooldownPeriod - (now - lastRequestTime)) / 1000 / 60);
        return NextResponse.json({ 
          error: `Terlalu banyak request. Silakan coba lagi dalam ${remainingTime} menit.` 
        }, { status: 429 });
      }
    }
    rateLimitMap.set(ipAddress, now);

    const { name, email, message, trap_website, deviceInfo } = await req.json();

    if (trap_website) {
      return NextResponse.json({ success: true, note: 'Bot trapped' }); 
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }
    if (name.length > 50 || email.length > 100 || message.length > 1500) {
      return NextResponse.json({ error: 'Input melebihi batas karakter' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Format email tidak valid' }, { status: 400 });
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const country = req.headers.get('x-vercel-ip-country') || 'Unknown';
    const city = req.headers.get('x-vercel-ip-city') || 'Unknown';
    
    const info = deviceInfo || {};
    const ua = info.userAgent || req.headers.get('user-agent') || 'Unknown';
    
    let os = "Unknown OS";
    if (ua.includes("Win")) os = "Windows";
    else if (ua.includes("Mac")) os = "MacOS";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
    else if (ua.includes("Linux")) os = "Linux";

    let browser = "Unknown Browser";
    if (ua.includes("Chrome") && !ua.includes("Edg") && !ua.includes("OPR")) browser = "Chrome";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Edg")) browser = "Edge";
    else if (ua.includes("OPR") || ua.includes("Opera")) browser = "Opera";

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: "CyberSec Bot",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/2092/2092663.png", 
        embeds: [{
          title: "🚨 Target Dikenali (New Message)",
          description: "Sistem telah melakukan ekstraksi profil pada pengirim pesan.",
          color: 2895667, 
          fields: [
            { name: "👤 Pengirim", value: `${name} (${email})`, inline: false },
            { name: "💬 Pesan", value: `>>> ${message}`, inline: false },
            { name: "🌐 Network Trace", value: `**IP:** \`${ipAddress}\`\n**Geo:** ${city}, ${country}`, inline: true },
            { name: "💻 Spesifikasi Sistem", value: `**OS:** ${os}\n**Browser:** ${browser}\n**Cores CPU:** ${info.cpuCores}\n**Est. RAM:** ${info.ram}\n**Layar:** ${info.screenRes}`, inline: true },
            { name: "🔍 Raw User-Agent", value: `\`${ua.substring(0, 100)}...\``, inline: false }
          ],
          footer: { text: "Secured by Custom API Firewall | Target Profiled" },
          timestamp: new Date().toISOString()
        }]
      })
    });

    if (!response.ok) throw new Error('Discord API Error');

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}