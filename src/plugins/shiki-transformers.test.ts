import { describe, expect, test } from 'bun:test'
import { codeToHtml } from 'shiki'

import { addCopyButton, addLanguage, addTitle, updateStyle } from './shiki-transformers'

async function renderCode() {
  return codeToHtml('const value = 42', {
    lang: 'ts',
    theme: 'github-light',
    transformers: [updateStyle(), addTitle(), addLanguage(), addCopyButton(2000)]
  })
}

// Execute the actual emitted handler: clipboard is the only external boundary.
async function copyFixture(writeText: (text: string) => Promise<void>, lang = 'en') {
  const html = await renderCode()
  const handler = html
    .match(/onclick="([^"]+)"/)![1]
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&#x26;', '&')
    .replaceAll('&amp;', '&')
  const classes = new Set<string>()
  const attributes = new Map<string, string>()
  const button = {
    dataset: { code: 'const value = 42' },
    disabled: false,
    classList: { add: (s: string) => classes.add(s), remove: (s: string) => classes.delete(s) },
    setAttribute: (k: string, v: string) => attributes.set(k, v)
  }
  const reset: (() => void)[] = []
  const run = new Function('navigator', 'document', 'setTimeout', handler)
  const retry = () =>
    run.call(
      button,
      { clipboard: { writeText } },
      { documentElement: { lang } },
      (callback: () => void) => reset.push(callback)
    )
  const pending = retry()
  return { button, classes, attributes, pending, reset, retry }
}

describe('code copy feedback', () => {
  test('code copy control is named and does not submit a surrounding form', async () => {
    const html = await renderCode()
    expect(html).toContain('type="button"')
    expect(html).toContain('aria-label="Copy code"')
  })

  test('success is shown only after the clipboard write resolves', async () => {
    let resolve!: () => void
    let written = ''
    const f = await copyFixture((text) => {
      written = text
      return new Promise<void>((done) => {
        resolve = done
      })
    })
    expect(written).toBe('const value = 42')
    expect(f.classes.has('copied')).toBe(false)
    expect(f.button.disabled).toBe(true)
    resolve()
    await f.pending
    expect(f.classes.has('copied')).toBe(true)
    expect(f.attributes.get('aria-label')).toBe('Copied')
    f.reset.forEach((callback) => callback())
    expect(f.classes.has('copied')).toBe(false)
    expect(f.button.disabled).toBe(false)
  })

  test('denied clipboard access reports failure without a false success', async () => {
    const f = await copyFixture(async () => {
      throw new Error('denied')
    }, 'zh-CN')
    await f.pending
    expect(f.classes.has('copied')).toBe(false)
    expect(f.button.dataset).toHaveProperty('copyState', 'error')
    expect(f.attributes.get('aria-label')).toBe('复制失败，请手动选择代码')
    expect(f.button.disabled).toBe(false)
  })

  test('an earlier failed attempt cannot reset a successful retry', async () => {
    let attempts = 0
    const f = await copyFixture(async () => {
      if (++attempts === 1) throw new Error('denied')
    })
    await f.pending
    await f.retry()
    f.reset[0]()
    expect(f.classes.has('copied')).toBe(true)
    expect(f.button.disabled).toBe(true)
    f.reset[1]()
    expect(f.classes.has('copied')).toBe(false)
    expect(f.button.disabled).toBe(false)
  })
})
