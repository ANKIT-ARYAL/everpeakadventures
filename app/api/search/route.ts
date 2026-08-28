import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ treks: [], tours: [], categories: [], blogs: [] });
  }

  try {
    const [treks, tours, categories, blogs] = await Promise.all([
      // Search Treks
      prisma.trek.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { region: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { difficulty: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          title: true,
          slug: true,
          heroImage: true,
          durationDays: true,
          price: true,
          discountedPrice: true,
          region: true,
          groupPrices: true,
        },
        take: 5,
        orderBy: { order: 'asc' },
      }),

      // Search Tours
      prisma.tour.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { destination: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          title: true,
          slug: true,
          heroImage: true,
          duration: true,
          price: true,
          discountedPrice: true,
          destination: true,
          groupPrices: true,
        },
        take: 5,
        orderBy: { order: 'asc' },
      }),

      // Search Trek Categories
      prisma.trekCategory.findMany({
        where: {
          published: true,
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          name: true,
          slug: true,
          description: true,
        },
        take: 3,
      }),

      // Search Blog Posts
      prisma.blogPost.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { excerpt: { contains: q, mode: 'insensitive' } },
            { category: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          title: true,
          slug: true,
          image: true,
          category: true,
          date: true,
        },
        take: 4,
      }),
    ]);

    const parsePrice = (val: string | undefined | null) => {
      if (!val) return 0;
      const num = parseFloat(val.replace(/[^0-9.]/g, ''));
      return isNaN(num) ? 0 : num;
    };

    const processLowestPrice = (item: any) => {
      let minPrice = item.discountedPrice ?? item.price;
      if (item.groupPrices && item.groupPrices.length > 0) {
        const prices = item.groupPrices.map((gp: any) => parsePrice(gp.price)).filter((p: number) => p > 0);
        if (prices.length > 0) {
          minPrice = Math.min(...prices);
        }
      }
      return { ...item, lowestPrice: minPrice };
    };

    return NextResponse.json({
      treks: treks.map(processLowestPrice),
      tours: tours.map(processLowestPrice),
      categories,
      blogs,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
