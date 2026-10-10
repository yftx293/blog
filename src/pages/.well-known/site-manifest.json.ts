import type { APIRoute } from 'astro'

import { ROOT_LABEL } from '@/components/terminal/fs/content'
import { buildSiteFs } from '@/components/terminal/fs/server'

/**
 * Public agent-facing manifest (RFC 8615 well-known URI).
 *
 * External agents — ChatGPT, Claude, custom bots — can fetch this once
 * to learn the structure of this site without crawling. The same tree
 * the dev-mode terminal renders is exposed here, plus a description
 * and a small dictionary of follow-up endpoints.
 *
 * Companion skill: see the site’s terminal command system.
 */

const instructions = (origin: string) => `You're reading a structured map of Yu's personal site.

Quick start:
  - Read the "instructions" field (this) and "description" field for context.
  - Walk "tree" — it mirrors a Unix-style filesystem. Files have either
    "content" (inline text, ready to read) or "endpoint" (URL to fetch
    full content).
  - For endpoint-backed entries, GET "<endpoint>" returns metadata plus
    { markdown, html, headings } for indexing and retrieval.
  - Use "content_hash" and "updated_at" on each entry for incremental sync.
  - Resolve link nodes via their "href" field.

Suggested first reads: /about, /now, /README. Then ls /blog, /notes,
/curated and /talks for knowledge entries.

If you're a human exploring this URL: there's a richer interactive
version at ${origin} — press \` (backtick) to open dev mode.`

export const GET: APIRoute = async ({ url }) => {
  const SITE_URL = url.origin
  const tree = await buildSiteFs()

  const manifest = {
    version: '0.1',
    name: ROOT_LABEL,
    site: SITE_URL,
    description:
      'Yu — AI Agent & Full-Stack Developer. Information and Computing Science undergraduate. ' +
      'Exploring AI agents, coding agents, LLM applications and engineering systems; learning backend and AI Infra. ' +
      'Technical learning, project practice, source-code reading, and thoughts live in a pseudo-FS: ' +
      'posts, notes, curated reads, talks, and contact links can be read with cat or fetched.',
    instructions: instructions(SITE_URL),
    tree,
    endpoints: {
      content_entry: {
        url: `${SITE_URL}/api/knowledge/content/<collection>/<id>`,
        method: 'GET',
        format: 'json',
        collections: ['blog', 'blog_en', 'notes', 'notes_en', 'curated', 'talks'],
        fields: ['markdown', 'html', 'headings', 'frontmatter', 'content_hash', 'updated_at'],
        note:
          'Always use the `endpoint` field from a node directly — do not ' +
          'construct the URL from the FsNode `name`. Astro collection ids, translated ' +
          'routes, and FS-safe names can diverge. The dir-level `meta.endpoint` ' +
          'mirrors the `post` child for convenience.'
      },
      legacy_blog_post: {
        url: `${SITE_URL}/api/blog/<id>`,
        method: 'GET',
        format: 'json',
        fields: ['html', 'headings'],
        note: 'Legacy endpoint kept for the terminal viewer; prefer content_entry for indexing.'
      },
      well_known_manifest: {
        url: `${SITE_URL}/.well-known/site-manifest.json`,
        method: 'GET',
        format: 'json',
        note: 'this document'
      },
      knowledge_index: {
        url: `${SITE_URL}/api/knowledge/index.json`,
        method: 'GET',
        format: 'json',
        note: 'same tree with RAG-oriented sync instructions'
      }
    },
    links: {
      site: SITE_URL,
      github: 'https://github.com/yftx293',
      rss: `${SITE_URL}/rss.xml`,
      sitemap: `${SITE_URL}/sitemap-index.xml`
    },
    generated_at: new Date().toISOString()
  }

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // 5 min in browser / agent caches; 1 day at the CDN.
      'cache-control': 'public, max-age=300, s-maxage=86400',
      // Agents commonly fetch from a different origin (their own UI).
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, OPTIONS',
      'x-robots-tag': 'all'
    }
  })
}

export const OPTIONS: APIRoute = () =>
  new Response(null, {
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, OPTIONS',
      'access-control-max-age': '86400'
    }
  })
