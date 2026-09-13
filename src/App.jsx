import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import StarNetwork from './StarNetwork.jsx'
import EnquiryScheduler from './EnquiryScheduler.jsx'
import { LINKEDIN_URL } from './enquiry-calendar.js'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Asterisk,
  Camera,
  Code2,
  BriefcaseBusiness,
  GitFork,
  Images,
  Mail,
  Menu,
  Moon,
  Orbit,
  Palette,
  Send,
  Smartphone,
  Sparkles,
  Sun,
  X,
  Zap,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const navigation = ['Home', 'About', 'Services', 'Work', 'Contact']

const roles = [
  { label: 'Web Developer', icon: Code2 },
  { label: 'Photographer', icon: Camera },
  { label: 'Designer', icon: Palette },
  { label: 'App Developer', icon: Smartphone },
]

const services = [
  {
    number: '01',
    title: 'Web development',
    icon: Code2,
    text: 'Responsive websites and frontend systems that feel fast, intentional, and effortless to use.',
    tags: ['React', 'JavaScript', 'APIs'],
  },
  {
    number: '02',
    title: 'Product design',
    icon: Palette,
    text: 'Clear interface systems that turn complex workflows into focused, memorable digital experiences.',
    tags: ['UI systems', 'Prototyping', 'UX'],
  },
  {
    number: '03',
    title: 'App experiences',
    icon: Smartphone,
    text: 'Mobile-first product experiences shaped around real behavior, useful feedback, and polished interaction.',
    tags: ['Android', 'Motion', 'Testing'],
  },
]

const projects = [
  {
    index: '01',
    title: 'Fresh Khaana',
    category: 'Food commerce platform',
    year: '2023',
    image: '/assets/projects/Screenshot%202023-05-07%20at%2010.38.59%20PM.png',
    accent: '#d9ff43',
    description: 'A collaborative marketplace concept connecting local food vendors with nearby customers.',
  },
  {
    index: '02',
    title: 'Weather Watch',
    category: 'Forecast experience',
    year: '2023',
    image: '/assets/projects/Screenshot%202023-05-07%20at%2010.41.53%20PM.png',
    accent: '#79a7ff',
    description: 'A clear, real-time weather monitor designed to surface useful alerts for farmers.',
  },
  {
    index: '03',
    title: 'Personal Portfolio',
    category: 'Identity & frontend',
    year: '2023',
    image: '/assets/projects/Screenshot%202023-05-07%20at%2010.43.15%20PM.png',
    accent: '#ff8064',
    description: 'The original portfolio experiment that established the visual foundation for this redesign.',
  },
  {
    index: '04',
    title: 'Design Decor',
    category: 'Web3 design concept',
    year: '2023',
    image: '/assets/projects/Screenshot%202023-05-07%20at%2010.53.21%20PM.png',
    accent: '#c7a1ff',
    description: 'An interactive canvas-led experience exploring expressive decoration and spatial design.',
  },
  {
    index: '05',
    title: 'Fresh Khaana App',
    category: 'Android product',
    year: '2023',
    image: '/assets/projects/Screenshot%202023-05-07%20at%2010.59.55%20PM.png',
    accent: '#7fe2bd',
    description: 'A mobile companion that brings the Fresh Khaana marketplace into an approachable app flow.',
  },
  {
    index: '06',
    title: 'Free Music',
    category: 'Streaming concept',
    year: '2023',
    image: '/assets/projects/Screenshot%202023-05-07%20at%2011.09.40%20PM.png',
    accent: '#ffb657',
    description: 'An ad-free music player concept with a focused interface and frictionless listening flow.',
  },
  {
    index: '07',
    title: 'Newsfinder',
    category: 'News & weather interface',
    year: 'Live',
    image: '/assets/projects/newsfinder-preview.png',
    href: 'https://dhiru12321.github.io/newsfinder/',
    accent: '#79e9f5',
    description: 'An independent news interface covering India, world stories, technology, finance, and local weather.',
  },
]

