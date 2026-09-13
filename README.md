# Dhirendra Kumar — Portfolio Redesign

A separate React/Vite redesign of the original `MyPortfolio` site. The source repository is used only as visual and content reference; this repository has its own Git history and no remote configured.

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

## About portrait

`public/assets/people/profile-about-cutout-v2.png` is extracted from the supplied
`IMG_20231001_084906.jpg` using Apple's local Vision model, with real transparency
and a horizontal mirror. The person is not generated or redrawn. The cyan triangle
and responsive centering are handled in CSS rather than baked into the image.

The macOS helper in `scripts/extract-portrait.m` reproduces the extraction without
an API key or an upload. It refuses to overwrite an existing output file.
