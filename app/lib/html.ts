// Strips HTML tags and decodes basic entities for plain-text display (e.g. card excerpts).
export function stripHtml(html?: string | null): string {
  if (!html) return '';
  const doc = typeof document !== 'undefined'
    ? document
    : null;
  if (doc) {
    const div = doc.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.trim();
  }
  // server-side fallback (no DOM): strip tags + decode entities
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// Renders content as HTML. If the value is plain text (no tags), converts
// newlines into <p> blocks so seeded plain text still looks right.
export function toHtml(value?: string | null): string {
  if (!value) return '';
  if (/<[a-z][\s\S]*>/i.test(value)) return value;
  return value
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');
}