import { useCallback, useEffect, useRef, useState } from 'react'
import { SiBlender, SiFigma, SiLaravel, SiMysql, SiReact, SiWireshark } from 'react-icons/si'
import AnimatedContent from './components/AnimatedContent/AnimatedContent.jsx'
import LogoLoop from './components/LogoLoop/LogoLoop.jsx'
import TechText from './components/TechText/TechText.jsx'

const navItems = ['about', 'skills', 'certificates', 'projects', 'contact']

const skills = [
  ['fa-shield-halved', 'Cybersecurity', 'Network security, threat analysis, and vulnerability assessment'],
  ['fa-code', 'Full-stack Development', 'React, Laravel, REST APIs, and secure integrations'],
  ['fa-mobile-screen', 'Mobile Development', 'React Native, Expo, Kotlin, and Android applications'],
  ['fa-microchip', 'IoT Systems', 'ESP32, ESP8266, sensors, and hardware-to-software communication'],
  ['fa-pen-ruler', 'UI/UX Design', 'User-centered design, prototyping, and responsive interfaces'],
  ['fa-database', 'Database Design', 'MySQL, relational modeling, migrations, and data security'],
]

const certificates = [
  ['cybersecurity career.jpg', 'Cybersecurity', 'Cybersecurity Career', 'Professional development and career preparation in cybersecurity.'],
  ['how ai driven.png', 'Artificial intelligence', 'How AI-Driven Technology Works', 'Practical learning in AI-driven technology and modern applications.'],
  ['security rish to consider with AI integration.png', 'AI security', 'Security Risks in AI Integration', 'Identifying and evaluating security risks in AI-enabled systems.'],
  ['UI UX Certificate.jpg', 'Product design', 'UI/UX Design', 'User-centered interface design, prototyping, and usability principles.'],
  ['HackforGov4.jpg', 'Cybersecurity competition', 'HackforGov 4', "Active participant in DICT Region I's 2025 Cyber Guardians event."],
  ['HackforGov5.jpg', 'Cybersecurity competition', 'HackforGov 5', "Represented UPANG Team A in DICT Region I's 2026 digital defense competition."],
  ['Cert of Appearance.jpg', 'Official recognition', 'HackforGov 5 - Certificate of Appearance', 'Official recognition of attendance at the 2026 Region I competition.'],
]

const projects = [
  { icon: 'fa-dice', title: 'Lucky Guess', period: '2023-2024', text: 'A team-built Python number-guessing game with configurable number ranges and attempt limits.', tags: ['Python', 'Team Project'] },
  { icon: 'fa-graduation-cap', title: 'GPA Guru', period: '2023-2024', text: 'A solo Java application that recommends target grades and converts between five-point and grade-point scales.', tags: ['Java', 'Solo Project'] },
  { icon: 'fa-keyboard', title: 'Finger Tango', period: '2023-2024', text: 'A team-developed web application that turns accurate typing practice into a weapon-based game experience.', tags: ['Web Application', 'Team Project'] },
  { icon: 'fa-square-parking', title: 'FindMySpot', period: '2024-2025', text: 'A mobile application that helps PHINMA University of Pangasinan students check parking-space availability at the Dagupan main campus.', tags: ['Mobile App', 'Campus Utility'] },
  { icon: 'fa-scissors', title: 'DIVA Salon App', period: '2024-2025', text: 'A mobile salon appointment application where clients select their preferred provider and customize the services they want.', tags: ['Mobile App', 'Booking System'] },
  { icon: 'fa-fingerprint', title: 'Biometric IoT Attendance Monitoring System', period: '2025-Present', text: 'An IoT fingerprint attendance platform with anti-proxy verification, designed to automate university attendance recording and strengthen academic integrity.', tags: ['IoT', 'Cybersecurity', 'Full-stack'] },
]

