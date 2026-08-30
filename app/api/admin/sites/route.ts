import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch all site workspaces from your database
    const sites = await prisma.siteWorkspace.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: sites });
  } catch (error: any) {
    // If the table hasn't been migrated yet, return an empty array gracefully
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, domain, db, version, status } = body;

    if (!name || !domain) {
      return NextResponse.json({ success: false, error: 'Workspace name and domain are required.' }, { status: 400 });
    }

    const newSite = await prisma.siteWorkspace.create({
      data: {
        name,
        domain,
        db: db || 'PostgreSQL (Supabase)',
        version: version || 'v1.0.0',
        status: status || 'active',
      },
    });

    return NextResponse.json({ success: true, data: newSite, message: 'Site provisioned successfully!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to provision site' }, { status: 500 });
  }
}