import Link from 'next/link';
import {
  Home,
  Info,
  MessageCircle,
  HelpCircle,
  BookOpen,
  Database,
  FileText,
  Settings,
  Shield,
  Users,
  MessageSquare,
  LayoutDashboard,
  Mail,
  Image as ImageIcon,
  Layers3,
  Sparkles,
  Video,
  ClipboardCheck,
  Folder,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import type { SitemapIcon, SitemapLink, SitemapSection } from '@/lib/sitemap';

const ICON_MAP: Record<SitemapIcon, LucideIcon> = {
  home: Home,
  info: Info,
  contact: MessageCircle,
  faq: HelpCircle,
  blog: BookOpen,
  system: Database,
  file: FileText,
  settings: Settings,
  shield: Shield,
  team: Users,
  review: MessageSquare,
  dashboard: LayoutDashboard,
  message: MessageSquare,
  image: ImageIcon,
  layers: Layers3,
  sparkles: Sparkles,
  video: Video,
  mail: Mail,
  checklist: ClipboardCheck,
  folder: Folder,
};

export function SectionIcon({ name, className }: { name: SitemapIcon; className?: string }) {
  const Icon = ICON_MAP[name] ?? FileText;
  return <Icon className={className} />;
}

export function SectionCard({ section, count }: { section: SitemapSection; count: number }) {
  return (
    <Link
      href={`/admin/pages/${section.key}`}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-[#dbeafe] hover:shadow-md transition-all flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-lg bg-[#eef6fd] text-[#24a0ed] flex items-center justify-center">
          <SectionIcon name={section.icon} className="w-5 h-5" />
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#24a0ed] transition-colors" />
      </div>
      <div>
        <h3 className="font-bold text-[#112233] text-base group-hover:text-[#24a0ed] transition-colors">{section.label}</h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{section.description}</p>
      </div>
      <div className="text-[11px] font-bold uppercase tracking-wide text-gray-400 border-t border-gray-100 pt-3">
        {count} {count === 1 ? 'page' : 'pages'}
      </div>
    </Link>
  );
}

function LinkCard({ link, note }: { link: SitemapLink; note?: string }) {
  return (
    <Link
      href={link.href}
      className="group flex items-start gap-3 bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:border-[#dbeafe] hover:shadow-md transition-all"
    >
      <div className="w-9 h-9 rounded-lg bg-[#eef6fd] text-[#24a0ed] flex items-center justify-center shrink-0">
        <SectionIcon name={link.icon ?? 'file'} className="w-[18px] h-[18px]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-bold text-[#112233] text-sm group-hover:text-[#24a0ed] transition-colors truncate">{link.label}</div>
        {note ? (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{note}</p>
        ) : (
          <p className="text-[11px] text-gray-400 mt-0.5 truncate font-mono">{link.href.replace(/^\/admin/, '') || '/'}</p>
        )}
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#24a0ed] transition-colors shrink-0 mt-1" />
    </Link>
  );
}

export function SectionPageView({
  section,
  canView,
}: {
  section: SitemapSection;
  canView: (link: SitemapLink) => boolean;
}) {
  const grouped = section.groups ?? null;
  const links = (grouped ? [] : section.links ?? []).filter(canView);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto text-sm">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <Link href="/admin/pages" className="text-xs font-bold text-[#24a0ed] hover:text-blue-700 uppercase tracking-wide">
          ← All Pages
        </Link>
        <div className="flex items-start gap-4 mt-3">
          <div className="w-12 h-12 rounded-xl bg-[#eef6fd] text-[#24a0ed] flex items-center justify-center shrink-0">
            <SectionIcon name={section.icon} className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-black text-[#112233] uppercase tracking-wide break-words">{section.label}</h1>
            <p className="text-gray-500 mt-1 break-words">{section.description}</p>
          </div>
        </div>
      </div>

      {grouped ? (
        <div className="space-y-6">
          {grouped.map((g) => {
            const gLinks = g.links.filter(canView);
            if (gLinks.length === 0) return null;
            return (
              <div key={g.label}>
                <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3 px-1">{g.label}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {gLinks.map((link) => (
                    <LinkCard key={link.href} link={link} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : links.length === 0 ? (
        <p className="text-sm text-gray-400 italic text-center py-8">No pages available in this section.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {links.map((link) => (
            <LinkCard key={link.href} link={link} />
          ))}
        </div>
      )}
    </div>
  );
}