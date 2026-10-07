import type { FsNode } from './types'

/**
 * Client-side counterpart to `buildSiteFs` (server.ts). Fetches the same
 * tree from the public /api/knowledge/index.json endpoint instead of
 * having each island embed its own server-rendered copy in the page HTML.
 * The in-flight/resolved promise is cached so callers on the same page share
 * one network request instead of re-fetching the content manifest.
 */
let pending: Promise<FsNode> | null = null

export function fetchSiteFs(): Promise<FsNode> {
  if (!pending) {
    pending = fetch('/api/knowledge/index.json')
      .then((res) => {
        if (!res.ok) throw new Error(`fs fetch failed: ${res.status}`)
        return res.json() as Promise<{ tree: FsNode }>
      })
      .then((payload) => payload.tree)
      .catch((err) => {
        pending = null
        throw err
      })
  }
  return pending
}
