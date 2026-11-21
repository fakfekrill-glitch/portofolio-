import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'public', 'projects');
    if (!fs.existsSync(dir)) return NextResponse.json([]);
    const filenames = fs.readdirSync(dir);
    const images = filenames.filter((file) => file.match(/\.(jpg|jpeg|png|gif|webp)$/i));
    return NextResponse.json(images);
  } catch {
    return NextResponse.json([]);
  }
}
