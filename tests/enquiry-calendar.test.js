import assert from 'node:assert/strict'
import test from 'node:test'
import {
  HOST_TIME_ZONE, calendarMonth, contactEmailHref, createEnquiryText,
  dateKeyInZone, formatTime, monthFromKey, proposalSlots, shiftDateKey,
  shiftMonth, zonedTimeToDate,
} from '../src/enquiry-calendar.js'

test('today is computed in the selected zone, not the system zone', () => {
  const instant = new Date('2026-09-12T19:00:00Z')
  assert.equal(dateKeyInZone(instant, HOST_TIME_ZONE), '2026-09-13')
  assert.equal(dateKeyInZone(instant, 'America/New_York'), '2026-09-12')
})

test('Monday-first calendars include leap days, padding, and correct month lengths', () => {
  const leap = calendarMonth(2028, 1)
  assert.equal(leap[0].key, '2028-01-31')
  assert.equal(leap[0].inMonth, false)
  assert.equal(leap.filter((day) => day.inMonth).length, 29)
  assert.ok(leap.some((day) => day.key === '2028-02-29' && day.inMonth))
  assert.equal(calendarMonth(2026, 1).filter((day) => day.inMonth).length, 28)
  assert.equal(calendarMonth(2026, 2).length, 42)
  assert.equal(calendarMonth(2026, 8)[1].key, '2026-09-01')
})

test('date and month navigation handles year boundaries', () => {
  assert.equal(shiftDateKey('2026-12-31', 1), '2027-01-01')
  assert.equal(shiftDateKey('2028-03-01', -1), '2028-02-29')
  assert.deepEqual(monthFromKey('2026-09-13'), { year: 2026, month: 8 })
  assert.deepEqual(shiftMonth({year:2026, month:11}, 1), {year:2027, month:0})
  assert.deepEqual(shiftMonth({year:2027, month:0}, -1), {year:2026, month:11})
})

test('wall-clock proposals convert correctly for fractional, negative, and DST offsets', () => {
  assert.equal(zonedTimeToDate('2026-09-14', '10:00', HOST_TIME_ZONE).toISOString(), '2026-09-14T04:30:00.000Z')
  assert.equal(zonedTimeToDate('2026-01-14', '10:00', 'America/New_York').toISOString(), '2026-01-14T15:00:00.000Z')
  assert.equal(zonedTimeToDate('2026-07-14', '10:00', 'America/New_York').toISOString(), '2026-07-14T14:00:00.000Z')
  assert.equal(zonedTimeToDate('2026-07-14', '10:00', 'Australia/Sydney').toISOString(), '2026-07-14T00:00:00.000Z')
  assert.equal(zonedTimeToDate('2026-09-14', '01:00', HOST_TIME_ZONE).toISOString(), '2026-09-13T19:30:00.000Z')
})

test('non-existent DST times are rejected instead of moving the proposed time', () => {
  assert.equal(zonedTimeToDate('2026-03-08', '02:30', 'America/New_York'), null)
  assert.equal(zonedTimeToDate('2026-03-29', '01:30', 'Europe/London'), null)
})

test('past and exactly current slots are unavailable; future half-hour proposals remain', () => {
  const now = new Date('2026-09-13T05:00:00Z') // 10:30 IST
  const slots = proposalSlots('2026-09-13', HOST_TIME_ZONE, now)
  assert.equal(slots.length, 16)
  assert.equal(slots[0].available, false)
  assert.equal(slots[1].available, false)
  assert.equal(slots[2].time, '11:00')
  assert.equal(slots[2].available, true)
  assert.equal(slots.at(-1).time, '17:30')
  assert.ok(proposalSlots('2026-09-12', HOST_TIME_ZONE, now).every((slot) => !slot.available))
  assert.ok(proposalSlots('2026-09-14', HOST_TIME_ZONE, now).every((slot) => slot.available))
})

test('labels and enquiry exports retain details and explicitly request confirmation', () => {
  assert.equal(formatTime('10:00'), '10:00 AM')
  assert.equal(formatTime('12:30'), '12:30 PM')
  assert.equal(formatTime('17:30'), '5:30 PM')
  const text = createEnquiryText({name:'Test Visitor', email:'visitor@example.com', projectType:'Product interface', message:'An idea & a second line\nNo auto-send.'}, '2026-09-14', '10:00', 'America/New_York')
  assert.match(text, /Name: Test Visitor/)
  assert.match(text, /Email: visitor@example.com/)
  assert.match(text, /10:00 AM \(America\/New_York\)/)
  assert.match(text, /UTC: 2026-09-14T14:00:00.000Z/)
  assert.match(text, /An idea & a second line\nNo auto-send\./)
  assert.match(text, /meeting request, not a confirmed booking/)
  assert.match(text, /Your time in India:/)
})

test('email drafts are opt-in and query content is encoded without changing recipients', () => {
  assert.equal(contactEmailHref('', 'hello', ''), null)
  assert.equal(contactEmailHref('bad@example.com?cc=other@example.com', 'hello', ''), null)
  const body = 'Name: Sample\nMessage: hello & नमस्ते?'
  const href = contactEmailHref('owner@example.com', body, 'Product & design')
  assert.ok(href.startsWith('mailto:owner@example.com?subject='))
  const params = new URLSearchParams(href.split('?')[1])
  assert.equal(params.get('body'), body)
  assert.equal(params.get('subject'), 'Portfolio enquiry — Product & design')
  assert.equal(params.size, 2)
})
