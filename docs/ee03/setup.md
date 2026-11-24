# EE03 ? Dev Tooling & Version Control Setup

## 1. Choosing the Base Site (`jandoh08/the-corner-loaf`)

We agreed to build on [`jandoh08/the-corner-loaf`](https://github.com/jandoh08/the-corner-loaf) rather than [`Samuel-Attu/the-corner-loaf`](https://github.com/Samuel-Attu/the-corner-loaf) for three engineering reasons:

- **Modular root structure for parallel work:** `index.html` sits at the repository root with section-scoped CSS (`css/today.css`, `css/order.css`, etc.) and 7 native ES modules (`js/data.js`, `js/helpers.js`, `js/order.js`, etc.). Two developers can work on different sections without constantly colliding, whereas `Samuel-Attu` stores its live site inside `ee01/` in a 1,289-line `styles.css` and 955-line `script.js`.
- **Clean accessibility baseline:** `jandoh08` has zero WCAG 2.2 AA contrast failures, Accra-timezone live status polling, Windows High Contrast Mode (`forced-colors: active`) support, and a `<noscript>` fallback.
- **Lower integration cost:** `jandoh08` already uses native ES modules, so Vite drops in without restructuring files, and porting discrete features later is straightforward.

## 2. Project Structure & Team Conventions

```text
.
??? .github/
?   ??? pull_request_template.md   # Standardized PR questions & self-review checklist
?   ??? workflows/ci.yml           # Automated PR quality gate (lint, format, build)
??? css/                           # Design tokens + section-scoped stylesheets
??? docs/
?   ??? ee01/                      # Module 1 documentation
?   ??? ee02/                      # Module 2 accessibility audits & write-up
?   ??? ee03/setup.md              # Module 3 tooling & workflow explanation
??? fonts/                         # Self-hosted WOFF2 typography
??? images/                        # WebP product photography
??? js/                            # ES modules (data, helpers, section controllers)
??? .gitignore                     # Excludes node_modules, dist, logs, and env files
??? .prettierignore                # Excludes generated/lock files from formatting
??? .prettierrc.json               # Shared formatting rules
??? .stylelintrc.json              # CSS quality & deprecation checks
??? eslint.config.js               # Flat ESLint config for browser ES modules
??? index.html                     # Root entry point
??? package.json                   # Shared scripts & devDependencies
```

We follow AmaliTech's Git conventions throughout:

- **Branching:** `main` (production) <- `develop` (shared integration) <- `feature/<name>` or `bugfix/<name>` (lowercase, hyphenated, deleted after merge).
- **Commits:** Atomic Conventional Commits (`type(scope): subject`, e.g., `chore(tooling): ...`, `ci(workflow): ...`, `docs(ee03): ...`).
- **Sync & Review:** Pull `develop` into the feature branch and resolve conflicts locally before pushing. PRs must answer what changed, why, how it was tested, and any breaking changes, with review comments labeled by type and `blocking` vs. `optional`.

## 3. What Each Piece of Configuration Does (and Why It Matters)

- **`.gitignore`:** Prevents `node_modules/`, `dist/`, logs, and `.env` files from entering Git history, keeping PR diffs readable and avoiding machine-specific conflicts.
- **`package.json` + Vite (`dev`, `build`, `preview`):** Eliminates the `file://` limitation of native ES modules by giving both developers one predictable dev server (`npm run dev`) and a deterministic production bundle (`npm run build` -> `dist/`).
- **ESLint (`eslint.config.js`):** Catches unused variables, undeclared globals, and JS errors across ES modules before review. Paired with `eslint-config-prettier` so lint rules never fight formatting rules.
- **Stylelint (`.stylelintrc.json`):** Configured to catch real CSS bugs and deprecations rather than enforcing noisy style preferences?during setup it surfaced deprecated `clip` in `css/base.css` and `word-break: break-word` in `css/contact.css` (kept as warnings so existing code isn't blocked while flagging technical debt). Stylistic rules that clash with existing BEM class names (e.g., `.order-field--day`) are intentionally disabled.
- **Prettier (`.prettierrc.json`):** Enforces consistent quotes, indentation, and trailing commas so two developers never waste PR review time on formatting differences.

## 4. Permanent Workflow Improvement: GitHub Actions PR Gate + PR Template

- **What was added:** `.github/workflows/ci.yml` and `.github/pull_request_template.md`.
- **Problem it solves:** Local scripts only work if every developer remembers to run them?and can be bypassed with `--no-verify` or GitHub's web editor. Previously, `jandoh08/the-corner-loaf` had no `.github/` automation at all.
- **Who it protects:** Protects collaborators from reviewing broken PRs, protects future maintainers inheriting the codebase, and protects Marcus's live bakery site from accidental regressions during frequent weekly menu updates.
- **Why keep it permanently:** Every PR targeting `develop` or `main` automatically runs `npm ci`, `npm run lint`, `npm run format:check`, and `npm run build` on a clean Ubuntu/Node 22 runner, while the PR template ensures every change documents what it does, why it's needed, and how it was tested before review begins.
