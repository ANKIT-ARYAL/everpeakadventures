import { Check, X } from "lucide-react";
import { stripHtml, toHtml } from "@/app/lib/html";

export function packageItems(value: string): string[] {
  return toHtml(value)
    .replace(/<br\s*\/?>|<\/(?:p|li|div|h[1-6])>/gi, '\n')
    .split('\n')
    .map(item => stripHtml(item).replace(/^[•✓✔✗✘]\s*/, '').trim())
    .filter(Boolean);
}

export default function PackageItemsGrid({ content, included }: { content: string; included: boolean }) {
  const Icon = included ? Check : X;
  return (
    <ul className="flex flex-col gap-3">
      {packageItems(content).map((item, index) => (
        <li key={`${index}-${item}`} className="flex min-w-0 items-start gap-x-3 rounded-xl border border-gray-100 bg-[#f9fafb] px-3.5 py-3.5 shadow-[0_2px_8px_rgba(17,34,51,0.02)]">
          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${included ? 'bg-[#1e857c]' : 'bg-[#d9534f]'}`}>
            <Icon aria-hidden="true" strokeWidth={3} className="h-3 w-3 text-white" />
          </span>
          <span className="min-w-0 text-sm font-medium leading-relaxed text-[#112233] sm:text-[15px]">{item}</span>
        </li>
      ))}
    </ul>
  );
}