const testimonials = [
  {
    name: 'Deepanshu Gupta',
    role: 'Developer & collaborator',
    image: '/assets/people/deepanshu.jpg',
    quote:
      'Dhirendra brings genuine curiosity to every build. He cares about the details, learns fast, and keeps the whole experience centered on the people using it.',
  },
  {
    name: 'Adarsh Thakur',
    role: 'Creative collaborator',
    image: '/assets/people/adarsh.jpeg',
    quote:
      'Working with Dhirendra feels energetic and focused. He translates an early idea into a visual direction quickly, then keeps refining until the interaction feels right.',
  },
  {
    name: 'Aditya Kumar',
    role: 'Project teammate',
    image: '/assets/people/aditya.jpeg',
    quote:
      'He is dependable, open to feedback, and equally comfortable thinking through interface details or getting into the code needed to make them real.',
  },
]

const skillLoop = [
  'React',
  'JavaScript',
  'HTML / CSS',
  'Motion',
  'MongoDB',
  'Android',
  'UI Design',
  'Creative Code',
]

function MagneticLink({ href, children, className = '', download, target, onClick }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const smoothX = useSpring(x, { stiffness: 280, damping: 18, mass: 0.3 })
  const smoothY = useSpring(y, { stiffness: 280, damping: 18, mass: 0.3 })

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * 0.18)
    y.set((event.clientY - rect.top - rect.height / 2) * 0.18)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      className={className}
      href={href}
      download={download}
      target={target}
      rel={target === '_blank' ? 'noreferrer' : undefined}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: smoothX, y: smoothY }}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.a>
  )
}

function TiltCard({ children, className = '', href, ariaLabel }) {
  const Card = href ? motion.a : motion.article
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [6, -6]), {
    stiffness: 160,
    damping: 22,
  })
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 160,
    damping: 22,
  })

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <Card
      className={className}
      href={href}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      aria-label={ariaLabel}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        pointerX.set(0)
        pointerY.set(0)
      }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
    >
      {children}
    </Card>
  )
}

function SectionHeading({ eyebrow, title, align = 'left' }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <p className="eyebrow reveal-item">
        <span className="eyebrow-dot" /> {eyebrow}
      </p>
      <h2 className="reveal-title">{title}</h2>
    </div>
  )
}