const techLogos = [
  { node: <SiReact />, title: 'React', hoverColor: '#61dafb' },
  { node: <SiLaravel />, title: 'Laravel', hoverColor: '#ff2d20' },
  { node: <SiMysql />, title: 'MySQL', hoverColor: '#4479a1' },
  { node: <SiFigma />, title: 'Figma', hoverColor: '#a259ff' },
  { node: <SiBlender />, title: 'Blender', hoverColor: '#f5792a' },
  { node: <SiWireshark />, title: 'Wireshark', hoverColor: '#1679a7' },
  { src: '/logos/photoshop.svg', alt: 'Adobe Photoshop', title: 'Photoshop' },
  { src: '/logos/nmap.svg', alt: 'Nmap', title: 'Nmap' },
  { src: '/logos/canva.svg', alt: 'Canva', title: 'Canva' },
]

function CustomCursor() {
  const dot = useRef(null)
  const outline = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const move = (event) => {
      dot.current?.style.setProperty('transform', `translate3d(${event.clientX - 4}px, ${event.clientY - 4}px, 0)`)
      outline.current?.style.setProperty('transform', `translate3d(${event.clientX - 16}px, ${event.clientY - 16}px, 0)`)
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return <><div ref={dot} className="cursor-dot" /><div ref={outline} className="cursor-outline" /></>
}

function CertificateModal({ certificate, onClose }) {
  useEffect(() => {
    if (!certificate) return undefined

    const close = (event) => event.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', close)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', close)
    }
  }, [certificate, onClose])

  if (!certificate) return null
  const isPdf = certificate.path.toLowerCase().endsWith('.pdf')
  return (
    <div className="certificate-modal" role="dialog" aria-modal="true" aria-labelledby="certificate-modal-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="certificate-modal__dialog">
        <div className="certificate-modal__header">
          <h2 id="certificate-modal-title" className="certificate-modal__title">{certificate.title}</h2>
          <button type="button" className="certificate-modal__close" aria-label="Close certificate viewer" onClick={onClose} autoFocus><i className="fas fa-times" aria-hidden="true" /></button>
        </div>
        <div className="certificate-modal__body">
          {isPdf ? <iframe src={`${certificate.path}#view=FitH`} title={certificate.title} /> : <img src={certificate.path} alt={certificate.title} />}
        </div>
      </div>
    </div>
  )
}

