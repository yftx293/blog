import { afterEach, describe, expect, test } from 'bun:test'

import { getPortfolioRepos } from './portfolio-repos'

const originalFetch = globalThis.fetch
afterEach(() => {
  globalThis.fetch = originalFetch
})

function setFetch(handler: (url: string) => Promise<Response>) {
  globalThis.fetch = ((url: string | URL | Request) => handler(String(url))) as typeof fetch
}

describe('personal portfolio', () => {
  test('both locales show only the three confirmed Yu repositories', async () => {
    setFetch(async () => Response.json({ stargazers_count: 0 }))
    const zh = await getPortfolioRepos('zh')
    const en = await getPortfolioRepos('en')
    expect(zh.map((repo) => repo.fullName)).toEqual([
      'yftx293/tinycode',
      'yftx293/enterprise-customer-service-agentic-rag',
      'yftx293/qiniu-xengineer-ai-pr-review'
    ])
    expect(en.map((repo) => repo.fullName)).toEqual(zh.map((repo) => repo.fullName))
    expect(zh.every((repo) => repo.stars === 0)).toBe(true)
    expect(zh[0].description).toContain('Pi Agent Core')
    expect(en[0].description).toContain('Pi Agent Core')
  })

  test('network failures and non-success responses leave stars unknown', async () => {
    setFetch(async (url) => {
      if (url.endsWith('/tinycode')) throw new Error('offline')
      return new Response(null, { status: 403 })
    })
    expect((await getPortfolioRepos('zh')).every((repo) => repo.stars === null)).toBe(true)
  })

  test('missing or invalid counts are never fabricated; real counts remain intact', async () => {
    setFetch(async (url) =>
      Response.json(
        url.endsWith('/tinycode')
          ? { stargazers_count: 7 }
          : url.endsWith('/qiniu-xengineer-ai-pr-review')
            ? { stargazers_count: -1 }
            : {}
      )
    )
    expect((await getPortfolioRepos('en')).map((repo) => repo.stars)).toEqual([7, null, null])
  })
})
