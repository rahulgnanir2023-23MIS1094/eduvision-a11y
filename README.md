# EduVision (BIS IS 17802: 2021 Compliant) 🎓

> **An inclusive, smart education web platform engineered for students with cognitive and visual impairments, powered by an instant UI transformation engine compliant with Indian Standard BIS IS 17802 (Part 1): 2021 and WCAG 2.1 Level AAA.**

---

## 📌 Problem Statement

Digital learning platforms are largely unusable for students with visual and cognitive impairments due to rigid visual design, poor contrast, and a lack of neurodivergent support — failing national accessibility mandates like BIS IS 17802.

**EduVision** bridges this divide with an instantly reactive **Accessibility Engine** that adapts the entire learning interface in real time to match the learner's individual sensory and cognitive needs.

---

## ✨ Key Features & The Accessibility Engine

### 1. 🛡️ The BIS IS 17802 Core Transformers (Instant Global UI Mutation)
* **Dyslexia-Friendly Typography Engine (`§ 8.4.1`)**: Automatically swaps typography to a high-legibility sans-serif with wide character tracking, `1.85` line-height leading, and expanded word spacing to prevent character reversal.
* **Ultra High-Contrast Mode (`§ 8.3.2`)**: Switches the entire application to an uncompromising **Black / Neon Yellow (`#ffff00`) / White** palette guaranteeing contrast ratios exceeding **7:1 (WCAG AAA)**.
* **Enhanced Focus Indicators (`§ 8.5.1`)**: Displays an unmissable **4px solid perimeter outline with dual-ring glow** around any focused or hovered interactive element, ensuring complete motor & keyboard usability.

### 2. 🎛️ Sensory & Cognitive Learning Aids
* **Dynamic Font Scalability (`§ 8.4.2`)**: Text scaling from 14px to 26px without layout clipping.
* **Reading Focus Guide (`§ 8.4.3`)**: Interactive horizontal tracking ruler that follows the mouse cursor to assist students with ADHD, visual tracking fatigue, and dyslexia.
* **Color Vision Deficiency (CVD) Filters**: Built-in spectral compensation filters for **Protanopia**, **Deuteranopia**, and **Tritanopia**.
* **Vestibular Motion Shield (`§ 8.2.1`)**: Instant elimination of animations, transitions, and pulsing cues.

### 3. 🎬 Multi-Modal Lesson Interface
* **Synchronized Interactive Transcript**: Auto-scroll tracking, keyword search filtering, and click-to-seek timestamp jumping.
* **Native Text-to-Speech (TTS)**: Web Speech API synthesis with animated audio wave visualizer and adjustable reading speed (0.75x, 1x, 1.25x).
* **Variable Video Playback Speed**: 0.75x to 1.5x speed adjustment for self-paced cognitive processing.
* **Cognitive Concept Notes**: "Explain Simply" key concept accordion summarizing mathematical formulas into bite-sized takeaways.

### 4. 📊 BIS IS 17802 Compliance Matrix & Student Analytics
* **Clause-by-Clause Audit Table**: Real-time evaluation against clauses `§ 8.3.1`, `§ 8.3.2`, `§ 8.4.1`, `§ 8.5.1`, `§ 8.6.2`, `§ 8.7.1`, and `§ 8.8.3`.
* **Live Compliance Rating Meter (0–100%)**: Dynamically calculated score reflecting the active assistive accommodations.
* **Audit Certificate Export**: One-click print/export report for regulatory compliance verification.

### 5. ⏱️ Focus & Self-Assessment Tools
* **Pomodoro Study Timer**: Accessible 25-minute study / 5-minute break cycles with auditory feedback.
* **Interactive Assessment Engine**: Accessible calculus and physics quizzes with timer, question navigator, and detailed step-by-step explanations.
* **Floating Accessibility Panel (FAB)**: Persistent bottom-right quick-access widget on all pages.

---

## ⌨️ Global Accessibility Shortcuts

Press <kbd>?</kbd> anywhere in the application to open the keyboard shortcuts dialog:

| Shortcut | Action | Standard Reference |
|---|---|---|
| <kbd>Alt</kbd> + <kbd>D</kbd> | Toggle Dyslexia-Friendly Mode | BIS IS 17802 § 8.4.1 |
| <kbd>Alt</kbd> + <kbd>H</kbd> | Toggle Ultra High-Contrast Palette | BIS IS 17802 § 8.3.2 |
| <kbd>Alt</kbd> + <kbd>F</kbd> | Toggle 4px Enhanced Focus Rings | BIS IS 17802 § 8.5.1 |
| <kbd>Alt</kbd> + <kbd>R</kbd> | Toggle Reading Focus Guide (Ruler) | BIS IS 17802 § 8.4.3 |
| <kbd>Alt</kbd> + <kbd>M</kbd> | Toggle Vestibular Reduced Motion | BIS IS 17802 § 8.2.1 |
| <kbd>Alt</kbd> + <kbd>+</kbd> | Increase Font Size | BIS IS 17802 § 8.4.2 |
| <kbd>Alt</kbd> + <kbd>-</kbd> | Decrease Font Size | BIS IS 17802 § 8.4.2 |
| <kbd>?</kbd> | Show / Hide Keyboard Shortcuts Modal | WCAG 2.1 § 2.1.4 |
| <kbd>Tab</kbd> *(at top)* | Skip directly to main learning content | WCAG 2.1 § 2.4.1 |

