import { stripHtml } from '@/lib/stripHtml';

export function RichTextInline({ html }: { html?: string }) {
  if (!html) return null;
  return <span>{stripHtml(html)}</span>;
}