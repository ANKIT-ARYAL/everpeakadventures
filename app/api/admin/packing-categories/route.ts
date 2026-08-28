import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.packingCategory.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching packing categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const category = await prisma.packingCategory.upsert({
      where: { name },
      update: { description },
      create: { name, description }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error saving packing category:", error);
    return NextResponse.json({ error: "Failed to save category" }, { status: 500 });
  }
}
