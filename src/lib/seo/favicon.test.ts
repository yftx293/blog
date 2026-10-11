import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'bun:test'
import sharp from 'sharp'

const prefix = 'yu-github-20261011'
const assets = new URL('../../../public/favicon/', import.meta.url)
const readAsset = (name: string) => readFileSync(new URL(name, assets))

describe('GitHub avatar favicon', () => {
  test('PNG icon files have the expected format and dimensions', async () => {
    for (const size of [16, 32, 180, 192, 512]) {
      const metadata = await sharp(readAsset(`${prefix}-${size}x${size}.png`)).metadata()
      expect(metadata.format).toBe('png')
      expect(metadata.width).toBe(size)
      expect(metadata.height).toBe(size)
    }
  })

  test('ICO contains the same 16px and 32px PNG frames', () => {
    const ico = readAsset(`${prefix}.ico`)
    expect(ico.readUInt16LE(0)).toBe(0)
    expect(ico.readUInt16LE(2)).toBe(1)
    expect(ico.readUInt16LE(4)).toBe(2)
    for (const [index, size] of [16, 32].entries()) {
      const entry = 6 + index * 16
      const length = ico.readUInt32LE(entry + 8)
      const offset = ico.readUInt32LE(entry + 12)
      expect(ico[entry]).toBe(size)
      expect(ico[entry + 1]).toBe(size)
      expect(ico.subarray(offset, offset + length)).toEqual(
        readAsset(`${prefix}-${size}x${size}.png`)
      )
    }
  })

  test('shared head, config and manifest reference the local GitHub icons', () => {
    const head = readFileSync(new URL('../../components/BaseHead.astro', import.meta.url), 'utf8')
    const config = readFileSync(new URL('../../site.config.ts', import.meta.url), 'utf8')
    const manifest = JSON.parse(readAsset('site.webmanifest').toString())
    expect(config).toContain(`/favicon/${prefix}.ico`)
    for (const file of [
      `${prefix}.ico`,
      `${prefix}-16x16.png`,
      `${prefix}-32x32.png`,
      `${prefix}-180x180.png`
    ]) {
      expect(head).toContain(`/favicon/${file}`)
    }
    expect(head).toContain(`/favicon/site.webmanifest?v=${prefix}`)
    expect(head).not.toMatch(/\/favicon\/(?:favicon(?:-\d+x\d+\.png|\.ico)|apple-touch-icon\.png)/)
    expect(manifest.name).toBe("Yu's Blog")
    expect(manifest.icons.map((icon: { src: string }) => icon.src)).toEqual([
      `/favicon/${prefix}-192x192.png`,
      `/favicon/${prefix}-512x512.png`
    ])
    for (const icon of manifest.icons) {
      expect(icon.type).toBe('image/png')
      expect(readAsset(icon.src.split('/').pop()).length).toBeGreaterThan(0)
    }
  })
})
