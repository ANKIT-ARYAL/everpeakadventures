"use client";

import NavItem from "./NavItem";

const menu = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about-us",
    children: [
      { label: "Message From Founder", href: "/message-from-managing-director" },
      { label: "Our Team", href: "/our-team" },
      { label: "Why Ever Peak Adventures", href: "/why-ever-peak-adventures" },
      { label: "Responsible Travel", href: "/responsible-travel" },
      { label: "Terms and Conditions", href: "/terms-and-conditions" },
      { label: "Registrations /Affiliations", href: "/legal-document" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Testimonials", href: "/testimonials" },
    ],
  },
  {
    label: "Trekking in Nepal",
    href: "/destinations",
    children: [
      { label: "Everest Region", href: "/everest-region" },
      { label: "Manaslu Region", href: "/manaslu-region" },
      { label: "Annapurna Region", href: "/annapurna-region" },
      { label: "Langtang Region", href: "/langtang-region" },
      { label: "Kanchenjunga Region", href: "/kanchenjunga-region" },
      { label: "Makalu Region", href: "/makalu-region" },
      { label: "Mustang Region", href: "/mustang-region" },
      { label: "Dolpo Region", href: "/dolpo-region" },
    ],
  },
  {
    label: "Tour Packages",
    href: "/packages",
    children: [
      { label: "Nepal", href: "/nepal" },
      { label: "Bhutan", href: "/bhutan" },
      { label: "Tibet", href: "/tibet" },      
    ],
  },
  {
    label: "FAQs",
    href: "/faqs",
  },
  {
    label: "Blogs",
    href: "/blog",
  },
  {
    label: "Contact Us",
    href: "/contact-us",
  }
];

export default function NavMenu() {
  return (
    <nav className="hidden md:flex gap-8 items-center text-white font-medium bg-slate-900 oswald">
      {menu.map((item) => (
        <NavItem key={item.label} item={item} />
      ))}
    </nav>
  );
}
