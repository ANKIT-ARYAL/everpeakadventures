import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { hasPerm } from "@/lib/permissions";
import type { PermAction } from "@/lib/permissions";
import Link from 'next/link';
import Greeting from "../admin/components/Greeting";
import { 
  Compass, Layers, FileText, HelpCircle, MessageSquare, 
  Shield, Users, Briefcase, Mail, Database
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await auth();
  const permissions = session?.user?.permissions ?? [];
  const isSuperAdmin = !!session?.user?.isSuperAdmin;
  const can = (resource: string, action: PermAction = "view") =>
    isSuperAdmin || hasPerm(permissions, resource, action);

  const overviewCards = [] as {
    title: string;
    count: number;
    href: string;
    icon: any;
    color: string;
    desc: string;
  }[];

  const pushCard = async (
    resource: string,
    card: {
      title: string;
      href: string;
      icon: any;
      color: string;
      desc: string;
    },
    counter: () => Promise<number>
  ) => {
    if (can(resource)) {
      overviewCards.push({ ...card, count: await counter() });
    }
  };

  await Promise.all([
    pushCard("blogs", { title: 'Posts (Blogs)', href: '/admin/blogs', icon: FileText, color: 'text-emerald-500', desc: 'View all blog posts' }, () => prisma.blogPost.count()),
    pushCard("treks", { title: 'Trekking', href: '/admin/treks', icon: Compass, color: 'text-blue-500', desc: 'View all trekking packages' }, () => prisma.trek.count()),
    pushCard("tours", { title: 'Tour Packages', href: '/admin/tours', icon: Layers, color: 'text-amber-500', desc: 'View all tour packages' }, () => prisma.tour.count()),
    pushCard("testimonials", { title: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare, color: 'text-purple-500', desc: 'View all client reviews' }, () => prisma.clientReview.count()),
    pushCard("faqs", { title: 'FAQs', href: '/admin/faqs', icon: HelpCircle, color: 'text-rose-500', desc: 'View all FAQs' }, () => prisma.fAQ.count()),
    pushCard("departures", { title: 'Fixed Departures', href: '/admin/departures', icon: Briefcase, color: 'text-indigo-500', desc: 'View scheduled departures' }, () => prisma.departure.count()),
    pushCard("team", { title: 'Team Members', href: '/admin/team', icon: Users, color: 'text-cyan-500', desc: 'View company staff & guides' }, () => prisma.teamMember.count()),
    pushCard("legal-documents", { title: 'Legal Documents', href: '/admin/legal-documents', icon: Shield, color: 'text-indigo-600', desc: 'View legal files & licenses' }, () => prisma.legalDocument.count()),
    pushCard("contact-submissions", { title: 'Contact Leads', href: '/admin/contact-submissions', icon: Mail, color: 'text-yellow-500', desc: 'View customer inquiries' }, () => prisma.contactSubmission.count()),
    pushCard("bookings", { title: 'Booking Requests', href: '/admin/bookings', icon: Briefcase, color: 'text-orange-500', desc: 'View booking requests' }, () => prisma.bookingSubmission.count()),
  ]);

  let recentBookings: Awaited<ReturnType<typeof prisma.bookingSubmission.findMany>> = [];
  if (can("bookings")) {
    recentBookings = await prisma.bookingSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  }

  let systemSetting = can("site-settings")
    ? await prisma.systemSetting.findFirst()
    : null;
  if (can("site-settings") && !systemSetting) {
    systemSetting = await prisma.systemSetting.create({
      data: {
        clientExpiry: "16 Dec, 2026",
        packageType: "Advanced CMS Platform",
        databaseStatus: "Optimized (PostgreSQL)",
        daysLeft: "133 days remaining"
      }
    });
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4 sm:space-y-6 text-xs pb-10">
      
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-base sm:text-lg font-black text-gray-900 tracking-wide uppercase break-words">
            <Greeting />
          </div>
          <p className="text-gray-500 mt-1 text-xs sm:text-sm leading-relaxed">
            Your website overview, content shortcuts, database metrics, and system access status are here.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          <div className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5 text-xs whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            Status: Active & Secure
          </div>
        </div>
      </div>

      {/* Dynamic System & Hosting Summary Box */}
      {systemSetting && (
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <h2 className="font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 text-xs sm:text-sm">
            <Database className="w-4 h-4 text-[#2271b1] shrink-0" /> System & Hosting Summary (Dynamic)
          </h2>
          <span className="text-[11px] text-gray-400 truncate">Live Database Record ID: {systemSetting.id}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-4 rounded-lg bg-gray-50 border border-gray-100 min-w-0">
            <span className="block text-[10px] text-gray-400 uppercase font-bold mb-1 truncate">Client Expiry</span>
            <span className="font-bold text-gray-800 text-xs sm:text-sm truncate block">{systemSetting.clientExpiry}</span>
          </div>
          <div className="p-3.5 sm:p-4 rounded-lg bg-gray-50 border border-gray-100 min-w-0">
            <span className="block text-[10px] text-gray-400 uppercase font-bold mb-1 truncate">Package Type</span>
            <span className="font-bold text-gray-800 text-xs sm:text-sm truncate block">{systemSetting.packageType}</span>
          </div>
          <div className="p-3.5 sm:p-4 rounded-lg bg-gray-50 border border-gray-100 min-w-0">
            <span className="block text-[10px] text-gray-400 uppercase font-bold mb-1 truncate">Database Storage</span>
            <span className="font-bold text-emerald-600 text-xs sm:text-sm truncate block">{systemSetting.databaseStatus}</span>
          </div>
          <div className="p-3.5 sm:p-4 rounded-lg bg-gray-50 border border-gray-100 min-w-0">
            <span className="block text-[10px] text-gray-400 uppercase font-bold mb-1 truncate">Days Left</span>
            <span className="font-bold text-[#2271b1] text-xs sm:text-sm truncate block">{systemSetting.daysLeft}</span>
          </div>
        </div>
      </div>
      )}

      {/* Website Content Overview Grid */}
      {overviewCards.length > 0 && (
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 overflow-hidden">
        <div className="mb-4 sm:mb-6">
          <h2 className="font-bold text-gray-800 uppercase tracking-wider text-xs sm:text-sm">
            Website Content Overview
          </h2>
          <p className="text-gray-400 mt-0.5 text-xs">Quick access to all your website content. Click any card to manage.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          {overviewCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link 
                key={idx}
                href={card.href}
                className="p-4 sm:p-5 rounded-xl border border-gray-100 bg-[#fcfcfc] hover:bg-white hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group min-w-0 overflow-hidden"
              >
                <div className="flex items-start justify-between mb-4 gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1 truncate">
                      {card.title}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-[#112233] block truncate">
                      {card.count}
                    </span>
                  </div>
                  <div className={`p-2.5 rounded-xl bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform ${card.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500 font-medium group-hover:text-[#2271b1] transition-colors truncate block w-full">
                    {card.desc} →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      )}

      {/* Recent Booking Requests Notification */}
      {can("bookings") && (
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <h2 className="font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 text-xs sm:text-sm">
            <Briefcase className="w-4 h-4 text-orange-500 shrink-0" /> Recent Booking Requests
          </h2>
          <Link href="/admin/bookings" className="text-[11px] font-bold text-[#24a0ed] hover:underline whitespace-nowrap">
            View all →
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <p className="py-6 text-center text-gray-400 font-medium">No booking requests yet.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentBookings.map((b) => (
              <Link
                key={b.id}
                href={`/admin/bookings`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 py-3 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0 self-start sm:self-center mt-1.5 sm:mt-0"></div>
                  <div className="min-w-0 flex-1">
                    <span className="block font-bold text-[#112233] truncate">{b.fullName} — {b.tripTitle}</span>
                    <span className="block text-[11px] text-gray-400 mt-0.5 truncate">
                      {b.phone} · {b.travelDate}
                    </span>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start shrink-0 pl-5 sm:pl-0">
                  <span className="block font-black text-[#112233] text-xs truncate">{b.estimatedTotal}</span>
                  <span className="block text-[10px] text-gray-400 sm:mt-0.5">
                    {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      )}
    </div>
  );
}