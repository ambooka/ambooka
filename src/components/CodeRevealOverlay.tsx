/**
 * X-Ray Code Inspector - Premium Animation Effects
 * Enhanced with particle trails, scan lines, and spring physics
 */

'use client'

import { useEffect, useRef, useState } from 'react'

interface CharacterInfo {
  char: string
  lineIndex: number
  columnIndex: number
  element: HTMLElement
  textNode: Text | null
}

interface CaretPosition {
  offsetNode: Node
  offset: number
}

declare global {
  interface Document {
    caretPositionFromPoint(x: number, y: number): CaretPosition | null
  }
}

interface Token {
  text: string
  type: 'tag' | 'attr' | 'string' | 'comment' | 'text' | 'keyword'
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

export default function CodeRevealOverlay() {
  const codeCanvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null)
  const [currentChar, setCurrentChar] = useState<CharacterInfo | null>(null)
  const [isEnabled, setIsEnabled] = useState(true)


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + X to toggle
      if (e.altKey && e.key.toLowerCase() === 'x') {
        setIsEnabled(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const canvas = codeCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // If disabled, clear canvas and stop
    if (!isEnabled) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    // Smoke particle system - covers code and disperses on hover
    const MAX_PARTICLES = 100

    // Spring physics for smoother movement
    const springState = {
      targetX: 0,
      currentX: 0,
      targetY: 0,
      currentY: 0,
      targetRadius: 0,
      currentRadius: 0,
      velocityX: 0,
      velocityY: 0,
      velocityRadius: 0
    }

    // Scroll state for code position
    const scrollState = {
      targetX: 0,
      currentX: 0,
      targetY: 0,
      currentY: 0,
      velocityX: 0,
      velocityY: 0
    }

    // Transition state for smooth code changes
    const transitionState = {
      isTransitioning: false,
      progress: 0,
      duration: 300, // ms
      startTime: 0,
      previousCode: null as LineData[] | null,
      newCode: null as LineData[] | null
    }

    let currentMouseX = -1000
    let currentMouseY = -1000
    let currentHovered: HTMLElement | null = null
    let currentCharInfo: CharacterInfo | null = null
    let scanLineOffset = 0

    // Cache for the code string to avoid expensive re-parsing
    let cachedCode: string | null = null
    let lastHovered: HTMLElement | null = null
    let lastCharInfo: CharacterInfo | null = null

    const MAX_RADIUS = 160
    const SPRING_STIFFNESS = 0.15
    const SPRING_DAMPING = 0.85

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Enhanced easing functions
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    const easeOutElastic = (t: number): number => {
      const c4 = (2 * Math.PI) / 3
      return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
    }

    // Spring physics for natural motion
    const applySpring = (current: number, target: number, velocity: number): { value: number, velocity: number } => {
      const force = (target - current) * SPRING_STIFFNESS
      const damping = velocity * SPRING_DAMPING
      const acceleration = force - damping

      const newVelocity = velocity + acceleration
      const newValue = current + newVelocity

      return { value: newValue, velocity: newVelocity }
    }

    // Enhanced lerp with velocity
    const smoothLerp = (start: number, end: number, velocity: number, factor: number = 0.2): { value: number, velocity: number } => {
      const distance = end - start
      const speedFactor = Math.min(1, Math.abs(distance) / 500)
      const adjustedFactor = factor * (1 - speedFactor * 0.25)

      const newValue = start + distance * adjustedFactor
      const newVelocity = distance * adjustedFactor

      return { value: newValue, velocity: newVelocity }
    }

    // Get character at specific position using browser APIs
    const getCharacterAtPoint = (x: number, y: number): CharacterInfo | null => {
      try {
        let range: Range | null = null

        if (document.caretRangeFromPoint) {
          range = document.caretRangeFromPoint(x, y)
        } else if (document.caretPositionFromPoint) {
          const position = document.caretPositionFromPoint(x, y)
          if (position) {
            range = document.createRange()
            range.setStart(position.offsetNode, position.offset)
          }
        }

        if (!range) return null

        const node = range.startContainer
        const offset = range.startOffset

        if (node.nodeType !== Node.TEXT_NODE) return null

        const textNode = node as Text
        const text = textNode.textContent || ''

        if (offset >= text.length) return null

        const char = text[offset] || ''
        const element = textNode.parentElement
        if (!element) return null

        const elementText = element.textContent || ''
        const beforeText = elementText.substring(0, elementText.indexOf(text) + offset)
        const lines = beforeText.split('\n')
        const lineIndex = lines.length - 1
        const columnIndex = lines[lines.length - 1].length

        return { char, lineIndex, columnIndex, element, textNode }
      } catch (e) {
        return null
      }
    }

    // Tokenize and format HTML with syntax highlighting
    interface LineData {
      lineNumber: number
      tokens: Token[]
      isHighlighted: boolean
    }

    const tokenizeAndFormatHTML = (html: string, highlightLine: number = -1): LineData[] => {
      let indent = 0
      const tab = '  '
      const lines: LineData[] = []
      let currentLineNum = 1

      html = html.replace(/>\s+</g, '><').trim()
      const rawTokens = html.split(/(<[^>]+>)/g).filter(Boolean)

      rawTokens.forEach(token => {
        const lineTokens: Token[] = []

        // Indentation
        if (token.match(/^<\//)) {
          indent = Math.max(0, indent - 1)
        }

        // Add indentation token
        if (indent > 0) {
          lineTokens.push({ text: tab.repeat(indent), type: 'text' })
        }

        // Tokenize the tag/content
        if (token.startsWith('<')) {
          // It's a tag
          const tagMatch = token.match(/^<(\/?)(\w+)([\s\S]*?)(\/?)>$/)
          if (tagMatch) {
            const [, slash1, tagName, attrs, slash2] = tagMatch

            lineTokens.push({ text: '<' + slash1, type: 'tag' })
            lineTokens.push({ text: tagName, type: 'keyword' })

            // Parse attributes
            if (attrs) {
              const attrRegex = /(\s+)([\w-]+)(?:(=)("[^"]*"|'[^']*'))?/g
              let match
              let lastIndex = 0

              while ((match = attrRegex.exec(attrs)) !== null) {
                const [full, space, name, eq, value] = match
                lineTokens.push({ text: space, type: 'text' })
                lineTokens.push({ text: name, type: 'attr' })
                if (eq) lineTokens.push({ text: eq, type: 'text' })
                if (value) lineTokens.push({ text: value, type: 'string' })
                lastIndex = match.index + full.length
              }
            }

            lineTokens.push({ text: slash2 + '>', type: 'tag' })
          } else {
            // Fallback for complex tags
            lineTokens.push({ text: token, type: 'tag' })
          }

          if (!token.match(/^<\//) && !token.match(/\/>$/) && !token.match(/^<br/)) {
            indent++
          }
        } else {
          // It's text content
          const text = token.trim()
          if (text) {
            lineTokens.push({ text: text, type: 'text' })
          }
        }

        if (lineTokens.length > 0 && !(lineTokens.length === 1 && lineTokens[0].text.trim() === '')) {
          // Check if this line corresponds to the highlighted character's line
          // This is an approximation since we're re-formatting. 
          // Ideally we map original lines to formatted lines, but for now we rely on the passed index.
          // However, the previous logic passed highlightLine index based on formatted output.
          // We'll calculate isHighlighted in the draw loop or pass the correct index.
          // Actually, let's just push the line.
          lines.push({
            lineNumber: currentLineNum++,
            tokens: lineTokens,
            isHighlighted: false // Will be set later or ignored
          })
        }
      })

      return lines
    }

    // Cache for tokens
    let cachedLines: LineData[] | null = null

    const getElementCode = (element: HTMLElement, charInfo: CharacterInfo | null = null): LineData[] => {
      if (element === lastHovered && charInfo === lastCharInfo && cachedLines) {
        return cachedLines
      }

      const clone = element.cloneNode(true) as HTMLElement
      // We don't pass highlightLine here anymore, we determine it by char index mapping if possible
      // But since we reformatted, the line index from charInfo (which is based on original DOM text) 
      // might not match formatted lines 1:1. 
      // For now, let's just format it.
      const lines = tokenizeAndFormatHTML(clone.outerHTML)

      // Attempt to highlight the line corresponding to the cursor
      // This is tricky with reformatting. The previous implementation had a simplified mapping.
      // Let's rely on the charInfo.lineIndex if it matches our formatted lines count, 
      // or just highlight the line under the cursor position in the canvas.

      if (charInfo && charInfo.lineIndex < lines.length) {
        // This is a rough approximation. 
        // A better way is to highlight based on mouse Y relative to code scroll.
      }

      lastHovered = element
      lastCharInfo = charInfo
      cachedLines = lines
      return lines
    }



    let lastFrameTime = Date.now()

    const drawCodeLayer = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Calculate delta time for smooth animations
      const currentTime = Date.now()
      const deltaTime = Math.min((currentTime - lastFrameTime) / 1000, 0.1) // Cap at 100ms
      lastFrameTime = currentTime

      // Update scan line animation
      scanLineOffset = (scanLineOffset + 2) % 400

      // Spring physics for radius
      const targetR = (isEnabled && currentHovered) ? MAX_RADIUS : 0
      const radiusSpring = applySpring(springState.currentRadius, targetR, springState.velocityRadius)
      springState.currentRadius = radiusSpring.value
      springState.velocityRadius = radiusSpring.velocity

      if (springState.currentRadius < 1 || !currentHovered || currentMouseX < 0) return

      const rect = currentHovered.getBoundingClientRect()
      const lines = getElementCode(currentHovered, currentCharInfo)

      // Update transition progress
      if (transitionState.isTransitioning) {
        const elapsed = Date.now() - transitionState.startTime
        transitionState.progress = Math.min(elapsed / transitionState.duration, 1)

        // Use easeOutCubic for smooth transition
        const eased = 1 - Math.pow(1 - transitionState.progress, 3)

        if (transitionState.progress >= 1) {
          transitionState.isTransitioning = false
          transitionState.previousCode = null
        }
      }

      const circleX = currentMouseX
      const circleY = currentMouseY

      // SAVE CONTEXT
      ctx.save()

      // Breathing animation for the circle
      const breathe = (Math.sin(Date.now() / 1200) + 1) / 2
      const breatheScale = 1 + (breathe * 0.03) // 3% breathing effect

      // Realistic X-ray intensity flicker (like medical imaging)
      const flicker = 0.92 + (Math.random() * 0.08) // Random flicker between 92-100%
      const xrayIntensity = flicker * (0.95 + breathe * 0.05)

      // Character position indicator with pulsing glow
      const pulse = (Math.sin(Date.now() / 350) + 1) / 2
      const secondaryPulse = (Math.sin(Date.now() / 500 + Math.PI / 2) + 1) / 2

      // Check current theme
      const isDark = document.documentElement.getAttribute('data-theme')?.includes('dark') || false

      // Outer glow around entire reveal area for depth
      ctx.save()
      ctx.globalAlpha = 0.2 * breathe
      ctx.shadowBlur = 40
      ctx.shadowColor = isDark ? 'rgba(201, 169, 97, 0.6)' : 'rgba(142, 14, 40, 0.5)' // Gold for dark, burgundy for light
      ctx.strokeStyle = isDark ? 'rgba(201, 169, 97, 0.2)' : 'rgba(142, 14, 40, 0.15)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(circleX, circleY, springState.currentRadius * breatheScale, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      if (currentCharInfo) {
        const charPulse = easeInOutCubic(secondaryPulse)
        // Sync character box with breathing
        const boxScale = 1 + (breathe * 0.15)

        // Outer glow ring - burgundy for light mode, gold for dark mode
        ctx.shadowBlur = 12 + (charPulse * 8)
        ctx.shadowColor = isDark ? '#C9A961' : '#8E0E28' // Gold for dark, burgundy for light
        ctx.strokeStyle = isDark ? `rgba(201, 169, 97, ${0.3 + (charPulse * 0.2)})` : `rgba(142, 14, 40, ${0.4 + (charPulse * 0.3)})`
        ctx.lineWidth = 3
        const outerSize = 6 * boxScale
        ctx.strokeRect(circleX - outerSize, circleY - outerSize, outerSize * 2, outerSize * 2)

        // Inner indicator
        ctx.shadowBlur = 6
        ctx.strokeStyle = isDark ? `rgba(201, 169, 97, ${0.6 + (charPulse * 0.3)})` : `rgba(142, 14, 40, ${0.7 + (charPulse * 0.3)})`
        ctx.lineWidth = 2
        const innerSize = 3 * boxScale
        ctx.strokeRect(circleX - innerSize, circleY - innerSize, innerSize * 2, innerSize * 2)
      }

      // Draw code with ultra-dense x-ray aesthetic
      ctx.font = '11px "Fira Code", "JetBrains Mono", Consolas, Monaco, monospace'
      ctx.textAlign = 'left'
      ctx.shadowBlur = 0

      const lineHeight = 14
      const totalTextHeight = lines.length * lineHeight

      // Calculate max line width
      let maxLineWidth = 0
      lines.forEach(line => {
        const text = line.tokens.map(t => t.text).join('')
        const width = ctx.measureText(text).width
        if (width > maxLineWidth) maxLineWidth = width
      })

      // Target Scroll Calculation
      const relativeX = Math.max(0, Math.min(1, (currentMouseX - rect.left) / rect.width))
      const relativeY = Math.max(0, Math.min(1, (currentMouseY - rect.top) / rect.height))

      const diameter = springState.currentRadius * 2

      // Horizontal Target
      if (maxLineWidth <= diameter - 60) {
        scrollState.targetX = circleX - (maxLineWidth / 2)
      } else {
        const maxScrollX = maxLineWidth - diameter + 100
        const scrollOffsetX = relativeX * maxScrollX
        scrollState.targetX = (circleX - springState.currentRadius) - scrollOffsetX + 50
      }

      // Vertical Target
      if (totalTextHeight <= diameter) {
        scrollState.targetY = circleY - (totalTextHeight / 2) + (lineHeight * 0.7)
      } else {
        const maxScrollY = totalTextHeight - diameter
        const scrollOffsetY = relativeY * maxScrollY
        scrollState.targetY = (circleY - springState.currentRadius) - scrollOffsetY + 30
      }

      // Apply cinematic slow-motion scroll
      const xResult = smoothLerp(scrollState.currentX, scrollState.targetX, scrollState.velocityX, 0.12)
      const yResult = smoothLerp(scrollState.currentY, scrollState.targetY, scrollState.velocityY, 0.12)

      scrollState.currentX = xResult.value
      scrollState.velocityX = xResult.velocity
      scrollState.currentY = yResult.value
      scrollState.velocityY = yResult.velocity

      const startX = scrollState.currentX
      const startY = scrollState.currentY

      // REALISTIC X-RAY SCAN EFFECT
      ctx.save()

      // Apply subtle zoom like looking through x-ray lens
      ctx.translate(circleX, circleY)
      ctx.scale(1.08, 1.08)
      ctx.translate(-circleX, -circleY)

      // Draw code lines with syntax highlighting
      lines.forEach((line, i) => {
        const lineY = startY + i * lineHeight

        if (lineY > circleY - springState.currentRadius - 40 && lineY < circleY + springState.currentRadius + 40) {
          const distY = Math.abs(lineY - circleY)
          const fadeFactor = Math.max(0, 1 - Math.pow(distY / springState.currentRadius, 1.3))
          const opacity = 0.95 * fadeFactor * xrayIntensity // Apply x-ray flicker

          if (opacity > 0.02) {
            // Line Numbers Gutter (ultra-compact)
            const gutterWidth = 24
            const lineNumX = startX - gutterWidth

            ctx.fillStyle = isDark ? `rgba(200, 200, 200, ${opacity * 0.2})` : `rgba(60, 60, 60, ${opacity * 0.32})`
            ctx.textAlign = 'right'
            ctx.font = '9px "Fira Code", monospace'
            ctx.fillText(line.lineNumber.toString(), lineNumX - 2, lineY)

            // Draw Gutter Separator (very subtle)
            ctx.strokeStyle = `rgba(200, 200, 200, ${opacity * 0.08})`
            ctx.beginPath()
            ctx.moveTo(lineNumX, lineY - 12)
            ctx.lineTo(lineNumX, lineY + 4)
            ctx.stroke()

            // Highlight current line background (very subtle)
            if (line.lineNumber === (currentCharInfo?.lineIndex || -1) + 1) {
              const highlightPulse = (Math.sin(Date.now() / 300) + 1) / 2
              ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.06 + highlightPulse * 0.03})`
              ctx.fillRect(startX - gutterWidth, lineY - 13, maxLineWidth + gutterWidth + 20, lineHeight)
            }

            // Draw Tokens (ultra-dense x-ray style)
            let currentX = startX
            ctx.textAlign = 'left'
            ctx.font = '11px "Fira Code", "JetBrains Mono", Consolas, Monaco, monospace'
            const MAX_TEXT_WIDTH = 600 // Wider for dense multi-line content

            // Calculate transition opacity
            const transitionOpacity = transitionState.isTransitioning
              ? (1 - Math.pow(1 - transitionState.progress, 3)) // easeOutCubic
              : 1

            // Draw old code fading out during transition
            if (transitionState.isTransitioning && transitionState.previousCode && i < transitionState.previousCode.length) {
              const oldLine = transitionState.previousCode[i]
              let oldX = startX
              const fadeOutOpacity = 1 - transitionOpacity

              for (const token of oldLine.tokens) {
                // Check for truncation
                if (oldX - startX > MAX_TEXT_WIDTH) {
                  ctx.fillStyle = 'rgba(248, 248, 242, 0.3)'
                  ctx.globalAlpha = opacity * fadeOutOpacity
                  ctx.fillText('...', oldX, lineY)
                  ctx.globalAlpha = 1.0
                  break
                }

                // Theme-aware colors with higher opacity for light mode
                let color = isDark ? 'rgba(248, 248, 242, 0.3)' : 'rgba(60, 60, 60, 0.45)'
                switch (token.type) {
                  case 'tag': color = isDark ? 'rgba(255, 121, 198, 0.35)' : 'rgba(142, 14, 40, 0.55)'; break; // Burgundy
                  case 'attr': color = isDark ? 'rgba(80, 250, 123, 0.32)' : 'rgba(45, 95, 63, 0.5)'; break; // Dark green
                  case 'string': color = isDark ? 'rgba(241, 250, 140, 0.3)' : 'rgba(184, 134, 11, 0.5)'; break; // Dark gold
                  case 'comment': color = isDark ? 'rgba(98, 114, 164, 0.25)' : 'rgba(98, 114, 164, 0.4)'; break;
                  case 'keyword': color = isDark ? 'rgba(139, 233, 253, 0.35)' : 'rgba(142, 14, 40, 0.6)'; break; // Burgundy
                  case 'text': color = isDark ? 'rgba(248, 248, 242, 0.28)' : 'rgba(60, 60, 60, 0.42)'; break;
                }

                ctx.fillStyle = color
                ctx.globalAlpha = opacity * fadeOutOpacity
                ctx.fillText(token.text, oldX, lineY)
                oldX += ctx.measureText(token.text).width
                ctx.globalAlpha = 1.0
              }
            }

            // Draw new code
            for (const token of line.tokens) {
              // Check for truncation
              if (currentX - startX > MAX_TEXT_WIDTH) {
                ctx.fillStyle = 'rgba(248, 248, 242, 0.3)'
                const finalOpacity = transitionState.isTransitioning ? opacity * transitionOpacity : opacity
                ctx.globalAlpha = finalOpacity
                ctx.fillText('...', currentX, lineY)
                ctx.globalAlpha = 1.0
                break
              }

              // Theme-aware colors for new code
              let color = isDark ? 'rgba(248, 248, 242, 0.3)' : 'rgba(60, 60, 60, 0.45)'

              switch (token.type) {
                case 'tag': color = isDark ? 'rgba(255, 121, 198, 0.35)' : 'rgba(142, 14, 40, 0.55)'; break;      // Burgundy
                case 'attr': color = isDark ? 'rgba(80, 250, 123, 0.32)' : 'rgba(45, 95, 63, 0.5)'; break;      // Dark green
                case 'string': color = isDark ? 'rgba(241, 250, 140, 0.3)' : 'rgba(184, 134, 11, 0.5)'; break;    // Dark gold
                case 'comment': color = isDark ? 'rgba(98, 114, 164, 0.25)' : 'rgba(98, 114, 164, 0.4)'; break;   // Gray
                case 'keyword': color = isDark ? 'rgba(139, 233, 253, 0.35)' : 'rgba(142, 14, 40, 0.6)'; break;  // Burgundy
                case 'text': color = isDark ? 'rgba(248, 248, 242, 0.28)' : 'rgba(60, 60, 60, 0.42)'; break;     // Dark
              }

              ctx.fillStyle = color
              const finalOpacity = transitionState.isTransitioning ? opacity * transitionOpacity : opacity
              ctx.globalAlpha = finalOpacity
              ctx.fillText(token.text, currentX, lineY)
              currentX += ctx.measureText(token.text).width
              ctx.globalAlpha = 1.0
            }

            ctx.shadowBlur = 0
          }
        }
      })
      ctx.restore() // End x-ray scan effect

      // REALISTIC X-RAY SCAN LINES (moving)
      ctx.save()
      ctx.globalCompositeOperation = 'source-over'

      // Horizontal scan lines
      const scanSpeed = (Date.now() / 30) % (springState.currentRadius * 2)
      for (let i = -springState.currentRadius; i < springState.currentRadius; i += 4) {
        const lineY = circleY + i + scanSpeed - springState.currentRadius
        const distFromCenter = Math.abs(lineY - circleY)
        const scanOpacity = Math.max(0, 1 - distFromCenter / springState.currentRadius) * 0.08

        if (scanOpacity > 0.01) {
          ctx.strokeStyle = isDark ? `rgba(201, 169, 97, ${scanOpacity})` : `rgba(142, 14, 40, ${scanOpacity})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(circleX - springState.currentRadius, lineY)
          ctx.lineTo(circleX + springState.currentRadius, lineY)
          ctx.stroke()
        }
      }

      // X-ray noise/grain effect
      const noiseIntensity = 0.03 * breathe
      for (let n = 0; n < 15; n++) {
        const angle = Math.random() * Math.PI * 2
        const dist = Math.random() * springState.currentRadius * 0.8
        const noiseX = circleX + Math.cos(angle) * dist
        const noiseY = circleY + Math.sin(angle) * dist

        ctx.fillStyle = isDark
          ? `rgba(201, 169, 97, ${Math.random() * noiseIntensity})`
          : `rgba(142, 14, 40, ${Math.random() * noiseIntensity})`
        ctx.fillRect(noiseX, noiseY, 1, 1)
      }

      ctx.restore()

      // Ultra-smooth gradient mask with x-ray glow
      ctx.globalCompositeOperation = 'destination-in'

      // Calculate breathing radius for gradient
      const breathingRadius = springState.currentRadius * breatheScale

      // Use exponential falloff for imperceptible edges
      const gradient = ctx.createRadialGradient(
        circleX, circleY, breathingRadius * 0.2,  // Start fade very early
        circleX, circleY, breathingRadius * 1.5   // Extend way beyond circle
      )

      // Many stops with exponential/squared falloff for ultra-smooth fade
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)')       // 100% - solid center
      gradient.addColorStop(0.25, 'rgba(0, 0, 0, 0.98)') // 98% - barely fading
      gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.92)')  // 92% - gentle start
      gradient.addColorStop(0.55, 'rgba(0, 0, 0, 0.75)') // 75% - visible fade
      gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.5)')   // 50% - half transparent
      gradient.addColorStop(0.82, 'rgba(0, 0, 0, 0.25)') // 25% - very translucent
      gradient.addColorStop(0.92, 'rgba(0, 0, 0, 0.08)') // 8% - barely visible
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')       // 0% - fully transparent

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(circleX, circleY, breathingRadius * 1.6, 0, Math.PI * 2) // Even larger for smoothness
      ctx.fill()

      ctx.restore()


    }

    const handleMouseMove = (e: MouseEvent) => {
      currentMouseX = e.clientX
      currentMouseY = e.clientY
      setMousePos({ x: e.clientX, y: e.clientY })

      const element = e.target as HTMLElement

      const charInfo = getCharacterAtPoint(e.clientX, e.clientY)
      if (charInfo) {
        currentCharInfo = charInfo
        setCurrentChar(charInfo)
      }

      if (element !== currentHovered) {
        // Trigger transition when element changes
        if (currentHovered && cachedLines) {
          transitionState.previousCode = cachedLines
          transitionState.isTransitioning = true
          transitionState.progress = 0
          transitionState.startTime = Date.now()
        }

        currentHovered = element
        setHoveredElement(element)
        cachedCode = null
      } else if (charInfo !== currentCharInfo) {
        cachedCode = null
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        currentMouseX = touch.clientX
        currentMouseY = touch.clientY
        setMousePos({ x: touch.clientX, y: touch.clientY })

        const element = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement

        const charInfo = getCharacterAtPoint(touch.clientX, touch.clientY)
        if (charInfo) {
          currentCharInfo = charInfo
          setCurrentChar(charInfo)
        }

        if (element !== currentHovered) {
          // Trigger transition when element changes
          if (currentHovered && cachedLines) {
            transitionState.previousCode = cachedLines
            transitionState.isTransitioning = true
            transitionState.progress = 0
            transitionState.startTime = Date.now()
          }

          currentHovered = element
          setHoveredElement(element)
          cachedCode = null
        } else if (charInfo !== currentCharInfo) {
          cachedCode = null
        }
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        currentMouseX = touch.clientX
        currentMouseY = touch.clientY
        setMousePos({ x: touch.clientX, y: touch.clientY })

        const element = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement
        currentHovered = element
        setHoveredElement(element)
      }
    }

    const handleTouchEnd = () => {
      // Keep the effect visible for a moment after touch ends
      setTimeout(() => {
        currentMouseX = -1000
        currentMouseY = -1000
        setMousePos({ x: -1000, y: -1000 })
        currentHovered = null
        setHoveredElement(null)
      }, 300)
    }

    const handleScroll = () => {
      cachedCode = null
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', resizeCanvas)

    resizeCanvas()

    let animationId: number
    const animate = () => {
      drawCodeLayer()
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [isEnabled])

  // Enhanced transparency with spring-based easing
  useEffect(() => {
    if (!isEnabled || !hoveredElement || mousePos.x < 0) return

    const rect = hoveredElement.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distance = Math.sqrt(
      Math.pow(centerX - mousePos.x, 2) + Math.pow(centerY - mousePos.y, 2)
    )

    if (distance < 110) {
      const opacityValue = Math.max(0.4, 1 - (distance / 110) * 0.6)
      hoveredElement.style.opacity = opacityValue.toString()
      hoveredElement.style.transition = 'opacity 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
    }

    return () => {
      if (hoveredElement) {
        hoveredElement.style.opacity = '1'
        hoveredElement.style.transition = 'opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }
    }
  }, [hoveredElement, mousePos, isEnabled, currentChar])

  if (!isEnabled) {
    return null
  }

  return (
    <canvas
      ref={codeCanvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9998,
        pointerEvents: 'none',
      }}
    />
  )
}
