export function createStars(width, height, random = Math.random) {
  const count = Math.min(72, Math.max(24, Math.round((width * height) / 16000)))
  return Array.from({ length: count }, () => {
    const radius = 1.8 + random() * 2.8
    const baseX = (random() - 0.5) * 24
    const baseY = (random() - 0.5) * 24
    return {
      x: radius + random() * (width - radius * 2),
      y: radius + random() * (height - radius * 2),
      radius,
      phase: random() * Math.PI * 2,
      baseX,
      baseY,
      vx: baseX,
      vy: baseY,
    }
  })
}

export function advanceStars(stars, width, height, elapsed, time, pointer) {
  const step = Math.max(0, Math.min(elapsed, 0.05))
  for (const star of stars) {
    star.vx += (star.baseX + Math.sin(time * 0.0007 + star.phase) * 5 - star.vx) * step * 0.25
    star.vy += (star.baseY + Math.cos(time * 0.0006 + star.phase) * 5 - star.vy) * step * 0.25

    if (pointer.active) {
      const dx = star.x - pointer.x
      const dy = star.y - pointer.y
      const distance = Math.hypot(dx, dy)
      if (distance < 140) {
        const force = (1 - distance / 140) * 100 * step
        star.vx += (distance > 0.01 ? dx / distance : Math.cos(star.phase)) * force
        star.vy += (distance > 0.01 ? dy / distance : Math.sin(star.phase)) * force
      }
    }

    const speed = Math.hypot(star.vx, star.vy)
    if (speed > 60) {
      star.vx *= 60 / speed
      star.vy *= 60 / speed
    }
    star.x += star.vx * step
    star.y += star.vy * step

    if (star.x < star.radius || star.x > width - star.radius) {
      star.x = Math.max(star.radius, Math.min(width - star.radius, star.x))
      star.vx *= -1
      star.baseX *= -1
    }
    if (star.y < star.radius || star.y > height - star.radius) {
      star.y = Math.max(star.radius, Math.min(height - star.radius, star.y))
      star.vy *= -1
      star.baseY *= -1
    }
  }
}
