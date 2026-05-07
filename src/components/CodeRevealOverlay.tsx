'use client'

import { useEffect, useRef, useState } from 'react'

type PointerState = {
  x: number
  y: number
  target: HTMLElement | null
}

type TokenType = 'bracket' | 'tag' | 'attr' | 'string' | 'text'

type Token = {
  text: string
  type: TokenType
}

const PANEL_WIDTH = 360
const PANEL_HEIGHT = 188
const PANEL_PADDING = 16
const LINE_HEIGHT = 18
const MAX_LINES = 7
const MAX_LINE_CHARS = 62

const IGNORED_TAGS = new Set([
  'HTML',
  'BODY',
  'SCRIPT',
  'STYLE',
  'CANVAS',
  'SVG',
  'PATH',
])

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function isInspectableElement(element: HTMLElement | null) {
  if (!element) return false
  if (IGNORED_TAGS.has(element.tagName)) return false
  if (element.closest('[data-code-reveal-ignore="true"]')) return false

  const rect = element.getBoundingClientRect()
  if (rect.width < 24 || rect.height < 16) return false

  return true
}

function compactClassName(className: string) {
  return className
    .split(/\s+/)
    .filter(Boolean)
    .filter(cls => !cls.includes('motion-') && !cls.startsWith('data-['))
    .slice(0, 5)
    .join(' ')
}

function getElementSnippet(element: HTMLElement): string[] {
  const tag = element.tagName.toLowerCase()
  const attrs: string[] = []
  const id = element.getAttribute('id')
  const href = element.getAttribute('href')
  const ariaLabel = element.getAttribute('aria-label')
  const role = element.getAttribute('role')
  const className = compactClassName(element.className || '')
  const text = (element.innerText || element.textContent || '').replace(/\s+/g, ' ').trim()

  if (id) attrs.push(`id="${id}"`)
  if (role) attrs.push(`role="${role}"`)
  if (ariaLabel) attrs.push(`aria-label="${ariaLabel}"`)
  if (href) attrs.push(`href="${href}"`)
  if (className) attrs.push(`class="${className}"`)

  const open = `<${tag}${attrs.length ? ` ${attrs.join(' ')}` : ''}>`
  const close = `</${tag}>`
  const content = text && !['input', 'img', 'br'].includes(tag)
    ? text.slice(0, 120)
    : ''

  const lines = content
    ? [open, `  ${content}`, close]
    : [open.replace(/>$/, ' />')]

  return lines.map(line => (
    line.length > MAX_LINE_CHARS ? `${line.slice(0, MAX_LINE_CHARS - 1)}…` : line
  ))
}

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = []
  const attrRegex = /(<\/?|\/?>)|([a-zA-Z][\w:-]*)(=)("[^"]*")|([a-zA-Z][\w:-]*)|([^<>\s=]+)/g
  let match: RegExpExecArray | null

  while ((match = attrRegex.exec(line)) !== null) {
    const [text, bracket, attrWithValue, equals, stringValue, bareWord, other] = match

    if (bracket) {
      tokens.push({ text: bracket, type: 'bracket' })
    } else if (attrWithValue) {
      tokens.push({ text: attrWithValue, type: tokens.length <= 1 ? 'tag' : 'attr' })
      tokens.push({ text: equals, type: 'bracket' })
      tokens.push({ text: stringValue, type: 'string' })
    } else if (bareWord) {
      tokens.push({ text: bareWord, type: tokens.length <= 1 ? 'tag' : 'attr' })
    } else if (other) {
      tokens.push({ text, type: 'text' })
    }

    const nextChar = line[attrRegex.lastIndex]
    if (nextChar === ' ') tokens.push({ text: ' ', type: 'text' })
  }

  return tokens.length ? tokens : [{ text: line, type: 'text' }]
}

