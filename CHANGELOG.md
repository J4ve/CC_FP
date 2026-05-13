# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.

## [Unreleased]

### Added
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
