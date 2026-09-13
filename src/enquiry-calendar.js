export const HOST_TIME_ZONE = 'Asia/Kolkata'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/dhirendra-kumar-28488b24b/'

export function dateKeyInZone(date = new Date(), timeZone = HOST_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date)
  const get = (type) => parts.find((part) => part.type === type).value
  return `${get('year')}-${get('month')}-${get('day')}`
}

export function shiftDateKey(key, days) {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10)
}

export function calendarMonth(year, month) {
  const first = new Date(Date.UTC(year, month, 1))
  const leading = (first.getUTCDay() + 6) % 7
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  return Array.from({ length: Math.ceil((leading + days) / 7) * 7 }, (_, index) => {
    const date = new Date(Date.UTC(year, month, index - leading + 1))
    return {
      key: date.toISOString().slice(0, 10),
      day: date.getUTCDate(),
      inMonth: date.getUTCMonth() === first.getUTCMonth(),
    }
  })
}

export function monthFromKey(key) {
  const [year, month] = key.split('-').map(Number)
  return { year, month: month - 1 }
}

export function shiftMonth({ year, month }, amount) {
  const date = new Date(Date.UTC(year, month + amount, 1))
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() }
}

export function formatDateKey(key, options = { weekday: 'long', month: 'long', day: 'numeric' }) {
  return new Intl.DateTimeFormat('en-GB', { ...options, timeZone: 'UTC' })
    .format(new Date(`${key}T12:00:00Z`))
}

// Convert the visitor's wall-clock proposal into an instant, including DST offsets.
// Reject non-existent local times instead of silently shifting the request.
export function zonedTimeToDate(key, time, timeZone) {
  const [year, month, day] = key.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  const wall = Date.UTC(year, month - 1, day, hour, minute)
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  })
  let instant = wall
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const parts = formatter.formatToParts(new Date(instant))
    const get = (type) => Number(parts.find((part) => part.type === type).value)
    const rendered = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'))
    const difference = wall - rendered
    if (!difference) return new Date(instant)
    instant += difference
  }
  return null
}

export function proposalSlots(key, timeZone, now = new Date()) {
  return Array.from({ length: 16 }, (_, index) => {
    const hour = 10 + Math.floor(index / 2)
    const minute = index % 2 ? '30' : '00'
    const time = `${hour.toString().padStart(2, '0')}:${minute}`
    const instant = zonedTimeToDate(key, time, timeZone)
    return { time, instant, available: Boolean(instant && instant > now) }
  })
}

export function formatTime(time) {
  const [hour, minute] = time.split(':').map(Number)
  return `${hour % 12 || 12}:${minute.toString().padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`
}

export function createEnquiryText(details, key, time, timeZone) {
  const instant = zonedTimeToDate(key, time, timeZone)
  if (!instant) throw new Error('Please choose a valid time in this time zone.')
  const hostTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: HOST_TIME_ZONE, dateStyle: 'full', timeStyle: 'short',
  }).format(instant)
  return [
    'Hi Dhirendra,', '',
    'I would like to connect about a project and propose a 30-minute discovery call.', '',
    `Name: ${details.name}`,
    `Email: ${details.email}`,
    `Project type: ${details.projectType || 'Let’s discuss'}`, '',
    `Proposed date: ${formatDateKey(key, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
    `Proposed time: ${formatTime(time)} (${timeZone})`,
    `Your time in India: ${hostTime} (${HOST_TIME_ZONE})`,
    `UTC: ${instant.toISOString()}`, '',
    'About my idea:', details.message, '',
    'This is a meeting request, not a confirmed booking. Please confirm a suitable time.',
  ].join('\n')
}

export function contactEmailHref(email, text, projectType) {
  if (!email || !/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(email)) return null
  return `mailto:${email}?subject=${encodeURIComponent(`Portfolio enquiry — ${projectType || 'Discovery call'}`)}&body=${encodeURIComponent(text)}`
}
