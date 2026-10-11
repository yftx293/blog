import { readFileSync } from 'node:fs'
import { afterEach, describe, expect, test } from 'bun:test'

import { sectionMetadata } from '../lib/seo/metadata'
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
      'yftx293/AiNativeCrm',
      'yftx293/miniclaw',
      'yftx293/folio'
    ])
    expect(en.map((repo) => repo.fullName)).toEqual(zh.map((repo) => repo.fullName))
    expect(zh.every((repo) => repo.stars === 0)).toBe(true)
    expect(zh[0].description).toContain('CRM')
    expect(en[0].description).toContain('CRM')
    expect(zh[1].description).toContain('Pi Agent Runtime')
    expect(en[1].description).toContain('Pi Agent Runtime')
    expect(zh[2].description).toContain('不提供交易能力')
    expect(en[2].description).toContain('no trading functionality')
    expect(zh.map((repo) => repo.href)).toEqual(
      zh.map((repo) => `https://github.com/${repo.fullName}`)
    )
  })

  test('network failures and non-success responses leave stars unknown', async () => {
    setFetch(async (url) => {
      if (url.endsWith('/AiNativeCrm')) throw new Error('offline')
      return new Response(null, { status: 403 })
    })
    expect((await getPortfolioRepos('zh')).every((repo) => repo.stars === null)).toBe(true)
  })

  test('missing or invalid counts are never fabricated; real counts remain intact', async () => {
    setFetch(async (url) =>
      Response.json(
        url.endsWith('/AiNativeCrm')
          ? { stargazers_count: 7 }
          : url.endsWith('/folio')
            ? { stargazers_count: -1 }
            : {}
      )
    )
    expect((await getPortfolioRepos('en')).map((repo) => repo.stars)).toEqual([7, null, null])
  })

  test('a private repository remains listed without an invented star count', async () => {
    setFetch(async (url) =>
      url.endsWith('/miniclaw')
        ? new Response(null, { status: 404 })
        : Response.json({ stargazers_count: 0 })
    )
    const repos = await getPortfolioRepos('zh')
    expect(repos[1].fullName).toBe('yftx293/miniclaw')
    expect(repos[1].href).toBe('https://github.com/yftx293/miniclaw')
    expect(repos.map((repo) => repo.stars)).toEqual([0, null, 0])
  })

  test('localized project pages and alternate showcases use the current projects', () => {
    const names = ['AiNativeCrm', 'miniclaw', 'folio']
    const files = [
      '../pages/projects/index.astro',
      '../pages/en/projects/index.astro',
      '../components/home/ImmersiveHome.astro',
      '../components/v3/V3Home.astro',
      '../components/intro/variants/JoJoIntro.astro'
    ]
    for (const file of files) {
      const source = readFileSync(new URL(file, import.meta.url), 'utf8')
      expect(source).not.toMatch(
        /tinycode|enterprise-customer-service-agentic-rag|qiniu-xengineer-ai-pr-review/
      )
      for (const name of names) expect(source).toContain(name)
    }
    for (const path of ['/projects', '/en/projects']) {
      for (const name of names) expect(sectionMetadata(path)?.description).toContain(name)
    }
  })

  test('each project has matching dark and light overview assets', () => {
    for (const name of ['AiNativeCrm', 'miniclaw', 'folio']) {
      for (const variant of ['', '-light']) {
        const svg = readFileSync(
          new URL(`../../public/images/projects/${name}${variant}.svg`, import.meta.url),
          'utf8'
        )
        expect(svg).toContain(`<title id="title">${name} — technical overview</title>`)
        expect(svg).toContain('Conceptual illustration, not an application screenshot.')
        expect(svg).toContain('viewBox="0 0 1200 760"')
      }
    }
  })
})