export default function CodeRevealOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerRef = useRef<PointerState>({ x: -1000, y: -1000, target: null })
  const frameRef = useRef<number | null>(null)
  const opacityRef = useRef(0)
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === 'x') {
        setIsEnabled(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isEnabled) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!isFinePointer || prefersReducedMotion) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const getPanelPosition = (x: number, y: number) => {
      const side = x + PANEL_WIDTH + 28 <= window.innerWidth ? 22 : -PANEL_WIDTH - 22
      return {
        x: clamp(x + side, 14, window.innerWidth - PANEL_WIDTH - 14),
        y: clamp(y - 44, 14, window.innerHeight - PANEL_HEIGHT - 14),
      }
    }

    const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
    }

    const colorForToken = (type: TokenType, dark: boolean) => {
      if (dark) {
        return {
          bracket: 'rgba(148, 163, 184, 0.72)',
          tag: 'rgba(94, 234, 212, 0.94)',
          attr: 'rgba(191, 219, 254, 0.9)',
          string: 'rgba(253, 224, 71, 0.88)',
          text: 'rgba(226, 232, 240, 0.76)',
        }[type]
      }

      return {
        bracket: 'rgba(71, 85, 105, 0.68)',
        tag: 'rgba(15, 118, 110, 0.95)',
        attr: 'rgba(67, 56, 202, 0.86)',
        string: 'rgba(146, 64, 14, 0.86)',
        text: 'rgba(30, 41, 59, 0.72)',
      }[type]
    }

    const draw = () => {
      const { x, y, target } = pointerRef.current
      const shouldShow = isInspectableElement(target) && x >= 0 && y >= 0
      const opacityTarget = shouldShow ? 1 : 0
      opacityRef.current += (opacityTarget - opacityRef.current) * 0.18

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      if (opacityRef.current > 0.01 && target) {
        const alpha = opacityRef.current
        const dark = document.body.getAttribute('data-theme')?.includes('dark') ?? false
        const rect = target.getBoundingClientRect()
        const panel = getPanelPosition(x, y)
        const lines = getElementSnippet(target).slice(0, MAX_LINES)

        ctx.save()
        ctx.globalAlpha = alpha

        // Element outline
        ctx.strokeStyle = dark ? 'rgba(94, 234, 212, 0.52)' : 'rgba(15, 118, 110, 0.48)'
        ctx.lineWidth = 1
        drawRoundedRect(rect.left - 4, rect.top - 4, rect.width + 8, rect.height + 8, 10)
        ctx.stroke()

        // Thin pointer connector
        ctx.strokeStyle = dark ? 'rgba(148, 163, 184, 0.28)' : 'rgba(71, 85, 105, 0.22)'
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(panel.x + (panel.x > x ? 0 : PANEL_WIDTH), panel.y + 44)
        ctx.stroke()

        // Panel shadow and frame
        ctx.shadowColor = 'rgba(15, 23, 42, 0.18)'
        ctx.shadowBlur = 22
        ctx.shadowOffsetY = 12
        ctx.fillStyle = dark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.91)'
        drawRoundedRect(panel.x, panel.y, PANEL_WIDTH, PANEL_HEIGHT, 14)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0
        ctx.strokeStyle = dark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(15, 118, 110, 0.14)'
        ctx.stroke()

        // Header rule
        ctx.fillStyle = dark ? 'rgba(94, 234, 212, 0.86)' : 'rgba(15, 118, 110, 0.82)'
        ctx.font = '700 11px ui-sans-serif, system-ui, sans-serif'
        ctx.letterSpacing = '0px'
        ctx.fillText(target.tagName.toLowerCase(), panel.x + PANEL_PADDING, panel.y + 24)

        ctx.strokeStyle = dark ? 'rgba(148, 163, 184, 0.14)' : 'rgba(15, 118, 110, 0.1)'
        ctx.beginPath()
        ctx.moveTo(panel.x + PANEL_PADDING, panel.y + 38)
        ctx.lineTo(panel.x + PANEL_WIDTH - PANEL_PADDING, panel.y + 38)
        ctx.stroke()

        ctx.font = '500 12px "Geist Mono", "JetBrains Mono", Consolas, monospace'
        lines.forEach((line, index) => {
          const yPos = panel.y + 62 + index * LINE_HEIGHT
          let xPos = panel.x + PANEL_PADDING

          ctx.fillStyle = dark ? 'rgba(148, 163, 184, 0.34)' : 'rgba(71, 85, 105, 0.32)'
          ctx.textAlign = 'right'
          ctx.fillText(String(index + 1), xPos + 13, yPos)
          ctx.textAlign = 'left'

          xPos += 28
          for (const token of tokenizeLine(line)) {
            ctx.fillStyle = colorForToken(token.type, dark)
            ctx.fillText(token.text, xPos, yPos)
            xPos += ctx.measureText(token.text).width
          }
        })

        ctx.restore()
      }

      frameRef.current = requestAnimationFrame(draw)
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rawTarget = event.target instanceof HTMLElement ? event.target : null
      const target = rawTarget?.closest('a, button, article, section, div, header, main, form, input, textarea, h1, h2, h3, p, span') as HTMLElement | null
      pointerRef.current = {
        x: event.clientX,
        y: event.clientY,
        target: isInspectableElement(target) ? target : rawTarget,
      }
    }

    const handlePointerLeave = () => {
      pointerRef.current = { x: -1000, y: -1000, target: null }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    document.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('pointerleave', handlePointerLeave)
    frameRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerleave', handlePointerLeave)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    }
  }, [isEnabled])

  if (!isEnabled) return null

  return (
    <canvas
      ref={canvasRef}
      data-code-reveal-ignore="true"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        pointerEvents: 'none',
      }}
    />
  )
}
