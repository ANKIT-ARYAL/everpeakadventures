import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const item = await prisma.packingItem.update({
      where: { id },
      data: {
        ...body,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("[PACKING_LIST_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const item = await prisma.packingItem.delete({
      where: { id },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("[PACKING_LIST_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
