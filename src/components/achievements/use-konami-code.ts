import { useEffect } from 'react'

const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

export function useKonamiCode(onComplete: () => void) {
  useEffect(() => {
    let position = 0

    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key

      if (key === SEQUENCE[position]) {
        position += 1
      } else {
        position = key === SEQUENCE[0] ? 1 : 0
      }

      if (position === SEQUENCE.length) {
        position = 0
        onComplete()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onComplete])
}
