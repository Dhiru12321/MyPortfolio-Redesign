# Dhirendra Kumar — Portfolio Redesign

A separate React/Vite redesign of the original `MyPortfolio` site. The original repository is used only as visual and content reference and remains unchanged; this redesign has its own Git history.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Motion is powered by Motion for React and GSAP ScrollTrigger.

## Meeting enquiry flow

The contact form's **Send enquiry** button opens a responsive date/time request
dialog with the same interactive star network and grid as the portfolio. It keeps
the form details intact, disables past dates/times, and supports time-zone changes.
The proposed half-hour slots are not connected to live calendar availability.

At 760px wide and 600px high or larger, the enquiry uses a compact single-viewport
layout. Long notes and time lists can scroll inside their panels; narrower phones
keep a readable vertical layout with full-size touch controls.

Visitors can review, copy, or download their request and message the owner on
LinkedIn. No enquiry is automatically transmitted or represented as a confirmed
booking. To offer an email-draft action, set the public `VITE_CONTACT_EMAIL` address
in a local `.env` file using `.env.example`, then restart Vite/rebuild. A real
confirmed-booking flow would require the owner's booking-service URL or a backend.

## About portrait

`public/assets/people/profile-about-cutout-v2.png` is extracted from the supplied
`IMG_20231001_084906.jpg` using Apple's local Vision model, with real transparency
and a horizontal mirror. The person is not generated or redrawn. The cyan triangle
and responsive centering are handled in CSS rather than baked into the image.

The macOS helper in `scripts/extract-portrait.m` reproduces the extraction without
an API key or an upload. It refuses to overwrite an existing output file.
