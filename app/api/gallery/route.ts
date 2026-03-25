import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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