import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// --- FUNGSI GET: Untuk mengambil foto galeri ---
export async function GET() {
  try {
    // Mencari folder public/projects
    const dir = path.join(process.cwd(), 'public', 'projects');
    
    // Jika folder tidak ada, kembalikan array kosong
    if (!fs.existsSync(dir)) {
      return NextResponse.json([]);
    }

    // Membaca semua nama file di dalam folder tersebut
    const filenames = fs.readdirSync(dir);

    // Menyaring agar hanya file gambar yang diambil
    const images = filenames.filter((file) => 
      file.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    );

    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json([]);
  }
}

// --- FUNGSI POST: Untuk mengirim pesan ke Discord Webhook (Sistem Keamanan & IP Tracker) ---
export async function POST(req: Request) {
  try {
    // 1. Terima data dari Frontend
    const { name, email, message } = await req.json();

    // 2. Validasi Dasar (Security Check)
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    // Hindari payload yang terlalu besar (mencegah spam teks panjang)
    if (message.length > 2000) {
      return NextResponse.json({ error: 'Pesan terlalu panjang' }, { status: 400 });
    }

    // 3. Ambil URL Webhook dari Vercel Environment Variables
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 🚨 FITUR BARU: MENGAMBIL IP & GEOLOKASI (Vercel Headers) 🚨
    // Saat dijalankan di lokal (localhost), ini mungkin bernilai '::1' atau kosong.
    // Tapi saat di-deploy ke Vercel, data ini akan sangat akurat.
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'IP Tidak Terdeteksi';
    const country = req.headers.get('x-vercel-ip-country') || 'Negara Unknown';
    const city = req.headers.get('x-vercel-ip-city') || 'Kota Unknown';

    // 4. Kirim data ke Discord secara tertutup dari sisi Server Next.js
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: "Portfolio Security Bot",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/4782/4782472.png", // Ikon surat
        embeds: [{
          title: "📨 Pesan Baru dari Portofolio!",
          description: "Seseorang Baru Saja Mengirimkan Kamu Pesan.",
          color: 3447003, // Warna Biru
          fields: [
            { name: "👤 Nama", value: name, inline: true },
            { name: "📧 Email", value: email, inline: true },
            { name: "💬 Pesan", value: message },
            // Menambahkan kolom baru untuk Info Pengirim (IP & Lokasi)
            { name: "🌐 Info Pelacak Sistem", value: `**IP Address:** \`${ipAddress}\`\n**Lokasi:** ${city}, ${country}`, inline: false }
          ],
          footer: { text: "Secured via Next.js API Route | Tracker Active" },
          timestamp: new Date().toISOString()
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Gagal meneruskan ke Discord');
    }

    // 5. Beri tahu Frontend kalau berhasil
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}