import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import {
  ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronLeft,
  ChevronRight, Clock3, Copy, Download, Globe2, Mail, Sparkles, Video, X,
} from 'lucide-react'
import StarNetwork from './StarNetwork.jsx'
import { publicAsset } from './public-asset.js'
import {
  HOST_TIME_ZONE, LINKEDIN_URL, calendarMonth, contactEmailHref, createEnquiryText,
  dateKeyInZone, formatDateKey, formatTime, monthFromKey, proposalSlots,
  shiftDateKey, shiftMonth, zonedTimeToDate,
} from './enquiry-calendar.js'
import './enquiry-scheduler.css'

const timeZones = [
  HOST_TIME_ZONE, 'UTC', 'America/New_York', 'America/Los_Angeles',
  'Europe/London', 'Europe/Berlin', 'Asia/Tokyo', 'Australia/Sydney',
]

export default function EnquiryScheduler({ details, theme, reduceMotion, onClose }) {
  const dialogRef = useRef(null)
  const panelTitleRef = useRef(null)
  const previousStepRef = useRef('select')
  const [timeZone, setTimeZone] = useState(() => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return !zone || zone === 'Asia/Calcutta' ? HOST_TIME_ZONE : zone
  })
  const [now, setNow] = useState(() => new Date())
  const today = dateKeyInZone(now, timeZone)
  const lastDay = shiftDateKey(today, 90)
  const [month, setMonth] = useState(() => monthFromKey(today))
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [step, setStep] = useState('select')
  const [feedback, setFeedback] = useState('')
  const [copyFallback, setCopyFallback] = useState(false)
  const zones = [...new Set([timeZone, ...timeZones])]
  const days = calendarMonth(month.year, month.month)
  const monthLabel = new Intl.DateTimeFormat('en-GB', {
    month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(Date.UTC(month.year, month.month, 1)))
  const slots = useMemo(() => selectedDate ? proposalSlots(selectedDate, timeZone, now) : [], [selectedDate, timeZone, now])
  const proposalValid = selectedDate >= today && selectedDate <= lastDay
    && slots.some((slot) => slot.time === selectedTime && slot.available)
  const enquiryText = proposalValid ? createEnquiryText(details, selectedDate, selectedTime, timeZone) : ''
  const emailHref = contactEmailHref(import.meta.env.VITE_CONTACT_EMAIL?.trim(), enquiryText, details.projectType)
  const hostInstant = proposalValid ? zonedTimeToDate(selectedDate, selectedTime, timeZone) : null

  useEffect(() => {
    const dialog = dialogRef.current
    const opener = document.activeElement
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    const timer = window.setInterval(() => setNow(new Date()), 30000)
    return () => {
      window.clearInterval(timer)
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (opener?.isConnected) opener.focus({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    if (previousStepRef.current !== step) panelTitleRef.current?.focus()
    previousStepRef.current = step
  }, [step])

  const chooseDate = (key) => {
    setSelectedDate(key)
    setSelectedTime('')
    setFeedback('')
  }

  const changeZone = (zone) => {
    setTimeZone(zone)
    setNow(new Date())
    setMonth(monthFromKey(dateKeyInZone(new Date(), zone)))
    setSelectedDate('')
    setSelectedTime('')
    setFeedback('')
  }

  const review = () => {
    const instant = zonedTimeToDate(selectedDate, selectedTime, timeZone)
    if (!instant || instant <= new Date()) {
      setNow(new Date())
      setFeedback('This time has passed. Please choose another proposal.')
      return
    }
    setFeedback('')
    setStep('review')
  }

  const copyEnquiry = async () => {
    try {
      await navigator.clipboard.writeText(enquiryText)
      setCopyFallback(false)
      setFeedback('Enquiry copied. Paste it into a LinkedIn message to send your request.')
    } catch {
      setCopyFallback(true)
      setFeedback('Select and copy your enquiry below, or download it as a text file.')
    }
  }

  const downloadEnquiry = () => {
    const url = URL.createObjectURL(new Blob([enquiryText], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'dhirendra-meeting-enquiry.txt'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setFeedback('Enquiry downloaded. Share it with me to request this meeting.')
  }

  return (
    <dialog
      className="enquiry-dialog"
      ref={dialogRef}
      aria-labelledby="enquiry-title"
      aria-describedby="enquiry-description"
      onCancel={(event) => { event.preventDefault(); onClose() }}
    >
      <StarNetwork theme={theme} reduceMotion={reduceMotion} className="scheduler-stars" />
      <div className="scheduler-grid" aria-hidden="true" />
      <motion.div
        className="scheduler-shell"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="scheduler-topbar">
          <button type="button" className="scheduler-back" onClick={onClose} autoFocus>
            <ArrowLeft size={17} /> Back to portfolio
          </button>
          <span className="scheduler-topnote">A CONVERSATION IS A GOOD START.</span>
          <button type="button" className="scheduler-close" onClick={onClose} aria-label="Close meeting enquiry"><X size={20} /></button>
        </div>

        <header className="scheduler-heading">
          <p className="scheduler-eyebrow"><span /> LET’S CONNECT / 01</p>
          <h1 id="enquiry-title">Great things start <br />with a <span>conversation.</span></h1>
          <p id="enquiry-description">A little time. A big idea. Find a moment to talk about yours.</p>
        </header>

        <div className="scheduler-card">
          <aside className="scheduler-overview">
            <div className="scheduler-avatar"><img src={publicAsset('/assets/people/profile-about-cutout-v2.png')} alt="Dhirendra Kumar" /></div>
            <p className="scheduler-host">Dhirendra Kumar</p>
            <h2>30-minute <br />discovery call<span>.</span></h2>
            <p className="scheduler-about">Let’s explore your project, the possibilities, and what we could build together.</p>
            <ul className="scheduler-facts">
              <li><Clock3 /><span>30 minutes</span></li>
              <li><Video /><span>Call details agreed after confirmation</span></li>
              <li><Globe2 /><span>Based in India · IST</span></li>
            </ul>
            <div className="scheduler-project-note">
              <span>YOUR IDEA</span>
              <strong>{details.projectType || 'Let’s explore it together'}</strong>
              <p>Looking forward to hearing from you, {details.name.split(' ')[0]}.</p>
            </div>
            <p className="scheduler-request-note"><span /> Meeting request, not a confirmed booking.</p>
          </aside>

          <div className="scheduler-main">
            <div className="scheduler-stepbar">
              <span className={step === 'select' ? 'current' : 'complete'}><b>{step === 'review' ? <Check size={12} /> : '01'}</b> Date & time</span>
              <div />
              <span className={step === 'review' ? 'current' : ''}><b>02</b> Your enquiry</span>
            </div>

            <motion.div className="scheduler-stage" key={step} initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              {step === 'select' ? (
                <>
                  <h2 className="scheduler-panel-title" ref={panelTitleRef} tabIndex={-1}>Choose a date & time<span>.</span></h2>
                  <p className="scheduler-panel-subtitle">Pick a day and propose a time that works for you.</p>
                  <div className="scheduler-selection">
                    <div className="scheduler-calendar">
                      <div className="scheduler-month">
                        <h3 aria-live="polite">{monthLabel}</h3>
                        <div>
                          <button type="button" aria-label="Previous month" disabled={month.year * 12 + month.month <= Number(today.slice(0, 4)) * 12 + Number(today.slice(5, 7)) - 1} onClick={() => setMonth((value) => shiftMonth(value, -1))}><ChevronLeft size={18} /></button>
                          <button type="button" aria-label="Next month" disabled={month.year * 12 + month.month >= Number(lastDay.slice(0, 4)) * 12 + Number(lastDay.slice(5, 7)) - 1} onClick={() => setMonth((value) => shiftMonth(value, 1))}><ChevronRight size={18} /></button>
                        </div>
                      </div>
                      <div className="scheduler-weekdays" aria-hidden="true">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span key={index}>{day}</span>)}</div>
                      <div className="scheduler-days" role="group" aria-label={monthLabel}>
                        {days.map((day) => day.inMonth ? (
                          <button
                            type="button" key={day.key}
                            className={`${day.key === today ? 'today' : ''} ${day.key === selectedDate ? 'selected' : ''}`}
                            aria-label={formatDateKey(day.key, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            aria-pressed={day.key === selectedDate}
                            disabled={day.key < today || day.key > lastDay}
                            onClick={() => chooseDate(day.key)}
                          >{day.day}</button>
                        ) : <span key={day.key} aria-hidden="true" />)}
                      </div>
                      <label className="scheduler-zone"><span><Globe2 size={14} /> Time zone</span>
                        <select value={timeZone} onChange={(event) => changeZone(event.target.value)}>{zones.map((zone) => <option key={zone} value={zone}>{zone.replaceAll('_', ' ')}{zone === HOST_TIME_ZONE ? ' · IST' : ''}</option>)}</select>
                      </label>
                    </div>

                    <div className="scheduler-times">
                      {selectedDate ? (
                        <>
                          <h3>{formatDateKey(selectedDate, { weekday: 'short', month: 'short', day: 'numeric' })}</h3>
                          <p>30-minute proposals</p>
                          <div className="scheduler-time-list" role="group" aria-label="Proposed meeting times">
                            {slots.map((slot) => <button type="button" key={slot.time} disabled={!slot.available} aria-pressed={selectedTime === slot.time} className={selectedTime === slot.time ? 'selected' : ''} onClick={() => { setSelectedTime(slot.time); setFeedback('') }}>{formatTime(slot.time)}{selectedTime === slot.time && <Check size={14} />}</button>)}
                          </div>
                          {!slots.some((slot) => slot.available) && <p className="scheduler-no-times">No future times for this day. Please choose another date.</p>}
                        </>
                      ) : (
                        <div className="scheduler-empty-times"><div className="scheduler-orbit"><CalendarDays size={27} /><Sparkles size={15} /></div><strong>Your next big idea<br />deserves a moment.</strong><p>Select a date to explore time proposals.</p></div>
                      )}
                    </div>
                  </div>
                  <div className="scheduler-selection-footer">
                    <p>These are proposed times, not live calendar availability.</p>
                    <button className="scheduler-primary" type="button" disabled={!proposalValid} onClick={review}>Review enquiry <ArrowRight size={16} /></button>
                  </div>
                </>
              ) : (
                <div className="scheduler-review">
                  <p className="scheduler-ready"><Sparkles size={15} /> ONE STEP CLOSER</p>
                  <h2 className="scheduler-panel-title" ref={panelTitleRef} tabIndex={-1}>Your enquiry is ready<span>.</span></h2>
                  <p className="scheduler-panel-subtitle">Review your idea and proposed time, then share the request with me.</p>
                  <div className="scheduler-summary">
                    <CalendarDays size={22} />
                    <div><strong>{formatDateKey(selectedDate)}</strong><span>{formatTime(selectedTime)} · 30 min · {timeZone.replaceAll('_', ' ')}</span>{hostInstant && timeZone !== HOST_TIME_ZONE && <span>In India: {new Intl.DateTimeFormat('en-GB', {timeZone: HOST_TIME_ZONE, month:'short', day:'numeric', hour:'numeric', minute:'2-digit', hour12:true}).format(hostInstant)} IST</span>}</div>
                    <button type="button" onClick={() => { setStep('select'); setFeedback('') }}>Change</button>
                  </div>
                  <dl className="scheduler-details"><div><dt>Name</dt><dd>{details.name}</dd></div><div><dt>Email</dt><dd>{details.email}</dd></div><div><dt>Project</dt><dd>{details.projectType || 'Let’s discuss'}</dd></div><div className="scheduler-message"><dt>Your idea</dt><dd>{details.message}</dd></div></dl>
                  <div className="scheduler-review-actions">
                    {emailHref && proposalValid ? <a className="scheduler-primary" href={emailHref}><Mail size={16} /> Send email enquiry <ArrowUpRight size={16} /></a> : <button type="button" className="scheduler-primary" disabled={!proposalValid} onClick={copyEnquiry}><Copy size={16} /> Copy enquiry</button>}
                    <a className="scheduler-secondary" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">Message on LinkedIn <ArrowUpRight size={15} /></a>
                    <button className="scheduler-download" type="button" disabled={!proposalValid} onClick={downloadEnquiry}><Download size={15} /> Download request</button>
                  </div>
                  <p className="scheduler-delivery-note">{emailHref ? 'Your email app will open a draft. Send it there to request the meeting.' : 'Copy your enquiry and paste it into a LinkedIn message. Your details stay in this browser until you share them.'} The meeting is only booked once I confirm.</p>
                  {!proposalValid && <p className="scheduler-expired" role="alert">The proposed time has passed. Choose a new date and time before sharing.</p>}
                  {copyFallback && <label className="scheduler-copy-fallback"><span>Your enquiry — select and copy</span><textarea readOnly value={enquiryText} rows={8} onFocus={(event) => event.currentTarget.select()} /></label>}
                </div>
              )}
              <p className="scheduler-feedback" role="status" aria-live="polite">{feedback}</p>
            </motion.div>
          </div>
        </div>
        <p className="scheduler-bottom-note">GOOD DESIGN. THOUGHTFUL CODE. HUMAN CONNECTION.</p>
      </motion.div>
    </dialog>
  )
}
