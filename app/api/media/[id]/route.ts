import { NextResponse } from 'next/server';
import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { requireAdmin } from '@/app/lib/require-admin';
import { prisma } from '@/lib/prisma';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function deleteFile(url?: string | null) {
  if (!url || !url.startsWith('/uploads')) return;
  try {
    await unlink(path.join(PUBLIC_DIR, url));
  } catch {
    // file already gone or not on disk
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin('media', 'edit');
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    if (!name) {
      return NextResponse.json({ success: false, error: 'Missing name' }, { status: 400 });
    }

    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
    }

    await prisma.mediaAsset.update({ where: { id }, data: { originalName: name } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Media rename failed:', error);
    return NextResponse.json({ success: false, error: 'Rename failed' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin('media', 'delete');
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
    }

    await deleteFile(asset.url);
    await prisma.mediaAsset.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'File deleted' });
  } catch (error) {
    console.error('Media delete failed:', error);
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 });
  }
}