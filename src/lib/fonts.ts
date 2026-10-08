import { Geist, Geist_Mono, Instrument_Serif, JetBrains_Mono } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

// Only the g/s mark uses it, so a single weight is enough.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

/** Class names that expose the font families as CSS variables. */
export const fontVariables = `${geist.variable} ${geistMono.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`
