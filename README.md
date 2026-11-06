<div align="center">

# John Aaron Junio

### Cybersecurity-Focused Developer Portfolio

Building secure, reliable, and human-centered experiences across web, mobile, and connected systems.

[![Live Portfolio](https://img.shields.io/badge/VIEW_LIVE_PORTFOLIO-00F7FF?style=for-the-badge&logo=githubpages&logoColor=07111F)](https://kajohnbytr.github.io)
[![GitHub](https://img.shields.io/badge/GitHub-kajohnbytr-181717?style=for-the-badge&logo=github)](https://github.com/kajohnbytr)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-John_Aaron_Junio-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/john-aaron-castro-junio-8959b52a2)

</div>

---

## About the portfolio

This repository contains my personal portfolio—a responsive React application presenting my cybersecurity background, development capabilities, certificates, and selected software projects.

The experience includes an animated interface, responsive layouts, accessible interactions, a custom cursor, reusable components, and a hidden Hacker Mode with a terminal-inspired green theme.

> **Live website:** [kajohnbytr.github.io](https://kajohnbytr.github.io)

## Highlights

| Area | Implementation |
| --- | --- |
| Responsive interface | Optimized layouts for desktop, tablet, and mobile screens |
| Project showcase | Academic, mobile, IoT, and software-development projects |
| Certificates | Interactive previews for verified credentials and achievements |
| Animated experience | React Bits components, scroll reveals, logo loop, and hero effects |
| Hacker Mode | Hidden keyboard-triggered alternate theme with an animated green grid |
| Contact protection | Email verification workflow, validation, throttling, and bot mitigation |
| Deployment | Automated GitHub Pages deployment through GitHub Actions |

## Technology stack

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFFFFF)
![JavaScript](https://img.shields.io/badge/JavaScript-1F2937?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=FFFFFF)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)
![GSAP](https://img.shields.io/badge/GSAP-0E100F?style=for-the-badge&logo=greensock&logoColor=88CE02)
![Cloudflare](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=FFFFFF)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=githubpages&logoColor=FFFFFF)

</div>

## Featured work

- **Biometric IoT Attendance Monitoring System** — fingerprint-based university attendance platform with anti-proxy verification.
- **GPA Guru** — grade recommendation and GPA conversion application.
- **Guess It** — configurable number-guessing game developed with Python.
- **FindMySpot** — campus parking-availability mobile application concept.
- **DIVA Salon App** — mobile appointment and service-customization experience.

## Run locally

### Requirements

- Node.js 20 or newer
- npm
- Git

### Installation

```bash
git clone https://github.com/kajohnbytr/kajohnbytr.github.io.git
cd kajohnbytr.github.io
npm install
npm run dev
```

Open the local URL displayed by Vite, normally `http://localhost:5173`.

### Quality checks

```bash
npm run check
npm run build
```

The production output is generated inside `dist/`.

## Project structure

```text
.
├── public/
│   ├── certificates/       # Public credential files and previews
│   └── logos/              # Tool and technology logos
├── src/
│   ├── components/         # Animated and reusable React components
│   ├── App.jsx             # Portfolio content and application structure
│   ├── index.css           # Responsive design and theme system
│   └── main.jsx            # React entry point
├── worker/                  # Contact verification Cloudflare Worker
├── google-apps-script/      # Gmail delivery integration
└── .github/workflows/       # GitHub Pages deployment automation
```

## Contact-form security

The contact workflow is designed to verify inbox access before delivering a message. It includes:

- Six-digit email verification codes
- Expiring, one-way-hashed verification records
- Attempt limits and request cooldowns
- Origin restrictions and payload-size limits
- Server-side input validation
- Honeypot-based bot detection
- IP-based throttling

Secrets and credentials must remain in Cloudflare secrets or Google Apps Script properties. They must never be committed or exposed through browser-side `VITE_` variables.

## Deployment

Pushes to the `main` branch trigger the GitHub Actions workflow and deploy the latest production build to GitHub Pages.

[![Deployment](https://img.shields.io/github/actions/workflow/status/kajohnbytr/kajohnbytr.github.io/deploy.yml?branch=main&style=flat-square&label=GitHub%20Pages)](https://github.com/kajohnbytr/kajohnbytr.github.io/actions)

## Connect with me

- Portfolio: [kajohnbytr.github.io](https://kajohnbytr.github.io)
- GitHub: [github.com/kajohnbytr](https://github.com/kajohnbytr)
- LinkedIn: [John Aaron Junio](https://www.linkedin.com/in/john-aaron-castro-junio-8959b52a2)
- Email: [aronjunio02@gmail.com](mailto:aronjunio02@gmail.com)

---

<div align="center">

Designed and developed by **John Aaron Junio**.

</div>