function ContactForm() {
  const openedAt = useRef(0)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', verificationCode: '', _honey: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)
  const [requestingCode, setRequestingCode] = useState(false)
  const [codeRequested, setCodeRequested] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const contactApiUrl = (import.meta.env.VITE_CONTACT_API_URL || '').replace(/\/$/, '')

  useEffect(() => { openedAt.current = Date.now() }, [])
  useEffect(() => {
    if (cooldown <= 0) return undefined
    const timer = window.setInterval(() => setCooldown((seconds) => Math.max(0, seconds - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [cooldown])

  const normalize = (value) => [...value]
    .filter((character) => {
      const code = character.charCodeAt(0)
      return code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127)
    })
    .join('')
    .replace(/[ \t]+/g, ' ')
    .trim()
  const suspicious = (value) => /<\s*script|javascript\s*:|data\s*:\s*text\/html|on(?:error|load|click)\s*=|\b(?:union\s+select|drop\s+table)\b/i.test(value) || (value.match(/https?:\/\//gi) || []).length > 3

  const validate = () => {
    const next = {}
    const name = normalize(form.name)
    const email = normalize(form.email)
    const subject = normalize(form.subject)
    const message = normalize(form.message)
    const verificationCode = form.verificationCode.trim()
    if (!/^[\p{L}\p{M}][\p{L}\p{M} .'-]{1,79}$/u.test(name)) next.name = 'Enter a valid name using 2-80 characters.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) next.email = 'Enter a valid email address.'
    if (subject.length < 3 || subject.length > 120 || /[\r\n]/.test(subject)) next.subject = 'Use 3-120 characters without line breaks.'
    if (message.length < 10 || message.length > 2000) next.message = 'Use 10-2000 characters.'
    if (!/^\d{6}$/.test(verificationCode)) next.verificationCode = 'Enter the six-digit code sent to your email.'
    for (const [key, value] of Object.entries({ name, email, subject, message })) if (suspicious(value)) next[key] = 'Remove unsafe markup, code, or excessive links.'
    setForm((current) => ({ ...current, name, email, subject, message, verificationCode }))
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const requestCode = async () => {
    setStatus(null)
    const email = normalize(form.email).toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      setErrors((current) => ({ ...current, email: 'Enter a valid email address first.' }))
      return
    }
    if (!contactApiUrl) {
      setStatus({ type: 'error', text: 'Email verification is not configured yet. Please use the email link instead.' })
      return
    }
    if (form._honey || Date.now() - openedAt.current < 3000) {
      setStatus({ type: 'error', text: 'Please wait a moment, then try again.' })
      return
    }

    setRequestingCode(true)
    setStatus({ type: 'info', text: 'Sending a verification code to your inbox...' })
    try {
      const response = await fetch(`${contactApiUrl}/api/request-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website: form._honey }),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok) throw new Error(result?.message || 'Unable to send verification code.')
      setForm((current) => ({ ...current, email, verificationCode: '' }))
      setCodeRequested(true)
      setCooldown(60)
      setStatus({ type: 'success', text: 'Verification code sent. Check your inbox and spam folder; it expires in 10 minutes.' })
    } catch (error) {
      console.error('Verification request failed:', error)
      setStatus({ type: 'error', text: error.message || 'Unable to send the verification code right now.' })
    } finally { setRequestingCode(false) }
  }

  const submit = async (event) => {
    event.preventDefault()
    setStatus(null)
    if (!validate()) return setStatus({ type: 'error', text: 'Please review the highlighted fields.' })
    if (form._honey) return setStatus({ type: 'error', text: 'Your message could not be verified.' })
    if (Date.now() - openedAt.current < 3000) return setStatus({ type: 'error', text: 'Please review your message before sending.' })
    const lastSent = Number(localStorage.getItem('portfolioContactLastSent') || 0)
    if (Date.now() - lastSent < 60000) return setStatus({ type: 'error', text: 'Please wait one minute before sending another message.' })

    setSending(true)
    setStatus({ type: 'info', text: 'Sending your message securely...' })
    try {
      if (!contactApiUrl) throw new Error('Contact service is not configured.')
      const response = await fetch(`${contactApiUrl}/api/submit-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website: form._honey }),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok) throw new Error(result?.message || 'Submission failed')
      localStorage.setItem('portfolioContactLastSent', String(Date.now()))
      setForm({ name: '', email: '', subject: '', message: '', verificationCode: '', _honey: '' })
      setCodeRequested(false)
      setCooldown(0)
      setStatus({ type: 'success', text: 'Email verified and message sent successfully. I will get back to you soon.' })
    } catch (error) {
      console.error('Contact form submission failed:', error)
      setStatus({ type: 'error', text: 'Unable to send right now. Please email aronjunio02@gmail.com directly.' })
    } finally { setSending(false) }
  }

  const update = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    if (name === 'email') setCodeRequested(false)
  }

  const field = (name, label, icon, placeholder, type = 'text') => (
    <div className={`form-field ${errors[name] ? 'has-error' : ''}`}>
      <label htmlFor={`contact-${name}`}>{label}</label>
      <div className="form-control"><i className={`fas ${icon}`} aria-hidden="true" /><input id={`contact-${name}`} name={name} type={type} value={form[name]} onChange={update} placeholder={placeholder} maxLength={name === 'email' ? 254 : name === 'subject' ? 120 : 80} required aria-invalid={Boolean(errors[name])} aria-describedby={`${name}-error`} /></div>
      <p id={`${name}-error`} className="field-error" aria-live="polite">{errors[name]}</p>
    </div>
  )

  return (
    <form id="contact-form" noValidate onSubmit={submit}>
      <div className="form-honeypot" aria-hidden="true"><label htmlFor="company-website">Leave empty</label><input id="company-website" name="_honey" value={form._honey} onChange={update} tabIndex="-1" autoComplete="off" /></div>
      {field('name', 'Your name', 'fa-user', 'e.g. Maria Santos')}
      {field('email', 'Email address', 'fa-envelope', 'you@example.com', 'email')}
      <div className={`form-field verification-field ${errors.verificationCode ? 'has-error' : ''}`}>
        <div className="verification-heading"><label htmlFor="contact-verificationCode">Email verification</label>{codeRequested && <span className="verification-badge"><i className="fas fa-circle-check" /> Code sent</span>}</div>
        <div className="verification-row">
          <div className="form-control"><i className="fas fa-key" aria-hidden="true" /><input id="contact-verificationCode" name="verificationCode" type="text" inputMode="numeric" autoComplete="one-time-code" value={form.verificationCode} onChange={update} placeholder="6-digit code" maxLength="6" required aria-invalid={Boolean(errors.verificationCode)} aria-describedby="verificationCode-error" /></div>
          <button type="button" className="verification-button" onClick={requestCode} disabled={requestingCode || cooldown > 0}>{requestingCode ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : codeRequested ? 'Resend code' : 'Send code'}</button>
        </div>
        <p id="verificationCode-error" className="field-error" aria-live="polite">{errors.verificationCode}</p>
      </div>
      {field('subject', 'Subject', 'fa-pen', 'Project inquiry')}
      <div className={`form-field ${errors.message ? 'has-error' : ''}`}>
        <label htmlFor="contact-message">Message</label>
        <div className="form-control form-control--textarea"><i className="fas fa-message" aria-hidden="true" /><textarea id="contact-message" name="message" rows="5" value={form.message} onChange={update} placeholder="Tell me about your project, timeline, and goals..." maxLength="2000" required aria-invalid={Boolean(errors.message)} aria-describedby="message-error message-counter" /></div>
        <div className="field-meta"><p id="message-error" className="field-error" aria-live="polite">{errors.message}</p><span id="message-counter">{form.message.length} / 2000</span></div>
      </div>
      {status && <div className={`form-status is-visible is-${status.type}`} role="status" aria-live="polite">{status.text}</div>}
      <button id="contact-submit" type="submit" className={`neon-button contact-submit ${sending ? 'is-loading' : ''}`} disabled={sending}><span>{sending ? 'Sending securely...' : 'Send Message'}</span><i className="fas fa-paper-plane" aria-hidden="true" /></button>
      <p className="form-privacy"><i className="fas fa-shield-halved" aria-hidden="true" /> Your email must be verified before delivery. Codes expire after 10 minutes and are never stored in plain text.</p>
    </form>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [modal, setModal] = useState(null)
  const [hackerMode, setHackerMode] = useState(() => localStorage.getItem('portfolioTheme') === 'hacker')
  const [themeAnimating, setThemeAnimating] = useState(false)
  const themeTimer = useRef(null)
  const showCertificate = (path, title) => setModal({ path, title })

  useEffect(() => {
    document.documentElement.dataset.theme = hackerMode ? 'hacker' : 'default'
    localStorage.setItem('portfolioTheme', hackerMode ? 'hacker' : 'default')
    return () => delete document.documentElement.dataset.theme
  }, [hackerMode])

  useEffect(() => () => clearTimeout(themeTimer.current), [])

  const toggleHackerMode = useCallback(() => {
    setThemeAnimating(true)
    setHackerMode((active) => !active)
    clearTimeout(themeTimer.current)
    themeTimer.current = setTimeout(() => setThemeAnimating(false), 700)
  }, [])

  useEffect(() => {
    let sequence = ''
    const listenForSecret = (event) => {
      const element = event.target
      const isTyping = element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element?.isContentEditable
      if (isTyping) return

      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'h') {
        event.preventDefault()
        toggleHackerMode()
        sequence = ''
        return
      }

      if (event.key.length === 1 && /[a-z]/i.test(event.key)) {
        sequence = `${sequence}${event.key.toLowerCase()}`.slice(-4)
        if (sequence === 'hack') {
          toggleHackerMode()
          sequence = ''
        }
      }
    }
    window.addEventListener('keydown', listenForSecret)
    return () => window.removeEventListener('keydown', listenForSecret)
  }, [toggleHackerMode])

  return (
    <div className={`app-shell ${themeAnimating ? 'theme-is-changing' : ''}`}>
      <CustomCursor />
      <div className="theme-transition-overlay" aria-hidden="true" />
      <header className="site-header">
        <div className="site-header__inner">
          <button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`} /></button>
          <nav className={menuOpen ? 'site-nav is-open' : 'site-nav'} aria-label="Main navigation">
            <a href="#hero" onClick={() => setMenuOpen(false)}>Home</a>
            {navItems.map((item) => <a key={item} href={`#${item}`} onClick={() => setMenuOpen(false)}>{item[0].toUpperCase() + item.slice(1)}</a>)}
          </nav>
        </div>
      </header>

      <main>
        <section id="hero" className="hero-section">
          <div className="grid-pattern" />
          <div className="hero-orb hero-orb--one" /><div className="hero-orb hero-orb--two" />
          <div className="glass-card hero-card">
            <span className="section-kicker">Cybersecurity · Development · Design</span>
            <div className="hero-tech-text">
              <TechText
                text="JOHN AARON"
                fontFamily="Poppins"
                fontWeight={700}
                fontSize={150}
                reveal="letter"
                dashLength={4}
                dashGap={3}
                specks={12}
                intro="metrics"
                introDuration={1.8}
                clickKick
                guides={false}
                letterSpacing={-0.04}
                color="#f8fafc"
                accentColor="#00f7ff"
              />
            </div>
            <h1>Secure ideas, built into <span className="gradient-text">useful experiences.</span></h1>
            <p>I&apos;m John Aaron Junio, a cybersecurity-focused developer building reliable web, mobile, and connected systems.</p>
            <div className="hero-actions"><a href="#projects" className="primary-action">Explore my work <i className="fas fa-arrow-right" /></a><a href="#contact" className="secondary-action">Start a conversation</a></div>
          </div>
        </section>

        <section id="about" className="content-section"><div className="section-shell about-grid"><AnimatedContent className="about-reveal" distance={65} direction="horizontal" reverse duration={0.7} blur={4} threshold={0.15} once={false}><div className="about-heading"><span className="section-kicker">About me</span><h2>Security-minded development with a human-centered approach.</h2></div></AnimatedContent><AnimatedContent className="about-reveal" distance={65} direction="horizontal" duration={0.7} blur={4} threshold={0.15} delay={0.08} once={false}><div className="glass-card about-copy"><p>I&apos;m a BSIT student majoring in Cybersecurity with hands-on experience across full-stack applications, mobile systems, IoT integrations, and interface design.</p><p>I connect security, architecture, and usability so the final product is not only functional, but dependable and easy to use.</p><div className="social-links"><a href="https://github.com/kajohnbytr" target="_blank" rel="noreferrer" aria-label="GitHub"><i className="fab fa-github" /></a><a href="https://www.linkedin.com/in/john-aaron-castro-junio-8959b52a2" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a></div></div></AnimatedContent></div></section>

        <section id="skills" className="content-section section-tint"><div className="section-shell"><div className="section-heading"><span className="section-kicker">Capabilities</span><h2>What I bring to a project</h2></div><div className="skills-grid">{skills.map(([icon, title, text], index) => <AnimatedContent className="card-reveal" key={title} distance={55} direction="vertical" duration={0.65} blur={4} threshold={0.12} delay={index * 0.04} once={false}><article className="glass-card skill-card"><i className={`fas ${icon}`} /><h3>{title}</h3><p>{text}</p></article></AnimatedContent>)}</div></div></section>

        <section className="tools-section" aria-labelledby="tools-title"><div className="section-shell"><div className="tools-heading"><div><span className="section-kicker">Tools & technologies</span><h2 id="tools-title">The toolkit behind my work</h2></div><p>Development, design, networking, and security tools used across my academic and personal projects.</p></div><div className="logo-loop-shell"><LogoLoop logos={techLogos} speed={70} direction="left" logoHeight={42} gap={54} hoverSpeed={0} scaleOnHover labels="hover" muted={0.12} scrollBoost={0.4} ariaLabel="Tools and technologies" /></div></div></section>

        <section id="certificates" className="content-section"><div className="section-shell">
          <div className="certificate-heading"><div><span className="section-kicker">Verified learning & professional credentials</span><h2 className="gradient-text">Certificates & Achievements</h2></div><p className="certificate-intro">A focused record of continuous learning across cybersecurity, artificial intelligence, and experience design.</p></div>
          <AnimatedContent className="featured-reveal" distance={65} direction="vertical" duration={0.75} blur={5} threshold={0.1} once={false}><article className="featured-certificate glass-card"><div className="featured-certificate__visual"><div className="certificate-emblem"><i className="fas fa-shield-halved" /></div><span className="certificate-status"><i className="fas fa-circle-check" /> Digitally verified</span></div><div className="featured-certificate__content"><span className="professional-label">Professional certificate</span><h3>Certified Cybersecurity Professional (CCP)</h3><p>Completed the Appkademiya cybersecurity certification module, demonstrating focused professional development in core cybersecurity practices.</p><dl className="certificate-meta"><div><dt>Issuer</dt><dd>Appkademiya</dd></div><div><dt>Issued</dt><dd>October 19, 2026</dd></div><div><dt>Status</dt><dd>Digitally Verified</dd></div></dl><div className="certificate-actions"><button type="button" className="neon-button certificate-button" onClick={() => showCertificate('/certificates/Appkademiya.pdf', 'Certified Cybersecurity Professional (CCP)')}><i className="fas fa-eye" /> View credential</button><a className="certificate-link" href="/certificates/Appkademiya.pdf" target="_blank" rel="noreferrer">Open PDF <i className="fas fa-arrow-up-right-from-square" /></a></div></div></article></AnimatedContent>
          <div className="certificate-grid">{certificates.map(([file, category, title, text], index) => <AnimatedContent className="card-reveal" key={file} distance={55} direction="vertical" duration={0.65} blur={4} threshold={0.1} delay={index * 0.035} once={false}><article className="certificate-card glass-card"><img src={`/certificates/${file}`} alt={`${title} certificate preview`} loading="lazy" /><div className="certificate-card__content"><span className="certificate-category">{category}</span><h3>{title}</h3><p>{text}</p><button type="button" className="certificate-card__action" onClick={() => showCertificate(`/certificates/${file}`, `${title} certificate`)}>View certificate <i className="fas fa-arrow-right" /></button></div></article></AnimatedContent>)}</div>
        </div></section>

        <section id="projects" className="content-section section-tint"><div className="section-shell"><div className="section-heading"><span className="section-kicker">Selected projects</span><h2>Ideas turned into working systems</h2></div><div className="projects-grid">{projects.map((project, index) => <AnimatedContent className="project-reveal" key={project.title} distance={70} direction="vertical" duration={0.7} ease="power3.out" blur={5} threshold={0.12} delay={index * 0.04} once={false}><article className="glass-card project-card"><div className="project-card__top"><div className="project-icon"><i className={`fas ${project.icon}`} /></div><span className="project-period">{project.period}</span></div><h3>{project.title}</h3><p>{project.text}</p><div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article></AnimatedContent>)}</div></div></section>

        <section id="contact" className="content-section"><div className="section-shell"><div className="section-heading"><span className="section-kicker">Get in touch</span><h2>Let&apos;s build something dependable.</h2></div><div className="contact-grid"><aside className="glass-card contact-info"><h3>Connect with me</h3><p>Have a project, opportunity, or technical challenge? Send the details and I&apos;ll respond as soon as possible.</p><ul><li><i className="fas fa-envelope" /><div><span>Email</span><a href="mailto:aronjunio02@gmail.com">aronjunio02@gmail.com</a></div></li><li><i className="fas fa-location-dot" /><div><span>Location</span><p>Tarlac, Philippines</p></div></li><li><i className="fas fa-briefcase" /><div><span>Available for</span><p>Freelance projects and professional opportunities</p></div></li></ul></aside><div className="contact-form-card glass-card"><div className="contact-form-heading"><span className="section-kicker">Start a conversation</span><h3>Send me a message</h3><p>I usually respond within 1-2 business days.</p></div><ContactForm /></div></div></div></section>
      </main>
      <footer><p>© 2026 John Aaron Junio. All rights reserved.</p></footer>
      <CertificateModal certificate={modal} onClose={() => setModal(null)} />
    </div>
  )
}
