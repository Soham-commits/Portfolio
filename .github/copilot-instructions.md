# Copilot Instructions

## Big Picture
- Static portfolio served from `index.html`, `aboutme.html`, and `Internship.html`; every page links the shared `style.css` and `main.js`, so DOM hooks must exist everywhere or be null-safe before adding new selectors.
- Layout relies on semantic sections (`<section id="..." class="section">`) plus a `.container` wrapper; reuse this scaffolding when inserting new content blocks so spacing and responsive rules apply automatically.
- All assets (images, resume PDF, logos) live under `Assets/`; keep the capital A, because the HTML alternates between `Assets/` and `assets/` and case-sensitive hosts will only serve `Assets/`.

## Local Workflow
- No bundler: open `index.html` in a browser or run a static server for faster reloads.
```bash
npx serve .
```
- When you add new sections, verify on mobile and desktop widths because the CSS contains many `@media (max-width: 768px)` rules that assume the default markup order.

## Styling System
- `style.css` is the single source of truth with root variables defining the dark theme palette and typography; extend colors by adding new `--color-*` tokens instead of hard-coded hex values.
- Components are grouped by section (hero, tech stack, projects, contact, timelines). Search for the section class before editing so you stay within the correct block rather than duplicating styles elsewhere.
- Buttons share `.btn`, `.btn-outline`, `.btn-outline-ghost`, and `.btn-primary`; mix these instead of creating new button classes so hover/press animations remain consistent.

## JavaScript Architecture (`main.js`)
- `PortfolioApp` boots on load and instantiates modules: `Navigation`, `Animations`, `ContactForm`, `InteractiveElements`, `PerformanceOptimizer`, `MobileOptimizer`, plus helper functions `timelineInit()` and `horizontalTimelineInit()`.
- `Navigation` expects `.nav-toggle`, `.nav-menu`, and anchor links targeting section IDs; whenever you add a new section, add a matching `href="#section-id"` so active-state highlighting keeps working.
- `Animations` and `InteractiveElements` drive IntersectionObserver reveals and hover effects for `.project-card`, `.tech-badge`, `.planet`, `.orbit`, `.hero-name-centered`, etc.; reuse those class names when introducing new cards or tech badges to get animations for free.
- `ContactForm` targets `#contactForm` on `index.html`, performs inline validation, and fakes submission via `submitForm()`; replace that Promise with a real `fetch()` call if connecting to a backend, but keep the success/error messaging structure intact.
- Timeline utilities expect `.timeline-item` / `.timeline-node` (vertical) and `.htl-track` plus `.htl-nav-left|right` (horizontal). Follow the existing markup in `aboutme.html` when building additional steps.

## Page-Specific Notes
- `aboutme.html` and `Internship.html` import the same JS; gate any new DOM queries behind `document.querySelector(...)` checks or optional chaining so those pages don't throw when elements are absent.
- `Internship.html` includes an inline script that toggles `.internship-card__projects-section`; if you move that interaction into `main.js`, ensure only one listener attaches by scoping to that page's elements.
- Resume downloads and hero graphics live under `Assets/Resume(latest).pdf` and `Assets/IMG_3993.jpg`; update both the file and every reference when swapping assets to avoid broken links.

## Testing & QA
- Manual test loop: run the static server, click each nav item (including page-to-page links), submit the contact form with valid/invalid data, toggle the internship project accordion, and scroll to confirm animations still enter the viewport smoothly.
- Keep an eye on the console: `main.js` logs initialization success and will surface missing selectors—fix those before shipping because they indicate a broken hook.
