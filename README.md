# The Corner Loaf

The Corner Loaf is an artisanal neighbourhood bakery located on Boundary Road in East Legon, Accra. Marcus bakes fresh sourdough bread and pastries in small morning batches.

This repository documents the incremental design, development, and accessibility refactoring of the bakery's web presence across project modules.

---

## Run locally

This is a static site with no build step, but it uses ES modules (`<script type="module">`), so it has to be served over HTTP. Opening `index.html` directly from the file system will not work in most browsers.

You can run the project locally using any of the following methods:

### Option 1: VS Code Live Server
If you're using Visual Studio Code:
- Install the Live Server extension.
- Open the project folder in VS Code.
- Right-click index.html.
- Select Open with Live Server.

The site will open in your default browser at <http://localhost:5500>.

### Option 2: Node.js
If you have Node.js installed, run:
```bash
npx serve
```
Then open the local URL displayed in your terminal.

### Option 3: Python
If you have Python installed, run:
```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. (`npx serve` works too.)

---


## Project Documentation

The project documentation is organised by module:

* **Module 1 (EE01) — Initial Redesign & Mobile-First Architecture**  
  👉 **[docs/ee01/ee01.md](docs/ee01/ee01.md)**  
  Covers the original audit of the legacy website, initial mobile-first layout sketches, answering the 3 core questions within 5 seconds of loading, semantic foundation, and initial order flow.

* **Module 2 (EE02) — Peer Accessibility Audit & WCAG 2.2 Refactoring**  
  👉 **[docs/ee02/ee02.md](docs/ee02/ee02.md)**  
  Covers the peer accessibility audit of Samuel Attu's website, response and resolution of findings from the peer audit of The Corner Loaf, the layout evolution from EE01 to EE02, and implemented improvements beyond the audit scope (vestibular safety and motor accessibility).

