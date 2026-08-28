import re

with open('app/components/wrappers/TrekkingPageWrapper.tsx', 'r') as f:
    content = f.read()

# Update interface
interface_regex = re.compile(r'interface PageProps \{\s*searchParams:\s*Promise<\{\s*page\?:\s*string;\s*q\?:\s*string;\s*\}>;\s*\}')
new_interface = """interface PageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    destination?: string;
    duration?: string;
    difficulty?: string;
    price?: string;
  }>;
}"""
content = interface_regex.sub(new_interface, content)

# Update logic
old_logic = """  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const query = (resolvedParams?.q || '').trim().toLowerCase();
  const pageSize = 12;

  const allTreks = await prisma.trek.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  const filteredTreks = query
    ? allTreks.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          stripHtml(t.description).toLowerCase().includes(query) ||
          (t.region || '').toLowerCase().includes(query)
      )
    : allTreks;"""

new_logic = """  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const query = (resolvedParams?.q || '').trim().toLowerCase();
  const dest = (resolvedParams?.destination || '').trim().toLowerCase();
  const dur = (resolvedParams?.duration || '').trim();
  const diff = (resolvedParams?.difficulty || '').trim().toLowerCase();
  const maxPrice = Number(resolvedParams?.price) || 0;
  const pageSize = 12;

  const allTreks = await prisma.trek.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  const filteredTreks = allTreks.filter((t) => {
    let match = true;

    if (query) {
      match = match && (
        t.title.toLowerCase().includes(query) ||
        stripHtml(t.description).toLowerCase().includes(query) ||
        (t.region || '').toLowerCase().includes(query)
      );
    }

    if (dest) {
      match = match && (t.region || '').toLowerCase().includes(dest);
    }

    if (dur) {
      const daysStr = (t.durationDays || '').replace(/[^0-9]/g, '');
      const days = parseInt(daysStr, 10) || 0;
      if (dur === '1-7') match = match && (days >= 1 && days <= 7);
      else if (dur === '8-14') match = match && (days >= 8 && days <= 14);
      else if (dur === '15+') match = match && (days >= 15);
    }

    if (diff) {
      match = match && (t.difficulty || '').toLowerCase().includes(diff);
    }

    if (maxPrice > 0) {
      const trekPrice = t.discountedPrice ?? t.price;
      if (trekPrice !== null && trekPrice !== undefined) {
        match = match && (trekPrice <= maxPrice);
      }
    }

    return match;
  });"""

content = content.replace(old_logic, new_logic)

with open('app/components/wrappers/TrekkingPageWrapper.tsx', 'w') as f:
    f.write(content)

