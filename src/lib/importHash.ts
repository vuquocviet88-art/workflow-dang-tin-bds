// Import of scraped rows handed over in the URL fragment: https://app/#vvh=<base64url json>&p=<projectId>
// The fragment never reaches any server. Used by the browser-extension flow where the clipboard is unavailable.
import { mergeRows, parseDatasetJson } from './market';

export interface HashImportResult {
  projectId: string | null;
  added: number;
}

// Cached so that React StrictMode's double initialisers do not see an already-cleared hash.
let cached: HashImportResult | undefined;

export function consumeHashImport(): HashImportResult {
  if (cached) return cached;
  cached = { projectId: null, added: 0 };
  try {
    const m = location.hash.match(/^#vvh=([^&]+)&p=([\w-]+)/);
    if (!m) return cached;
    const b64 = decodeURIComponent(m[1]).replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64);
    const json = new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
    const parsed = parseDatasetJson(json);
    const key = `vvh_rows_${m[2]}`;
    const prev = JSON.parse(localStorage.getItem(key) || 'null');
    const merged = mergeRows(Array.isArray(prev?.rows) ? prev.rows : [], parsed.rows);
    localStorage.setItem(
      key,
      JSON.stringify({ rows: merged, scrapedAt: parsed.scrapedAt || new Date().toLocaleString('vi-VN') })
    );
    cached = { projectId: m[2], added: parsed.rows.length };
    history.replaceState(null, '', location.pathname + location.search);
  } catch (e) {
    console.warn('Hash import failed', e);
  }
  return cached;
}