function App() {
  const appRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [testimonial, setTestimonial] = useState(0)
  const [enquiryDetails, setEnquiryDetails] = useState(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]')
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-25% 0px -60%', threshold: [0.05, 0.2, 0.5] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const element = appRef.current
    if (!element) return undefined
    const updatePointer = (event) => {
      element.style.setProperty('--pointer-x', `${event.clientX}px`)
      element.style.setProperty('--pointer-y', `${event.clientY}px`)
    }
    window.addEventListener('pointermove', updatePointer, { passive: true })
    return () => window.removeEventListener('pointermove', updatePointer)
  }, [])

  useLayoutEffect(() => {
    if (reduceMotion) return undefined
    const context = gsap.context(() => {
      gsap.fromTo(
        '.hero-copy > *',
        { y: 42, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.09, ease: 'power3.out', delay: 0.15 },
      )
      gsap.fromTo(
        '.hero-visual',
        { x: 90, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.15, ease: 'power3.out', delay: 0.25 },
      )

      gsap.utils.toArray('.reveal-title').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 56, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          },
        )
      })

      gsap.utils.toArray('.reveal-item').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power2.out',
            scrollTrigger: { trigger: element, start: 'top 91%', once: true },
          },
        )
      })

      gsap.utils.toArray('.parallax-object').forEach((element) => {
        gsap.to(element, {
          yPercent: -35,
          ease: 'none',
          scrollTrigger: {
            trigger: element.closest('section') || element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.1,
          },
        })
      })
    }, appRef)
    return () => context.revert()
  }, [reduceMotion])

  const closeMenu = () => setMenuOpen(false)

  const scrollToTop = () => {
    closeMenu()
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    appRef.current?.querySelector('.site-header .brand')?.focus({ preventScroll: true })
  }

  const changeTestimonial = (direction) => {
    setTestimonial((current) => (current + direction + testimonials.length) % testimonials.length)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    for (const name of ['name', 'message']) {
      const field = form.elements.namedItem(name)
      field.setCustomValidity(field.value.trim() ? '' : 'Please enter a little detail here.')
      if (!field.checkValidity()) { field.reportValidity(); return }
    }
    const values = new FormData(form)
    setEnquiryDetails(Object.fromEntries(['name', 'email', 'projectType', 'message'].map((key) => [key, String(values.get(key) || '').trim()])))
  }

  return (
    <div className="app-shell" ref={appRef}>
      <StarNetwork theme={theme} reduceMotion={reduceMotion} paused={Boolean(enquiryDetails)} />
      <div className="pointer-glow" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />

      <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
        <a href="#home" className="brand" aria-label="Dhirendra Kumar, home" onClick={closeMenu}>
          DK<span>®</span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => {
            const id = item.toLowerCase()
            return (
              <a key={item} href={`#${id}`} className={activeSection === id ? 'active' : ''}>
                {item}
              </a>
            )
          })}
        </nav>

        <div className="header-actions">
          <button
            className="icon-button"
            type="button"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            onClick={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </motion.span>
            </AnimatePresence>
          </button>
          <MagneticLink className="header-cta" href="#contact">
            Let’s talk <ArrowUpRight size={16} />
          </MagneticLink>
          <button
            className="menu-button"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            aria-label="Mobile navigation"
          >
            {navigation.map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={closeMenu}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.045 }}
              >
                <span>0{index + 1}</span> {item}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      <main>
        <section className="hero grid-surface" id="home" data-section>
          <div className="hero-object hero-object--one parallax-object" aria-hidden="true" />
          <div className="hero-object hero-object--two parallax-object" aria-hidden="true" />

          <div className="hero-copy">
            <div className="availability-pill">
              <span className="pulse-dot" /> Available for select projects · 2026
            </div>
            <p className="hero-kicker">Frontend developer / Creative thinker</p>
            <h1>
              I build digital
              <span className="hero-outline"> experiences</span>
              <span className="hero-accent-line">
                that move <Sparkles aria-hidden="true" />
              </span>
            </h1>
            <p className="hero-intro">
              I’m Dhirendra Kumar — a developer and designer turning ambitious ideas into bold,
              thoughtful interfaces people enjoy using.
            </p>
            <div className="hero-actions">
              <MagneticLink className="primary-button" href="#work">
                Explore my work <ArrowDownRight size={19} />
              </MagneticLink>
              <MagneticLink
                className="text-button"
                href="/resume/dhirendra-kumar-resume.pdf"
                download
              >
                Download Resume <ArrowUpRight size={17} />
              </MagneticLink>
            </div>
            <div className="hero-socials" aria-label="Social links">
              <a href="https://github.com/Dhiru12321" target="_blank" rel="noreferrer" aria-label="GitHub">
                <GitFork size={19} />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <BriefcaseBusiness size={19} />
              </a>
              <a
                href="https://www.instagram.com/hastag_dhiru/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <Images size={19} />
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="role-wheel" aria-hidden="true">
              <div className="role-wheel-line" />
              {roles.map(({ label, icon: Icon }, index) => (
                <div className={`role role--${index + 1}`} key={label}>
                  <span className="role-icon"><Icon /></span>
                  <strong>{label}</strong>
                </div>
              ))}
            </div>
            <div className="portrait-backdrop" aria-hidden="true" />
            <img
              className="hero-portrait"
              src="/assets/people/profile-primary.png"
              alt="Dhirendra Kumar"
            />
            <div className="hero-coordinate" aria-hidden="true">30.7333° N / 76.7794° E</div>
          </div>

          <a className="scroll-cue" href="#about" aria-label="Scroll to about section">
            <span>Scroll to explore</span>
            <span className="scroll-cue-line" />
          </a>
        </section>

        <div className="skills-marquee" aria-label="Skills">
          <motion.div
            className="skills-track"
            animate={reduceMotion ? undefined : { x: ['0%', '-50%'] }}
            transition={{ duration: 24, ease: 'linear', repeat: Infinity }}
          >
            {[...skillLoop, ...skillLoop].map((skill, index) => (
              <span key={`${skill}-${index}`}>
                {skill} <Asterisk aria-hidden="true" />
              </span>
            ))}
          </motion.div>
        </div>

        <section className="about-section section-pad grid-surface" id="about" data-section>
          <div className="section-index reveal-item">/ 01</div>
          <div className="about-layout">
            <div className="about-visual reveal-item">
              <div className="about-frame">
                <div className="about-portrait">
                  <img src="/assets/people/profile-about-cutout-v2.png" alt="Dhirendra Kumar looking to the right" />
                </div>
                <span className="corner corner--tl" />
                <span className="corner corner--tr" />
                <span className="corner corner--bl" />
                <span className="corner corner--br" />
              </div>
              <div className="about-tag"><Zap size={16} /> Curious by default</div>
            </div>

            <div className="about-copy">
              <SectionHeading eyebrow="A little about me" title="Building with curiosity, clarity, and care." />
              <p className="about-lead reveal-item">
                I’m a computer science graduate who loves the point where thoughtful design meets useful
                engineering.
              </p>
              <p className="about-body reveal-item">
                My approach starts with understanding the real problem, then shaping a visual system and
                translating it into responsive, maintainable code. I care about the small interactions because
                they are often what make a product feel trustworthy.
              </p>
              <div className="about-stats reveal-item">
                <div><strong>12+</strong><span>Projects explored</span></div>
                <div><strong>04</strong><span>Core disciplines</span></div>
                <div><strong>100%</strong><span>Curiosity invested</span></div>
              </div>
              <MagneticLink
                className="outline-button reveal-item"
                href={LINKEDIN_URL}
                target="_blank"
              >
                More about my journey <ArrowUpRight size={18} />
              </MagneticLink>
            </div>
          </div>
          <div className="section-orb section-orb--about parallax-object" aria-hidden="true" />
        </section>

        <section className="services-section section-pad" id="services" data-section>
          <div className="section-index reveal-item">/ 02</div>
          <div className="services-heading-row">
            <SectionHeading eyebrow="What I can help with" title="Ideas, designed and built to work." />
            <p className="section-note reveal-item">
              From early direction to polished interface — a focused, end-to-end approach.
            </p>
          </div>

          <div className="services-list">
            {services.map(({ number, title, icon: Icon, text, tags }) => (
              <TiltCard className="service-card reveal-item" key={title}>
                <div className="service-card-top">
                  <span>{number}</span>
                  <div className="service-icon"><Icon /></div>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                <div className="service-tags">
                  {tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <div className="service-arrow"><ArrowUpRight /></div>
              </TiltCard>
            ))}
          </div>
        </section>

        <section className="work-section section-pad grid-surface" id="work" data-section>
          <div className="section-index reveal-item">/ 03</div>
          <div className="work-heading-row">
            <SectionHeading eyebrow="Selected experiments" title="Projects built to learn, solve, and express." />
            <span className="work-count reveal-item">{String(projects.length).padStart(2, '0')} / SELECTED</span>
          </div>

          <div className="project-grid">
            {projects.map((project, index) => (
              <TiltCard
                className={`project-card project-card--${(index % 3) + 1}${project.href ? ' project-card--live' : ''} reveal-item`}
                key={project.title}
                href={project.href}
                ariaLabel={project.href ? `Visit ${project.title} website (opens in a new tab)` : undefined}
              >
                <div className="project-image-wrap">
                  <img src={project.image} alt={`${project.title} interface preview`} loading="lazy" />
                  <div className="project-color" style={{ '--project-accent': project.accent }} />
                  <motion.div className="project-view" whileHover={{ scale: 1.08 }}>
                    View <ArrowUpRight size={18} />
                  </motion.div>
                </div>
                <div className="project-meta">
                  <div>
                    <span>{project.index} · {project.category}</span>
                    <h3>{project.title}</h3>
                  </div>
                  <span>{project.year}</span>
                </div>
                <p>{project.description}</p>
              </TiltCard>
            ))}
          </div>
        </section>

        <section className="testimonial-section section-pad" aria-labelledby="testimonial-title">
          <div className="testimonial-grid-mark" aria-hidden="true" />
          <p className="eyebrow reveal-item"><span className="eyebrow-dot" /> In good company</p>
          <h2 className="sr-only" id="testimonial-title">What collaborators say</h2>
          <div className="testimonial-stage reveal-item">
            <div className="quote-mark">“</div>
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={testimonial}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {testimonials[testimonial].quote}
              </motion.blockquote>
            </AnimatePresence>
            <div className="testimonial-footer">
              <AnimatePresence mode="wait">
                <motion.div
                  className="testimonial-person"
                  key={testimonials[testimonial].name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                >
                  <img src={testimonials[testimonial].image} alt="" />
                  <div>
                    <strong>{testimonials[testimonial].name}</strong>
                    <span>{testimonials[testimonial].role}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="testimonial-controls">
                <button type="button" onClick={() => changeTestimonial(-1)} aria-label="Previous testimonial">
                  <ArrowLeft />
                </button>
                <span>0{testimonial + 1} / 0{testimonials.length}</span>
                <button type="button" onClick={() => changeTestimonial(1)} aria-label="Next testimonial">
                  <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section section-pad grid-surface" id="contact" data-section>
          <div className="section-index reveal-item">/ 04</div>
          <div className="contact-intro">
            <SectionHeading eyebrow="Start a conversation" title="Have an idea? Let’s make it feel inevitable." />
            <a
              className="contact-email reveal-item"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
            >
              <Mail /> Prefer LinkedIn? Send a direct message
            </a>
          </div>

          <form className="contact-form reveal-item" onSubmit={handleSubmit}>
            <label>
              <span>Your name</span>
              <input name="name" type="text" placeholder="What should I call you?" required onInput={(event) => event.currentTarget.setCustomValidity('')} />
            </label>
            <label>
              <span>Email address</span>
              <input name="email" type="email" placeholder="you@company.com" required />
            </label>
            <label className="field-wide">
              <span>Project type</span>
              <select name="projectType" defaultValue="">
                <option value="" disabled>Select one</option>
                <option>Portfolio or marketing site</option>
                <option>Product interface</option>
                <option>Frontend development</option>
                <option>Creative collaboration</option>
              </select>
            </label>
            <label className="field-wide">
              <span>Tell me about the idea</span>
              <textarea name="message" rows="4" placeholder="A few details, goals, and a rough timeline…" required onInput={(event) => event.currentTarget.setCustomValidity('')} />
            </label>
            <button className="submit-button field-wide" type="submit">
              <span>Send enquiry <Send /></span>
            </button>
          </form>
          <div className="contact-shape parallax-object" aria-hidden="true"><Orbit /></div>
        </section>
      </main>

      <footer>
        <div>
          <a href="#home" className="brand">DK<span>®</span></a>
          <p>Designing and building from Chandigarh, India.</p>
        </div>
        <div className="footer-links">
          <a href="https://github.com/Dhiru12321" target="_blank" rel="noreferrer">GitHub <ArrowUpRight /></a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight /></a>
          <a href="#contact">Enquire <ArrowUpRight /></a>
        </div>
        <p className="footer-copy">
          © 2026 Dhirendra Kumar. Built with React.
          <motion.button
            className="back-to-top"
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to top"
            whileHover={reduceMotion ? undefined : { scale: 1.04 }}
            whileTap={reduceMotion ? undefined : { scale: 0.94 }}
          >
            <ArrowUp size={22} aria-hidden="true" />
          </motion.button>
        </p>
      </footer>
      {enquiryDetails && <EnquiryScheduler details={enquiryDetails} theme={theme} reduceMotion={reduceMotion} onClose={() => setEnquiryDetails(null)} />}
    </div>
  )
}

export default App
