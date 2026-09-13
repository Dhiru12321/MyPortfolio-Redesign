import { useEffect, useRef } from 'react'
import { advanceStars, createStars } from './star-network.js'

export default function StarNetwork({ theme, reduceMotion }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) return undefined

    const pointer = { x: 0, y: 0, active: false }
    const color = theme === 'light' ? '#416bd0' : '#7ba4ff'
    const highlight = theme === 'light' ? '#08797d' : '#d9ff43'
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    let width = 0
    let height = 0
    let stars = []
    let frame = 0
    let previousTime = 0

    const paint = (time) => {
      context.clearRect(0, 0, width, height)
      const range = width < 640 ? 150 : 180
      const degrees = new Uint8Array(stars.length)
      context.lineWidth = 0.8
      context.strokeStyle = color
      for (let i = 0; i < stars.length; i += 1) {
        for (let j = i + 1; j < stars.length; j += 1) {
          if (degrees[i] >= 3 || degrees[j] >= 3) continue
          const distance = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y)
          if (distance >= range) continue
          degrees[i] += 1
          degrees[j] += 1
          context.globalAlpha = (1 - distance / range) * 0.24
          context.beginPath()
          context.moveTo(stars[i].x, stars[i].y)
          context.lineTo(stars[j].x, stars[j].y)
          context.stroke()
        }
      }

      let pointerLinks = 0
      for (const star of stars) {
        const distance = pointer.active ? Math.hypot(star.x - pointer.x, star.y - pointer.y) : Infinity
        const proximity = Math.max(0, 1 - distance / 160)
        if (proximity > 0 && pointerLinks < 3) {
          pointerLinks += 1
          context.strokeStyle = highlight
          context.globalAlpha = proximity * 0.28
          context.beginPath()
          context.moveTo(pointer.x, pointer.y)
          context.lineTo(star.x, star.y)
          context.stroke()
        }

        const pulse = reduceMotion ? 0.65 : 0.65 + Math.sin(time * 0.001 + star.phase) * 0.18
        const radius = star.radius * (1 + proximity * 0.65)
        context.fillStyle = proximity > 0.25 ? highlight : color
        context.globalAlpha = pulse * 0.58 + proximity * 0.25
        context.beginPath()
        for (let point = 0; point < 8; point += 1) {
          const angle = point * Math.PI / 4 - Math.PI / 2
          const length = point % 2 === 0 ? radius : radius * 0.24
          const x = star.x + Math.cos(angle) * length
          const y = star.y + Math.sin(angle) * length
          if (point === 0) context.moveTo(x, y)
          else context.lineTo(x, y)
        }
        context.closePath()
        context.fill()
      }
      context.globalAlpha = 1
    }

    const resize = () => {
      const nextWidth = window.innerWidth
      const nextHeight = window.innerHeight
      if (!nextWidth || !nextHeight) return
      for (const star of stars) {
        star.x *= nextWidth / width
        star.y *= nextHeight / height
      }
      width = nextWidth
      height = nextHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(3000000 / (width * height)))
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      const nextStars = createStars(width, height)
      stars = [...stars.slice(0, nextStars.length), ...nextStars.slice(stars.length)]
      paint(performance.now())
    }

    const tick = (time) => {
      frame = window.requestAnimationFrame(tick)
      if (coarsePointer && previousTime && time - previousTime < 1000 / 30) return
      const elapsed = previousTime ? (time - previousTime) / 1000 : 0
      previousTime = time
      advanceStars(stars, width, height, elapsed, time, pointer)
      paint(time)
    }

    const movePointer = (event) => {
      if (event.pointerType === 'touch') return
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.active = true
      if (reduceMotion) paint(0)
    }
    const clearPointer = () => {
      pointer.active = false
      if (reduceMotion) paint(0)
    }
    const visibility = () => {
      window.cancelAnimationFrame(frame)
      frame = 0
      previousTime = 0
      if (!document.hidden && !reduceMotion) frame = window.requestAnimationFrame(tick)
    }

    resize()
    visibility()
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('pointermove', movePointer, { passive: true })
    document.documentElement.addEventListener('pointerleave', clearPointer)
    window.addEventListener('blur', clearPointer)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', movePointer)
      document.documentElement.removeEventListener('pointerleave', clearPointer)
      window.removeEventListener('blur', clearPointer)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [theme, reduceMotion])

  return <canvas className="star-network" ref={canvasRef} aria-hidden="true" />
}
