# VIKE Portfolio

> **Vocal Interface for Kinetic Exploration**  
> Built by Senior Sir Geoffrey — Njoro, Kenya.

[![Deploy](https://github.com/Geoffrey-Karanja/vike-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/Geoffrey-Karanja/vike-portfolio/actions/workflows/deploy.yml)
[![Live](https://img.shields.io/badge/live-geoffrey--karanja.github.io%2Fvike--portfolio-0A84FF?style=flat)](https://geoffrey-karanja.github.io/vike-portfolio/)
![Built with SvelteKit](https://img.shields.io/badge/built%20with-SvelteKit-FF3E00?style=flat)
![Zero Cost](https://img.shields.io/badge/hosting-zero%20cost-30D158?style=flat)

---

## What is VIKE?

VIKE is not a portfolio. It is a **digital presence**.

Most developer portfolios are documents. This one is an experience — voice-first,
3D-interactive, cinematically animated, and built with the same attention to detail
that Apple applies to its Human Interface Guidelines.

It was built by a student from Njoro, Kenya with zero budget, a WSL2 Ubuntu
environment, and an unreasonable amount of ambition.

---

## Features

### 🎙️ Voice Interface
- Full **Web Speech API** integration — speak commands, VIKE responds
- Real-time **waveform visualizer** that dances to your voice frequency
- Carefully tuned synthesis voice — deliberate rate, authoritative pitch
- Mute toggle, listening/speaking/thinking states with fluid animations

### 🌌 GitHub Constellation
- Live projects rendered as **floating 3D cards** in Three.js space
- Drag to orbit, scroll to zoom, click to open project detail
- Direct **live demo links** — no GitHub redirects for deployed projects
- Auto-rotating when idle, physics-based camera transitions

### 🖥️ Terminal Interface
- Fully functional **command-line navigation**
- Boot sequence with synthesized **spatial audio chime**
- Real-time command parsing — voice and text unified
- `hireme` easter egg with canvas confetti burst 🎊

### 👤 About — A Full Experience
- **Character-by-character** name assembly with spring physics
- Click any letter — **bounce animation**
- **3D photo tilt** — mouse position drives perspective rotation
- Scroll-triggered narrative chapters
- Expandable **timeline** of milestones
- Animated **stats counter** — counts up on viewport entry
- **Cisco Cybersecurity cert** badge
- Live **currently learning** progress bars

### 📡 Contact
- Three connection channels — **WhatsApp, Email, GitHub**
- Each card glows its own color on hover
- Minimal form with character counter and dissolve-on-send
- VIKE speaks on open: *"Senior Sir Geoffrey is listening."*

### ✨ Polish
- **Adaptive theme** — accent color shifts with time of day
  - Dawn 🌅 → Amber · Day ☀️ → Blue · Dusk 🌆 → Red · Night 🌙 → Purple
- **Spotlight cursor** — radial gradient follows mouse
- **Particle trail** — 8-dot spring-physics cursor tail
- **Keyboard shortcuts** panel — press `?` to open
- **whoami modal** — photo card with CV link, slides up from bottom
- **Top navigation bar** — glass pill with live clock

### 📱 Mobile Experience
- Completely **separate mobile UI** — not just "responsive"
- Full-screen photo home with pill navigation
- **Gyroscope tilt** on project cards — physically tilt your phone
- Bottom navigation bar with five sections
- Voice interface works on mobile too
- whoami modal available from home screen

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit + Vite |
| 3D Engine | Three.js |
| Animation | GSAP + CSS animations |
| Voice | Web Speech API (Recognition + Synthesis) |
| Audio | Web Audio API (synthesized chime) |
| Styling | Vanilla CSS + Custom Properties |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |
| Cost | **$0.00** |

---

## Commands

Type these in the terminal or speak them to VIKE:

| Command | Action |
|---------|--------|
| `help` | Show all commands |
| `about` | My story |
| `projects` | Live work constellation |
| `tools` | Tech stack |
| `contact` | Get in touch |
| `vitals` | Live GitHub stats |
| `whoami` | Quick intro modal |
| `clear` | Clear terminal |
| `hireme` | 🎊 |

Press `?` anywhere to open the shortcuts panel.

---

## Local Development

### Prerequisites
- Node.js 18+
- WSL2 Ubuntu (or any Unix environment)
- VS Code with Remote-WSL extension

### Setup

```bash
VITE_GITHUB_USERNAME=your_github_username

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build

```bash
npm run build
```

Static output goes to `build/` — ready for any static host.

---

## Project Structure

src/
├── lib/
│   ├── components/
│   │   ├── core/          # Terminal, BootSequence, CommandInput, TopBar
│   │   ├── vike/          # VikeOrb, VoiceEngine, SynthEngine, Waveform
│   │   ├── constellation/ # StarField, RepoSheet (Three.js)
│   │   ├── sections/      # About, Tools, Contact, DevVitals
│   │   ├── mobile/        # MobileApp, MobileHome, MobileProjects
│   │   └── fx/            # SpotlightCursor, AdaptiveTheme, ShortcutsPanel
│   ├── stores/            # vike.js, github.js, theme.js, terminal.js
│   ├── actions/           # commandParser.js
│   ├── data/              # poetry.json, tools.json, narrative.json, projects.json
│   └── utils/             # audio.js, github.js, geo.js, time.js
├── routes/
│   └── +page.svelte       # Entry point — desktop/mobile switcher
├── app.html
└── app.css                # Global design system + CSS custom properties
static/
├── karan.jpeg             # Profile photo
├── cisco-cert.png         # Cisco certification
└── cv.html                # Downloadable CV
---

## Design Philosophy

> *"The best code is no code at all.  
> The best interface is the one you forget is there."*

Every decision in this portfolio was made with one question:  
**Would Apple ship this?**

- No unnecessary dependencies
- No paid APIs or services
- No backend — purely static, purely fast
- Every animation has a purpose
- Every sound is informative, never decorative
- Mobile is a different experience, not a smaller one

---

## About the Builder

**Geoffrey Kamau** — iOS Developer, Cybersecurity Enthusiast, Builder.  
Based in Njoro, Nakuru County, Kenya.

- 🛡️ Cisco Certified — Introduction to Cybersecurity (April 2026)
- 📱 iOS development with Swift & SwiftUI
- 🌐 Full stack web — JavaScript, Node.js, React
- 🐧 Linux since secondary school — Kali NetHunter on mobile

*"The next billion-dollar startup is forming."*

---

## Connect

| Channel | Link |
|---------|------|
| 💬 WhatsApp | [+254 740 833 524](https://wa.me/254740833524) |
| 📧 Email | [gkaranja273@gmail.com](mailto:gkaranja273@gmail.com) |
| 🐙 GitHub | [Geoffrey-Karanja](https://github.com/Geoffrey-Karanja) |
| 🌐 Portfolio | [vike-portfolio](https://geoffrey-karanja.github.io/vike-portfolio/) |

---

<div align="center">
  <sub>Built with zero budget and unreasonable ambition.</sub>
  <br />
  <sub>Njoro, Kenya → The world.</sub>
</div>