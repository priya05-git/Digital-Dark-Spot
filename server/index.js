// Minimal API: fetches a URL server-side (browsers block cross-site fetches) and returns clean text + date.
import http from 'node:http';
const PORT = process.env.PORT || 3001;
const PRIVATE = /^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|0\.|\[?::1)/i;
const strip = (h) => h.replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<\/(p|div|li|h\d|tr|br)>/gi, '.\n').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/[ \t]+/g, ' ').replace(/\.\s*\.+/g, '.').trim();

async function grab(raw) {
  const u = new URL(raw);
  if (!/^https?:$/.test(u.protocol) || PRIVATE.test(u.hostname)) throw new Error('Only public http(s) URLs are allowed');
  const r = await fetch(u, { headers: { 'User-Agent': 'DigitalDarkSpot/2.0' }, signal: AbortSignal.timeout(10000) });
  const html = (await r.text()).slice(0, 1.5e6);
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || raw;
  const meta = (html.match(/(?:modified_time|datePublished|dateModified|published_time)["']?[^>]*?(?:content=|:)\s*["']([^"']+)/i) || [])[1];
  return { title: title.trim(), url: raw, date: meta || r.headers.get('last-modified') || '', text: strip(html).slice(0, 40000) };
}
http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  res.setHeader('Content-Type', 'application/json');
  if (u.pathname !== '/api/fetch') { res.writeHead(404); return res.end('{"error":"not found"}'); }
  try { res.writeHead(200); res.end(JSON.stringify(await grab(u.searchParams.get('url') || ''))); }
  catch (e) { res.writeHead(400); res.end(JSON.stringify({ error: e.message })); }
}).listen(PORT, () => console.log(`API ready on http://localhost:${PORT}`));
