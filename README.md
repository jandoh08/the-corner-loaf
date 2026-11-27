# The Corner Loaf

The Corner Loaf is an artisanal neighbourhood bakery located on Boundary Road in East Legon, Accra. Marcus bakes fresh sourdough bread and pastries in small morning batches.

---

## Run locally

### Prerequisites

- [Node.js](https://nodejs.org/) (version specified in `.nvmrc`)
- npm

### Setup and Development

1. **Clone the repository and install dependencies:**

   ```bash
   git clone https://github.com/jandoh08/the-corner-loaf.git
   cd the-corner-loaf
   npm install
   ```

2. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open the printed local URL (e.g., `http://localhost:5173/the-corner-loaf/` — the path suffix depends on `VITE_BASE_URL` and defaults to `/the-corner-loaf/` in `vite.config.js`) in your browser.

### Available Scripts

| Script         | Command                | Description                                                           |
| :------------- | :--------------------- | :-------------------------------------------------------------------- |
| `dev`          | `npm run dev`          | Starts the Vite development server with Hot Module Replacement        |
| `build`        | `npm run build`        | Builds the optimized production site into `dist/`                     |
| `preview`      | `npm run preview`      | Locally serves the production build in `dist/`                        |
| `lint:js`      | `npm run lint:js`      | Runs ESLint on JavaScript files (--max-warnings 0)                    |
| `lint:css`     | `npm run lint:css`     | Runs Stylelint on CSS files                                           |
| `lint`         | `npm run lint`         | Runs both ESLint and Stylelint                                        |
| `format`       | `npm run format`       | Formats all supported files using Prettier                            |
| `format:check` | `npm run format:check` | Checks code formatting against Prettier rules without modifying files |

---

## Project Documentation

The project documentation is organised by module:

- **Module 1 (EE01) — Initial Redesign & Mobile-First Architecture**  
  👉 **[docs/ee01/ee01.md](docs/ee01/ee01.md)**  
  Covers the original audit of the legacy website, initial mobile-first layout sketches, answering the 3 core questions within 5 seconds of loading, semantic foundation, and initial order flow.

- **Module 2 (EE02) — Peer Accessibility Audit & WCAG 2.2 Refactoring**  
  👉 **[docs/ee02/ee02.md](docs/ee02/ee02.md)**  
  Covers the peer accessibility audit of Samuel Attu's website, response and resolution of findings from the peer audit of The Corner Loaf, the layout evolution from EE01 to EE02, and implemented improvements beyond the audit scope (vestibular safety and motor accessibility).

- **Module 3 (EE03) — Dev Tooling & Version Control**  
  👉 **[docs/ee03/ee03.md](docs/ee03/ee03.md)**  
  Covers the codebase comparison and version selection, modular project architecture, Git branching and pull request workflow, review checklist, and repository configuration conventions.
