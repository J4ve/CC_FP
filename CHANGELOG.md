# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.

## [Unreleased]

### Added
- `JAVE A. BACSAIN` - Initialized repository skeleton on 2026-05-14: added `.gitignore`, root folder structure (`diagram/`, `deployment/`, `report/`, `src/`, `.github/workflows/`), and the changelog template.
- `JAVE A. BACSAIN` - Added `INSTRUCTIONS.md` on 2026-05-14 with the verbatim CSEC 3 final project brief (scenarios, deliverables, rubric, CHANGELOG requirements) for permanent reference.
- `MARC JUSTIN N. PRESTADO` - Added skeleton root `README.md` on 2026-05-14 with project overview, team list, and placeholder demo + video URLs.
- `MARC JUSTIN N. PRESTADO` - Added `report/cost-estimate.md` on 2026-05-14: architecture summary, itemized SKU breakdown for App Service S1 (2 instances), Azure SQL S0, and Storage_LRS, monthly total estimate, and four cost optimization strategies with estimated savings.
- `CARL GERALD J. PARRO` - Added `src/package.json` on 2026-05-14: declared `express`, `mssql`, and `@azure/storage-blob` dependencies, set Node 20+ engine, defined `dev` (watch mode) and `start` scripts.
- `CARL GERALD J. PARRO` - Added `src/server.js` on 2026-05-14: Express application with product catalog, cookie-backed cart, checkout (transactional SQL writes with row-level UPDLOCK), `/orders` history view, `/health` probe (returns SQL status + App Service instance id), in-memory fallback for local development.
<!-- INSERT_ADDED -->

### Changed
<!-- INSERT_CHANGED -->

### Fixed
<!-- INSERT_FIXED -->

### Removed
<!-- INSERT_REMOVED -->
