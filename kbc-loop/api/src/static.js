// Serveert de gebouwde web (en de web-versie van de app onder /app/) in productie.
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize, resolve, sep } from 'node:path'
import { CONTENT_SECURITY_POLICY, SECURITY_HEADERS } from './security.js'

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.webp': 'image/webp', '.gif': 'image/gif',
  '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json', '.mp4': 'video/mp4',
}

export function staticFiles(dir, extraHeaders = {}) {
  const root = resolve(dir)
  const inside = (file) => file === root || file.startsWith(root + sep)

  return async function serve(res, pathname) {
    let rel
    try { rel = decodeURIComponent(pathname) } catch { rel = '/' }
    let file = normalize(join(root, rel))
    if (!inside(file)) file = join(root, 'index.html')
    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html')
      await stat(file)
    } catch {
      // Onbekend pad: toon de juiste index (app onder /app/, anders de web)
      file = join(root, rel === '/app' || rel.startsWith('/app/') ? 'app/index.html' : 'index.html')
    }
    const type = MIME[extname(file)]
    if (!type) { res.writeHead(404, SECURITY_HEADERS); return res.end() }
    try {
      const body = await readFile(file)
      const immutable = /[/\\](assets|_expo)[/\\]/.test(file)
      res.writeHead(200, {
        'content-type': type,
        'cache-control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
        'content-security-policy': CONTENT_SECURITY_POLICY,
        ...SECURITY_HEADERS, ...extraHeaders,
      })
      res.end(body)
    } catch {
      res.writeHead(404, SECURITY_HEADERS); res.end()
    }
  }
}