---

## 🔗 Quick URL Deep-Linking

Demonstrate any accessibility profile instantly by appending query parameters:
* **High-Contrast**: `http://localhost:5173/?mode=high-contrast`
* **Dyslexia Mode**: `http://localhost:5173/?mode=dyslexia`
* **Focus Mode**: `http://localhost:5173/?mode=focus`
* **Low-Vision Preset**: `http://localhost:5173/?mode=low-vision`

---

## 🏗️ Tech Stack

* **Frontend Framework:** React 19 + Vite 8
* **Styling & Theming:** Tailwind CSS v4 + Dynamic CSS Custom Properties Engine
* **Icons:** Lucide React
* **Routing:** React Router v7
* **PWA & Offline Engine:** Service Worker (Workbox / `vite-plugin-pwa`), Web App Manifest, Cache API
* **Audio Synthesis:** Web Speech API (`SpeechSynthesis`)
* **State Management:** React Context API (`AccessibilityContext`) + `localStorage` persistence

---

## 📶 Offline-First Architecture (PWA)

EduVision is engineered with an **offline-first Progressive Web App (PWA)** architecture to guarantee educational access for learners in rural and Tier 2/3 regions facing intermittent or absent internet connectivity:

### 1. How It Works
* **Complete App Shell Precaching:** Service Worker precaches all critical UI bundles (HTML, CSS, JavaScript, icons, manifest, and OpenDyslexic font files).
* **SPA Route Fallback:** All client-side React Router navigation endpoints (`/`, `/courses`, `/lesson/:id`, `/quiz/:id`, `/analytics`, `/accessibility`, `/settings`) automatically fallback to the cached application shell when offline.
* **Stale-While-Revalidate Runtime Caching:** Same-origin static assets and images are delivered immediately from cache while quietly checking for upstream updates in the background.
* **Local Font Packaging:** The **OpenDyslexic** typography files (`.woff2`) are bundled directly into the repository and precached locally, ensuring dyslexia formatting works flawlessly without any external CDN dependency.
* **Synchronized Offline Data:** All lesson transcripts, formulas, cognitive summaries, and interactive quizzes are bundled directly into the client package, enabling uninterrupted studying offline.
* **Accessible Connection Indicator:** The header features an accessible `ConnectionStatus` monitor that notifies users via dual visual cues and `aria-live` assertive speech when connection drops or resumes.
* **Offline Badge:** Course and lesson views display a verified `Available offline` badge when the Service Worker is actively controlling the application cache.

### 2. How to Test Offline Mode
1. **Build and Preview the Production PWA:**
   ```bash
   npm run build
   npm run preview
   ```
2. **Open in Browser:** Navigate to `http://localhost:4173/` (or the printed preview URL).
3. **Inspect Service Worker:** Open DevTools (<kbd>F12</kbd>) → **Application** tab → **Service Workers**. Confirm the worker is **activated and running**.
4. **Simulate Offline:**
   - In DevTools → **Network** tab (or **Application** tab), check the **Offline** checkbox.
   - Alternatively, turn off your system Wi-Fi / Ethernet adapter.
5. **Test Complete Route Navigation:**
   - Notice the connection pill switches to **Offline, lessons and settings still work**.
   - Navigate freely between `/`, `/courses`, `/lesson/1`, `/quiz/1`, `/analytics`, `/accessibility`, and `/settings`.
   - Reload any page (<kbd>Ctrl</kbd> + <kbd>R</kbd> / <kbd>F5</kbd>) while completely offline — the app instantly renders with 0 failed network requests!
   - Toggle Dyslexia Mode (<kbd>Alt</kbd> + <kbd>D</kbd>) and High-Contrast Mode (<kbd>Alt</kbd> + <kbd>H</kbd>) — all settings persist and render offline.

---

## 🚀 Quick Start Guide

### Prerequisites
* Node.js (v18 or higher recommended)
* npm or pnpm

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/rahulgnanir2023-23MIS1094/eduvision-a11y.git
cd eduvision-a11y

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Or build and test the offline-first PWA production build
npm run build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser to experience EduVision.

---

## 📜 Compliance Standards Verification

This project is built and audited against:
1. **Bureau of Indian Standards IS 17802 (Part 1): 2021** — *Accessibility Requirements for ICT Products and Services*.
2. **W3C Web Content Accessibility Guidelines (WCAG) 2.1** — *Conformance Levels A, AA, and AAA*.
3. **European Standard EN 301 549** — *Accessibility requirements for ICT products and services*.

---

## 📄 License

MIT License — free for educational and non-commercial development.
