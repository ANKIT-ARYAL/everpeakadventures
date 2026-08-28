export type PermAction = "view" | "create" | "edit" | "delete";

export interface PermissionResource {
  key: string;
  label: string;
  group: string;
  actions: PermAction[];
}

export const PERMISSION_ACTIONS: PermAction[] = ["view", "create", "edit", "delete"];

export const PERMISSION_RESOURCES: PermissionResource[] = [
  { key: "dashboard", label: "Dashboard", group: "Home", actions: ["view"] },
  { key: "hero-content", label: "Hero Banners", group: "Home", actions: ["view", "edit"] },
  { key: "home-section-content", label: "Home Sections", group: "Home", actions: ["view", "edit"] },
  { key: "video-banners", label: "Video & CTA Banners", group: "Home", actions: ["view", "edit"] },
  { key: "welcome-features", label: "Welcome Features", group: "Home", actions: ["view", "create", "edit", "delete"] },

  { key: "bookings", label: "Booking Requests", group: "Bookings", actions: ["view", "edit", "delete"] },

  { key: "treks", label: "Treks", group: "Trekking In Nepal", actions: ["view", "create", "edit", "delete"] },
  { key: "trek-categories", label: "Trekking Categories", group: "Trekking In Nepal", actions: ["view", "create", "edit", "delete"] },

  { key: "tours", label: "Tours", group: "Tour Packages", actions: ["view", "create", "edit", "delete"] },
  { key: "tour-categories", label: "Tour Categories", group: "Tour Packages", actions: ["view", "create", "edit", "delete"] },
  { key: "departures", label: "Fixed Departures", group: "Tour Packages", actions: ["view", "create", "edit", "delete"] },

  { key: "pages", label: "Pages", group: "Pages", actions: ["view", "create", "edit", "delete"] },
  { key: "page-categories", label: "Page Categories", group: "Pages", actions: ["view", "create", "edit", "delete"] },

  { key: "media", label: "All Gallery / Media Library", group: "Media", actions: ["view", "create", "edit", "delete"] },

  { key: "about-content", label: "About Page Content", group: "About Us", actions: ["view", "edit"] },
  { key: "director-message", label: "Message From Founder", group: "About Us", actions: ["view", "edit"] },
  { key: "why-page", label: "Why Ever Peak", group: "About Us", actions: ["view", "edit"] },
  { key: "responsible-travel", label: "Responsible Travel", group: "About Us", actions: ["view", "edit"] },
  { key: "why-choose-us", label: "Why Choose Us", group: "About Us", actions: ["view", "create", "edit", "delete"] },
  { key: "trust-items", label: "Trust Items & Badges", group: "About Us", actions: ["view", "create", "edit", "delete"] },
  { key: "team", label: "Team Members", group: "About Us", actions: ["view", "create", "edit", "delete"] },
  { key: "testimonials", label: "Testimonials (Reviews)", group: "About Us", actions: ["view", "create", "edit", "delete"] },

  { key: "faqs", label: "All FAQs", group: "FAQ", actions: ["view", "create", "edit", "delete"] },

  { key: "blogs", label: "Blog Posts", group: "Blogs", actions: ["view", "create", "edit", "delete"] },

  { key: "contact-info", label: "Contact Info", group: "Contact Us", actions: ["view", "edit"] },
  { key: "contact-widget", label: "Contact Widget", group: "Contact Us", actions: ["view", "edit"] },
  { key: "contact-submissions", label: "Contact Submissions", group: "Contact Us", actions: ["view", "edit", "delete"] },

  { key: "site-settings", label: "Site Settings", group: "System", actions: ["view", "edit"] },
  { key: "subpage-hero", label: "Subpage Heroes", group: "System", actions: ["view", "create", "edit", "delete"] },
  { key: "terms-page", label: "Terms & Conditions", group: "System", actions: ["view", "edit"] },
  { key: "privacy-policy", label: "Privacy Policy", group: "System", actions: ["view", "edit"] },
  { key: "legal-documents", label: "Legal Documents", group: "System", actions: ["view", "create", "edit", "delete"] },

  { key: "users", label: "Users", group: "Administration", actions: ["view", "create", "edit", "delete"] },
  { key: "roles", label: "Roles", group: "Administration", actions: ["view", "create", "edit", "delete"] },
];

export const ALL_PERMISSION_KEYS = PERMISSION_RESOURCES.flatMap((r) =>
  r.actions.map((a) => `${r.key}:${a}`)
);

export function permKey(resource: string, action: PermAction): string {
  return `${resource}:${action}`;
}

export function hasPerm(
  permissions: string[] | undefined | null,
  resource: string,
  action: PermAction
): boolean {
  if (!permissions || permissions.length === 0) return false;
  return permissions.includes(permKey(resource, action));
}

/** Resolve the permission resource key for an admin page path (e.g. /admin/treks -> "treks"). */
export function resolveResourceForPath(pathname: string): string | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "admin") return null;
  const seg = parts[1];
  if (!seg) return "dashboard";
  if (seg === "why-choose-us") return "why-choose-us";
  const known = PERMISSION_RESOURCES.some((r) => r.key === seg);
  return known ? seg : null;
}
