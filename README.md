# GenericMart Cloud

> A Generic E-Commerce Website (Totally Original Branding, Definitely Not A Clone Of Anything).

**Course:** CSEC 3 - Cloud Computing
**Project:** Final Project, Scenario B (E-Commerce Storefront)
**Term:** AY 2025-2026, 2nd Semester

## Team

- JAVE A. BACSAIN
- CARL GERALD J. PARRO
- MARC JUSTIN N. PRESTADO

## Live demo

- Application URL: <https://app-genericmart-1327081543903332108.azurewebsites.net>
- Video presentation (unlisted YouTube): `https://youtu.be/<your-video>` (fill in after recording)

## What is this?

A Node.js Express storefront deployed on Microsoft Azure. Customers browse a product catalog, add items to a client-side cart, and submit demo orders that persist to Azure SQL Database. Product images are served from Azure Blob Storage. The deployment is fully scripted via Azure CLI and re-deployed automatically by a GitHub Actions CI/CD pipeline on every push to `main`.

## Architecture at a glance

| Layer | Service | SKU |
|---|---|---|
| Compute | Azure App Service Plan + Web App | Standard S1, Linux, Node 22, 2 instances |
| Data | Azure SQL Database | DTU S0 |
| Storage | Azure Storage Account | StorageV2, Standard_LRS, Blob container `products` |
| Security control | Managed Identity on Web App | Secret-less auth to Azure resources |
| Optimization 1 | Application Insights | Auto-instruments requests/dependencies/exceptions, backed by Log Analytics workspace |
| Optimization 2 | GitHub Actions CI/CD | Build, package, deploy, smoke-test |

See `diagram/architecture.png` for the visual, `report/report.md` for the full design writeup.

## Repository layout

```
/
+-- diagram/
|   +-- architecture.png           Final architecture diagram (PNG)
+-- deployment/
|   +-- deploy.azcli               Bash Azure CLI script
|   +-- deploy.ps1                 PowerShell mirror script
|   +-- screenshots/               Portal evidence PNGs + captioned README
|   +-- README.md                  Step-by-step deployment guide
+-- report/
|   +-- cost-estimate.md           Cost report with Pricing Calculator screenshot
|   +-- report.md                  Architecture + optimization writeup
|   +-- screenshots/
|       +-- pricing-calculator.png Azure Pricing Calculator estimate
+-- src/
|   +-- server.js                  Express application
|   +-- package.json               Dependencies
|   +-- package-lock.json          Pinned dependency tree
|   +-- public/                    Static UI assets (HTML, CSS, JS, products data)
|   +-- README.md                  Local dev guide
+-- .github/
|   +-- workflows/
|       +-- azure-deploy.yml       CI/CD pipeline (Optimization 2)
+-- CHANGELOG.md                   Dated entries per member
+-- INSTRUCTIONS.md                Copy of the original assignment brief
+-- README.md                      This file
```

## Run locally

Requires Node.js 20+.

```bash
cd src
npm install
npm run dev
```

Open http://localhost:3000.

Optional Azure SQL connection: set `SQL_SERVER`, `SQL_DATABASE`, `SQL_USER`, `SQL_PASSWORD` env vars. Without them, the app uses in-memory storage so you can develop without an Azure account.

## Deploy to Azure

See `deployment/README.md` for the full guide. Short version:

```bash
az login
export SQL_ADMIN_PASSWORD='YourStrongP@ssw0rd!'
cd deployment
bash deploy.azcli            # or .\deploy.ps1 on Windows PowerShell
# Note the printed Web App name, then:
cd ../src
npm install --omit=dev
zip -r ../app.zip .
az webapp deploy -g rg-genericmart-cloud -n <WEBAPP> --src-path ../app.zip --type zip
```

## Clean up after grading

```bash
az group delete --name rg-genericmart-cloud --yes --no-wait
```

Resources cease accruing cost immediately once the resource group is gone.

## License

Coursework. No license granted.

## Team Contributions

Per-member breakdown of work and version-control evidence.

| Member | Primary ownership | PRs opened | CHANGELOG entries | Total commits |
|---|---|---|---|---|
| JAVE A. BACSAIN | Infrastructure / IaC scripts / Azure deployment / OIDC CI/CD setup | 5+ | 9+ | 9+ |
| MARC JUSTIN N. PRESTADO | Documentation / cost report / CI/CD workflow / final README | 5+ | 9+ | 9+ |
| CARL GERALD J. PARRO | Application code / UI port / architecture diagram / team summary | 5+ | 9+ | 9+ |

All members:
- Authored at least 5 dated entries in `CHANGELOG.md` (rubric minimum).
- Pushed commits from their own GitHub account on their own machine.
- Reviewed and merged their own pull requests so commit attribution stays accurate.
- Can explain any part of the architecture, deployment, or cost report during Q&A.

## Rubric coverage at a glance

Quick map of how this repository satisfies the CSEC 3 Final Project rubric for graders.

| Rubric requirement | Where in repo |
|---|---|
| Scenario B (E-Commerce Storefront) | `src/server.js` + `src/public/` (Express app, catalog, cart, checkout) |
| Minimum 3 distinct Azure services | App Service + Azure SQL + Storage Account (`deployment/deploy.azcli`) |
| Cloud Optimization #1 (Section 6 Monitoring) | Application Insights `cloud-computing-final-project` |
| Cloud Optimization #2 (Section 6 Security & DevOps) | GitHub Actions CI/CD (`.github/workflows/azure-deploy.yml`) |
| Security control (D2 row 4) | Managed Identity on Web App |
| 2+ App Service instances (D2 row 2) | Plan configured with `--number-of-workers 2` |
| **D1: Architecture diagram** | `diagram/architecture.png` |
| **D2: Method A scripts** | `deployment/deploy.azcli`, `deployment/deploy.ps1` |
| **D2: Deployment README** | `deployment/README.md` |
| **D2: Portal evidence screenshots** | `deployment/screenshots/*.png` + captioned `screenshots/README.md` |
| **D2: CHANGELOG** | Repo root `CHANGELOG.md` |
| **D2: No hardcoded secrets** | SQL admin password sourced from `$env:SQL_ADMIN_PASSWORD` |
| **D3: Cost report** | `report/cost-estimate.md` |
| **D3: Pricing Calculator screenshot** | `report/screenshots/pricing-calculator.png` |
| **D4: Live demo URL** | (see "Live demo" section above) |
| **D4: YouTube video link** | (see "Live demo" section above) |
