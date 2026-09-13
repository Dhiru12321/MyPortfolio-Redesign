import assert from 'node:assert/strict'
import test from 'node:test'
import { advanceStars, createStars } from '../src/star-network.js'

const idlePointer = { x: 0, y: 0, active: false }

test('responsive star counts stay bounded, including large displays', () => {
  for (const [width, height] of [[320, 844], [768, 1024], [1280, 720], [3840, 2160]]) {
    const stars = createStars(width, height)
    assert.ok(stars.length >= 24 && stars.length <= 72)
    for (const star of stars) {
      assert.ok(star.x >= star.radius && star.x <= width - star.radius)
      assert.ok(star.y >= star.radius && star.y <= height - star.radius)
    }
  }
})

test('stars drift without input and remain inside the viewport', () => {
  const stars = createStars(390, 844, () => 0.7)
  const start = { x: stars[0].x, y: stars[0].y }
  for (let frame = 0; frame < 3600; frame += 1) {
    advanceStars(stars, 390, 844, 1 / 60, frame * 1000 / 60, idlePointer)
    for (const star of stars) {
      assert.ok(star.x >= star.radius && star.x <= 390 - star.radius)
      assert.ok(star.y >= star.radius && star.y <= 844 - star.radius)
      assert.ok(Math.hypot(star.vx, star.vy) <= 60.000001)
    }
  }
  assert.notDeepEqual({ x: stars[0].x, y: stars[0].y }, start)
})

test('hover repels nearby stars without affecting distant stars', () => {
  const initial = createStars(1280, 720, () => 0.5)
  initial[0].x = 600
  initial[0].y = 350
  initial[1].x = 1000
  const active = structuredClone(initial)
  const idle = structuredClone(initial)
  advanceStars(active, 1280, 720, 1 / 60, 0, { x: 570, y: 350, active: true })
  advanceStars(idle, 1280, 720, 1 / 60, 0, idlePointer)
  assert.ok(active[0].x > idle[0].x)
  assert.deepEqual(active[1], idle[1])
})

test('exact cursor overlap and long pauses do not produce invalid coordinates or jumps', () => {
  const stars = createStars(390, 844, () => 0.5)
  const start = { x: stars[0].x, y: stars[0].y }
  advanceStars(stars, 390, 844, 120, 0, { ...start, active: true })
  for (const star of stars) {
    assert.ok(Number.isFinite(star.x) && Number.isFinite(star.y))
    assert.ok(Math.hypot(star.x - start.x, star.y - start.y) <= 3)
  }
})
