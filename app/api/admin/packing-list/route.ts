import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const items = await prisma.packingItem.findMany({
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
      ],
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("[PACKING_LIST_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, name, order } = body;

    if (!category || !name) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const item = await prisma.packingItem.create({
      data: {
        category,
        name,
        order: order || 0,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("[PACKING_LIST_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
