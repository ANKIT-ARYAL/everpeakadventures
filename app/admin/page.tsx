import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { 
  Compass, Layers, FileText, HelpCircle, MessageSquare, 
  Shield, Users, Briefcase, Mail, FileCheck, Database
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Fetch live counts for every database model
  const trekCount = await prisma.trek.count();
  const tourCount = await prisma.tour.count();
  const blogCount = await prisma.blogPost.count();
  const faqCount = await prisma.fAQ.count();
  const reviewCount = await prisma.clientReview.count();
  const teamCount = await prisma.teamMember.count();
  const legalCount = await prisma.legalDocument.count();
  const fixedCount = await prisma.fixedDeparture.count();
  const submissionCount = await prisma.contactSubmission.count();
  const pageCount = await prisma.page.count();

  // Fetch or fallback to default dynamic system summary settings
  let systemSetting = await prisma.systemSetting.findFirst();
  if (!systemSetting) {
    systemSetting = await prisma.systemSetting.create({
      data: {
        clientExpiry: "16 Dec, 2026",
        packageType: "Advanced CMS Platform",
        databaseStatus: "Optimized (PostgreSQL)",
        daysLeft: "133 days remaining"
      }
    });
  }

  const overviewCards = [
    { title: 'Posts (Blogs)', count: blogCount, href: '/admin/blogs', icon: FileText, color: 'text-emerald-500', desc: 'View all blog posts' },
    { title: 'Pages', count: pageCount, href: '/admin/pages', icon: FileCheck, color: 'text-amber-600', desc: 'View all dynamic pages' },
    { title: 'Trekking', count: trekCount, href: '/admin/treks', icon: Compass, color: 'text-blue-500', desc: 'View all trekking packages' },
    { title: 'Tour Packages', count: tourCount, href: '/admin/tours', icon: Layers, color: 'text-amber-500', desc: 'View all tour packages' },
    { title: 'Testimonials', count: reviewCount, href: '/admin/testimonials', icon: MessageSquare, color: 'text-purple-500', desc: 'View all client reviews' },
    { title: 'FAQs', count: faqCount, href: '/admin/faqs', icon: HelpCircle, color: 'text-rose-500', desc: 'View all FAQs' },
    { title: 'Fixed Departures', count: fixedCount, href: '/admin/fixed-departures', icon: Briefcase, color: 'text-indigo-500', desc: 'View scheduled departures' },
    { title: 'Team Members', count: teamCount, href: '/admin/team', icon: Users, color: 'text-cyan-500', desc: 'View company staff & guides' },
    { title: 'Legal Documents', count: legalCount, href: '/admin/legal-documents', icon: Shield, color: 'text-indigo-600', desc: 'View legal files & licenses' },
    { title: 'Contact Leads', count: submissionCount, href: '/admin/contact-submissions', icon: Mail, color: 'text-yellow-500', desc: 'View customer inquiries' },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-xs">
      
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#112233] oswald uppercase tracking-wide">
            Good Morning, Ever Peak Adventures
          </h1>
          <p className="text-gray-500 mt-1">
            Your website overview, content shortcuts, database metrics, and system access status are here.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Status: Active & Secure
          </div>
        </div>
      </div>

      {/* Dynamic System & Hosting Summary Box */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-[#2271b1]" /> System & Hosting Summary (Dynamic)
          </h2>
          <span className="text-[11px] text-gray-400">Live Database Record ID: {systemSetting.id.slice(0, 8)}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
            <span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Client Expiry</span>
            <span className="font-bold text-gray-800 text-sm">{systemSetting.clientExpiry}</span>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
            <span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Package Type</span>
            <span className="font-bold text-gray-800 text-sm">{systemSetting.packageType}</span>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
            <span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Database Storage</span>
            <span className="font-bold text-emerald-600 text-sm">{systemSetting.databaseStatus}</span>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
            <span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Days Left</span>
            <span className="font-bold text-[#2271b1] text-sm">{systemSetting.daysLeft}</span>
          </div>
        </div>
      </div>

      {/* Website Content Overview Grid */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h2 className="font-bold text-gray-800 uppercase tracking-wider">
            Website Content Overview
          </h2>
          <p className="text-gray-400 mt-0.5">Quick access to all your website content. Click any card to manage.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {overviewCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link 
                key={idx}
                href={card.href}
                className="p-5 rounded-xl border border-gray-100 bg-[#fcfcfc] hover:bg-white hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      {card.title}
                    </span>
                    <span className="text-3xl font-black text-[#112233] oswald">
                      {card.count}
                    </span>
                  </div>
                  <div className={`p-2.5 rounded-xl bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500 font-medium group-hover:text-[#2271b1] transition-colors">
                    {card.desc} →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}