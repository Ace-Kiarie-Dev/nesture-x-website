import fs from 'fs';
import path from 'path';

const templateCache = new Map<string, string>();

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function loadTemplate(name: string): string {
  const cached = templateCache.get(name);
  if (cached !== undefined) return cached;

  const filePath = path.join(process.cwd(), 'src', 'emails', `${name}.html`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  templateCache.set(name, raw);
  return raw;
}

// Renders a `src/emails/{name}.html` template, substituting `{{key}}` merge
// fields with HTML-escaped values from `data`. Unmatched keys resolve to ''.
export function renderTemplate(name: string, data: Record<string, string>): string {
  const template = loadTemplate(name);

  return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    const value = data[key];
    if (value === undefined) return '';
    return escapeHtml(value).replace(/\n/g, '<br />');
  });
}
