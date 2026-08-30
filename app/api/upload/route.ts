import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { requireAdmin } from "@/app/lib/require-admin";
import { prisma } from '@/lib/prisma';

const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif'];
const ALLOWED_VIDEO = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'image';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_IMAGE.includes(file.type) && !ALLOWED_VIDEO.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Unsupported file type' }, { status: 400 });
    }

    const maxSize = type === 'video' ? 500 * 1024 * 1024 : 15 * 1024 * 1024; // 500MB video / 15MB image
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `File too large (max ${maxSize / (1024 * 1024)}MB)` },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop() || (type === 'video' ? 'mp4' : 'jpg');
    const filename = `${randomUUID()}.${ext}`;
    const subdir = type === 'video' ? 'videos' : 'images';

    // Save locally to public/uploads/images or public/uploads/videos
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subdir);
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const url = `/uploads/${subdir}/${filename}`;

    await prisma.mediaAsset.upsert({
      where: { url },
      create: { 
        url, 
        path: `${subdir}/${filename}`, 
        originalName: file.name, 
        mime: file.type, 
        size: file.size, 
        kind: type === 'video' ? 'video' : 'image' 
      },
      update: { 
        originalName: file.name, 
        mime: file.type, 
        size: file.size, 
        kind: type === 'video' ? 'video' : 'image' 
      },
    });

    return NextResponse.json({ success: true, url, name: file.name, size: file.size });
  } catch (error: any) {
    console.error('Local upload failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}