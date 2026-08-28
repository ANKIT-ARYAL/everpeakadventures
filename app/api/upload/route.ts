import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { requireAdmin } from "@/app/lib/require-admin";
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

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
    
    // Initialize Supabase Client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration is missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Upload to Supabase Storage 'images' bucket
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('images')
      .upload(`${subdir}/${filename}`, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(`${subdir}/${filename}`);
    const url = publicUrlData.publicUrl;
    
    await prisma.mediaAsset.upsert({
      where: { url },
      create: { url, path: `${subdir}/${filename}`, originalName: file.name, mime: file.type, size: file.size, kind: type === 'video' ? 'video' : 'image' },
      update: { originalName: file.name, mime: file.type, size: file.size, kind: type === 'video' ? 'video' : 'image' },
    });

    return NextResponse.json({ success: true, url, name: file.name, size: file.size });
  } catch (error: any) {
    console.error('Upload failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}