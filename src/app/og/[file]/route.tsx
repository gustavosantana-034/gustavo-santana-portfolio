import { ImageResponse } from 'next/og'

import { profile } from '@/data/profile'
import { getContent } from '@/i18n'
import type { Locale } from '@/i18n/config'

// Served as /og/pt-br.png and /og/en.png. A route handler (instead of
// opengraph-image.tsx) so the static export writes files with a real .png
// extension, which static hosts and the LinkedIn crawler need.

export const dynamic = 'force-static'
export const dynamicParams = false

const files: Record<string, Locale> = { 'pt-br.png': 'pt-BR', 'en.png': 'en' }

export function generateStaticParams() {
  return Object.keys(files).map((file) => ({ file }))
}

const size = { width: 1200, height: 630 }

type FontWeight = 400 | 600 | 700

/**
 * Downloads only the glyphs the image uses from Google Fonts, at build time.
 * Without a network the image still renders, with the default font.
 */
async function loadFont(family: string, weight: FontWeight, text: string, italic = false) {
  try {
    const axis = italic ? `ital,wght@1,${weight}` : `wght@${weight}`
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:${axis}&text=${encodeURIComponent(text)}`,
    ).then((response) => response.text())
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1]
    if (!url) return null
    const data = await fetch(url).then((response) => response.arrayBuffer())
    return { name: family, data, weight, style: italic ? ('italic' as const) : ('normal' as const) }
  } catch {
    return null
  }
}

const colors = {
  bg: '#f3f0e8',
  ink: '#1a1915',
  muted: '#57534a',
  border: '#dcd6c8',
  accent: '#a8300c',
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  const { meta, hero } = getContent(files[file] ?? 'pt-BR')
  const [before, commit, after] = hero.titleLine2
  const allText = [
    profile.name,
    meta.ogSubtitle,
    hero.titleLine1,
    before,
    after,
    ...meta.ogLayers,
  ].join(' ')

  const fonts = (
    await Promise.all([
      loadFont('Geist', 700, allText),
      loadFont('Geist', 400, allText),
      loadFont('Instrument Serif', 400, commit, true),
      loadFont('JetBrains Mono', 700, 'g/s'),
    ])
  ).filter((font) => font !== null)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: colors.bg,
          color: colors.ink,
          fontFamily: 'Geist, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 10,
              background: colors.ink,
              color: colors.bg,
              fontSize: 26,
              fontWeight: 700,
              fontFamily: 'JetBrains Mono',
            }}
          >
            g<span style={{ color: '#ff7a4d' }}>/</span>s
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 30, fontWeight: 700 }}>{profile.name}</span>
            <span style={{ fontSize: 22, fontWeight: 400, color: colors.muted }}>
              {meta.ogSubtitle}
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 112,
            fontWeight: 700,
            letterSpacing: -5,
            lineHeight: 1,
          }}
        >
          <span>{hero.titleLine1}</span>
          <span style={{ display: 'flex' }}>
            {before.trim()}&nbsp;
            <span
              style={{
                color: colors.accent,
                fontFamily: 'Instrument Serif',
                fontStyle: 'italic',
                fontWeight: 400,
                letterSpacing: -2,
              }}
            >
              {commit}
            </span>
            {after}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 22 }}>
          {meta.ogLayers.map((layer, index) => (
            <div key={layer} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span
                style={{
                  padding: '8px 16px',
                  border: `1.5px solid ${colors.border}`,
                  borderTop: `3px solid ${index === 2 ? colors.accent : colors.ink}`,
                  borderRadius: 6,
                }}
              >
                {layer}
              </span>
              {index < meta.ogLayers.length - 1 && <span style={{ color: colors.accent }}>→</span>}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts },
  )
}
