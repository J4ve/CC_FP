# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.

## [Unreleased]

### Added
- `CARL GERALD J. PARRO` - Added `diagram/architecture.png` on 2026-05-16: final exported architecture diagram (draw.io, >=1600 px wide) showing all Azure resources, connections with protocols, security boundary, Application Insights (Optimization #1), and GitHub Actions CI/CD (Optimization #2).
- `MARC JUSTIN N. PRESTADO` - Added `src/public/css/*.css` and `src/public/js/*.js` on 2026-05-16: ported TeknikkTorget UI assets (3 stylesheets - custom theme, a11y overrides, retro mode; 10 client scripts - main store, i18n, cart, catalog, home, product, a11y, retro, ui-components, validation). Rebranded all references from TeknikkTorget to GenericMart. Updated price formatter to use ₱ (Philippine peso) prefix instead of kr.
- `CARL GERALD J. PARRO` - Added `src/public/*.html` on 2026-05-16: 5 TeknikkTorget-derived storefront pages (homepage, catalog, cart, checkout, product detail) rebranded as GenericMart with Philippine peso pricing. Marquee tagline, copyright, and shipping thresholds updated. arngren.net references removed.
- `MARC JUSTIN N. PRESTADO` - Added Azure Portal + GitHub Actions evidence screenshots to `deployment/screenshots/` on 2026-05-16: 8 captioned PNGs covering resource group, App Service Plan instance count (2), SQL Server + Database, Storage Account + blob container, Application Insights (Optimization #1), Managed Identity (security control), live app running, and the successful CI/CD auto-deploy run (Optimization #2). Plus `deployment/screenshots/README.md` as a captioned index mapping each PNG to the rubric line it satisfies. These back Deliverable 2 (deployment evidence) and support the Deliverable 4 video demo Segment 2 walkthrough.
- `MARC JUSTIN N. PRESTADO` - Added `report/screenshots/pricing-calculator.png` on 2026-05-16: Azure Pricing Calculator estimate for Japan East matching the deployed SKUs (App Service Standard S1 x 2 instances, Azure SQL DTU S0, Storage Standard_LRS, Application Insights). Satisfies Deliverable 3 "include a screenshot of your completed Azure Pricing Calculator estimate".
- placeholder for future changes

### Changed
- `JAVE A. BACSAIN` - Rewrote `src/server.js` on 2026-05-16: removed cookie-based cart (now client-side localStorage), added `POST /api/checkout` for SQL order persistence, added `GET /api/orders` JSON endpoint, kept `GET /health` probe. Added `src/public/data/products.js` with TeknikkTorget-derived product catalog (drones, scooters, electronics, robotics, tools, components) priced in Philippine peso, converted from kroner at 5.3x rate rounded to the nearest 50.
- `MARC JUSTIN N. PRESTADO` - Updated `report/report.md` and `report/cost-estimate.md` on 2026-05-16: replaced Optimization #1 description from "App Service Plan autoscale" to "Application Insights telemetry" (Section 6 Monitoring & Operations category) to match the actually deployed stack. Autoscale was original plan but blocked by Azure CLI bug during deployment; swapped to App Insights which serves the same rubric requirement of "at least two cloud optimizations".
- `MARC JUSTIN N. PRESTADO` - Updated `README.md` on 2026-05-16: filled in the live App Service URL https://app-genericmart-1327081543903332108.azurewebsites.net for Deliverable 4 evidence. YouTube video URL placeholder stays for now; Step 24 will fill it after the video is recorded and uploaded.

### Fixed
- `JAVE A. BACSAIN` - Cleaned up stale text across rubric-facing docs on 2026-05-16: README App URL is now clickable (angle-bracket auto-link) and stripped of "(fill in after deployment)" hint; README rubric coverage table now lists Application Insights as Optimization #1 instead of the original autoscale plan; `report/cost-estimate.md` updated to Japan East region, 2026-05-16 estimate date, and the actual Pricing Calculator numbers ($81.76 App Service + $16.63 SQL + $1.14 Storage = $99.54 baseline); `report/report.md` filled live demo URL and replaced "applies autoscale profile" with the actual "scales the App Service Plan to 2 worker instances"; `deployment/README.md` swapped the Optimization #1 row to Application Insights and renamed `05-autoscale.png` reference to `05-app-insights.png`; `deploy.azcli` + `deploy.ps1` LOCATION default changed from "southeastasia" (which was blocked for our subscription) to "japaneast" (where we actually deployed).
- `JAVE A. BACSAIN` - Committed `src/package-lock.json` on 2026-05-16 to unblock the GitHub Actions `setup-node` cache step. The lock file was previously generated locally but never committed, causing CI/CD runs after Steps 19-21 to fail at the cache-dependency-path resolution. Pinning the lock also gives reproducible npm installs across deploys.
- `MARC JUSTIN N. PRESTADO` - Repaired CHANGELOG.md on 2026-05-16: added missing `### Changed`, `### Fixed`, `### Removed` subsections under `[Unreleased]`, moved BACSAIN's Step 19 server-rewrite entry from the v1.0 milestone heading back into `[Unreleased] > Changed` where it belongs, restored PARRO's Step 21 HTML pages entry (lost by an earlier apply.sh awk bug), and restored BACSAIN's ci-fix package-lock entry (lost because `### Fixed` subsection did not exist when ci-fix's apply.sh ran).

### Removed
- placeholder for future changes

---

## [2026-05-14] - v1.0 Final Project Submission

### Added
- `JAVE A. BACSAIN` - Initialized repository skeleton on 2026-05-14: added `.gitignore`, root folder structure (`diagram/`, `deployment/`, `report/`, `src/`, `.github/workflows/`), and the changelog template.
- `MARC JUSTIN N. PRESTADO` - Added skeleton root `README.md` on 2026-05-14 with project overview, team list, and placeholder demo + video URLs.
- `CARL GERALD J. PARRO` - Added `src/package.json` on 2026-05-14: declared `express`, `mssql`, and `@azure/storage-blob` dependencies, set Node 20+ engine, defined `dev` (watch mode) and `start` scripts.
- `JAVE A. BACSAIN` - Added `INSTRUCTIONS.md` on 2026-05-14 with the verbatim CSEC 3 final project brief (scenarios, deliverables, rubric, CHANGELOG requirements) for permanent reference.
- `MARC JUSTIN N. PRESTADO` - Added `report/cost-estimate.md` on 2026-05-14: architecture summary, itemized SKU breakdown for App Service S1 (2 instances), Azure SQL S0, and Storage_LRS, monthly total estimate, and four cost optimization strategies with estimated savings.
- `CARL GERALD J. PARRO` - Added `src/server.js` on 2026-05-14: Express application with product catalog, cookie-backed cart, checkout (transactional SQL writes with row-level UPDLOCK), `/orders` history view, `/health` probe (returns SQL status + App Service instance id), in-memory fallback for local development.
- `JAVE A. BACSAIN` - Added `deployment/deploy.azcli` on 2026-05-14: Azure CLI IaC script provisioning Resource Group, Storage Account + Blob container, Azure SQL Server + Database, App Service Plan (Standard S1, 2 instances) + Web App with Managed Identity, autoscale profile (CPU 70/30, min 2 max 4). SQL password sourced from `SQL_ADMIN_PASSWORD` env var, never hardcoded.
- `MARC JUSTIN N. PRESTADO` - Added `report/report.md` on 2026-05-14: full architecture writeup covering baseline services (App Service S1 2x, SQL S0, Storage_LRS, Managed Identity), the two cloud optimizations (autoscale, GitHub Actions CI/CD), the security boundary, and intentional trade-offs (no Redis, no WAF, single region).
- `CARL GERALD J. PARRO` - Added `src/public/styles.css` on 2026-05-14: dark theme stylesheet (responsive product grid, sticky nav, cart table, mobile breakpoints) served as static asset by Express.
- `JAVE A. BACSAIN` - Added `deployment/deploy.ps1` on 2026-05-14: PowerShell mirror of `deploy.azcli` for native Windows hosts. Reads `$env:SQL_ADMIN_PASSWORD`, truncates storage account name to the 24-character limit, and exposes the same Web App / SQL / Storage URLs at the end of the run.
- `MARC JUSTIN N. PRESTADO` - Added `diagram/README.md` on 2026-05-14: drafting checklist for `architecture.png` covering Azure shape library usage, every required resource label, security boundary rectangle, autoscale and CI/CD optimization callouts, and PNG export requirements (>= 1600 px wide).
- `CARL GERALD J. PARRO` - Added `src/README.md` on 2026-05-14: local development guide, environment variable reference table, route documentation, file inventory.
- `JAVE A. BACSAIN` - Added `deployment/README.md` on 2026-05-14: full deployment guide covering resource map, optimization summary, Azure CLI install instructions, password handling, app code packaging, post-deploy verification (catalog, /health, /cart, /orders), Portal screenshot checklist, and a troubleshooting matrix.
- `MARC JUSTIN N. PRESTADO` - Added `.github/workflows/azure-deploy.yml` on 2026-05-14: CI/CD pipeline triggered by push to `main` paths `src/**`. Installs prod deps with `npm ci --omit=dev`, packages app into zip, logs in to Azure via OIDC (no client secret), deploys to App Service, smoke-tests `/health`. Implements cloud Optimization #2 (Security & DevOps - CI/CD Automation).
- `CARL GERALD J. PARRO` - Added `deployment/screenshots/` and `report/screenshots/` folders on 2026-05-14 with `.gitkeep` placeholders so Azure Portal evidence and Pricing Calculator screenshots have a tracked home before deployment runs.
- `JAVE A. BACSAIN` - Added `diagram/architecture.placeholder.txt` on 2026-05-14 documenting required diagram contents (all Azure resources, Managed Identity badge, autoscale callout, CI/CD arrow, security boundary, protocol labels). Final exported PNG to replace it before submission.

### Changed
- `MARC JUSTIN N. PRESTADO` - Updated root `README.md` on 2026-05-14: replaced Step 02 skeleton with full version including architecture summary table, complete repository layout tree, run-locally and deploy-to-Azure quick commands, cleanup instructions, and a reference to the `commit-steps/` progression for grading evidence.
- `CARL GERALD J. PARRO` - Closed out v1.0 milestone on 2026-05-14: promoted all Unreleased entries to the dated v1.0 heading, restored the empty `[Unreleased]` section for post-submission maintenance.
