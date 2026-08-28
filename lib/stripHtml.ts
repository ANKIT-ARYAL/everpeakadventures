export function stripHtml(html?: string | null): string {
  if (!html) return '';
  return html
    // Remove scripts and styles completely
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    // Remove all complete HTML tags, handling quotes inside attributes correctly
    .replace(/<(?:[^>"']|"[^"]*"|'[^']*')*>/g, ' ')
    // Remove any unclosed, trailing HTML tags (e.g. from truncation)
    .replace(/<[^>]*$/, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Replace multiple spaces with a single space
    .replace(/\s+/g, ' ')
    .trim();
}
