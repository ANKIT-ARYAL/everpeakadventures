// Strips HTML tags and decodes basic entities for plain-text display (e.g. card excerpts).
export function stripHtml(html?: string | null): string {
  if (!html) return '';
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

// Sanitises HTML of all class, data-*, style and other polluting attributes
// injected by AI tools (ChatGPT, Gemini, Google Docs copy-paste, etc.)
export function sanitizeHtml(html?: string | null): string {
  if (!html) return '';
  return html
    // Strip all class/style/data-*/aria-*/role attributes from any tag
    .replace(/\s+(role|dir|id|tabindex|data-[\w-]+|aria-[\w-]+)="[^"]*"/gi, '')
    // Preserve only the inline formatting controls supported by the editor.
    .replace(/\s+style=(?:"([^"]*)"|'([^']*)')/gi, (_attribute, doubleQuoted, singleQuoted) => {
      const declarations = String(doubleQuoted ?? singleQuoted).split(';').filter(declaration => {
        const [property, ...parts] = declaration.split(':');
        const value = parts.join(':').trim();
        if (property.trim().toLowerCase() === 'text-align') return /^(left|center|right|justify)$/.test(value);
        if (property.trim().toLowerCase() === 'font-size') return /^\d+(?:\.\d+)?(?:px|pt|em|rem|%)$/.test(value);
        return /^(color|background-color)$/.test(property.trim().toLowerCase()) && /^(#[0-9a-f]{3,8}|[a-z]+|rgba?\([\d.,%\s]+\))$/i.test(value);
      });
      return declarations.length ? ` style="${declarations.join(';')}"` : '';
    })
    // Remove empty class attributes that remain
    .replace(/\s+class=(?:"([^"]*)"|'([^']*)')/gi, (_attribute, doubleQuoted, singleQuoted) => {
      const classes = String(doubleQuoted ?? singleQuoted).split(/\s+/).filter(name => /^image-collage(?:-grid|-item|-[234])?$/.test(name));
      return classes.length ? ` class="${classes.join(' ')}"` : '';
    })
    // Remove AI comment markers
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove script and style tags entirely
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Keep empty editor paragraphs as visible blank lines.
    .replace(/<p\b[^>]*>\s*<\/p>/gi, '<p><br/></p>')
    // Remove empty divs and spans
    .replace(/<(div|span)[^>]*>\s*<\/(div|span)>/gi, '')
    .trim();
}

// Renders content as HTML. If the value is plain text (no tags), converts
// newlines into <p> blocks so seeded plain text still looks right.
// Also sanitizes any AI-generated HTML attributes.
export function toHtml(value?: string | null): string {
  if (!value) return '';
  
  // Normalize <div> to <p> since some rich text editors save paragraphs as divs, 
  // which lack the proper CSS margins and break regex matchers.
  let html = value.trim().replace(/<div\b[^>]*>/gi, '<p>').replace(/<\/div>/gi, '</p>');

  // If the content lacks block elements like <p> but has newlines, we should format the newlines.
  if (!/<(p|div|ul|ol|h[1-6]|blockquote|table)[^>]*>/i.test(html)) {
    // Split by double newlines into paragraphs, wrap in <p>, and join with <br/> for extra gap
    const paragraphs = html.split(/\n\s*\n/).filter(p => p.trim());
    if (paragraphs.length > 1) {
      html = paragraphs.map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`).join('<br/>');
    } else {
      html = `<p>${html.replace(/\n/g, '<br/>')}</p>`;
    }
  }

  if (/<[a-z][\s\S]*>/i.test(html)) {
    let sanitized = sanitizeHtml(html);
    // The user explicitly requested an extra line break after each paragraph.
    // If the content is from a rich text editor (already contains <p>), we add a <br/> after each </p>.
    sanitized = sanitized.replace(/<\/p>(?!\s*(?:<br\s*\/?>)?\s*$)/gi, '</p><br/>');
    return sanitized;
  }
  
  return `<p>${html}</p>`;
}
