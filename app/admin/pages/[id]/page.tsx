import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getSitemapSection, sectionCanView, type SitemapLink } from '@/lib/sitemap';
import { SectionPageView } from '../../components/site-map';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function SiteMapSectionPage({ params }: PageProps) {
  const { id } = await params;
  const section = getSitemapSection(id);
  if (!section) notFound();

  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  const isSuperAdmin = !!session.user.isSuperAdmin;
  const permissions = session.user.permissions ?? [];

  if (!sectionCanView(section, isSuperAdmin, permissions)) notFound();

  const canView = (link: SitemapLink) => isSuperAdmin || permissions.includes(link.perm);

  return <SectionPageView section={section} canView={canView} />;
}