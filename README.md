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

- Application URL: `https://<webapp>.azurewebsites.net` (fill in after deployment)
- Video presentation (unlisted YouTube): `https://youtu.be/<your-video>` (fill in after recording)

## What is this?

A simple Node.js Express storefront deployed on Microsoft Azure. Customers browse a small product catalog, add items to a cookie-based cart, and submit demo orders that persist to Azure SQL Database. Product images are served from Azure Blob Storage. The deployment is fully scripted via Azure CLI and re-deployed automatically by a GitHub Actions CI/CD pipeline on every push to `main`.

## Architecture at a glance

| Layer | Service | SKU |
|---|---|---|
| Compute | Azure App Service Plan + Web App | Standard S1, Linux, Node 20, 2 instances |
| Data | Azure SQL Database | DTU S0 |
| Storage | Azure Storage Account | StorageV2, Standard_LRS, Blob container `products` |
| Security control | Managed Identity on Web App | Secret-less auth to Azure resources |
| Optimization 1 | App Service Plan autoscale | CPU 70/30, min 2 max 4 |
| Optimization 2 | GitHub Actions CI/CD | Build, package, deploy, smoke-test |

See `diagram/architecture.png` for the visual, `report/report.md` for the full design writeup.

## Repository layout

```
GenericMart-Cloud/
├── diagram/
│   ├── architecture.png           Final architecture diagram (PNG)
│   └── README.md                  Drafting checklist
├── deployment/
│   ├── deploy.azcli               Bash Azure CLI script
│   ├── deploy.ps1                 PowerShell mirror script
│   ├── screenshots/               Portal evidence screenshots
│   └── README.md                  Step-by-step deployment guide
├── report/
│   ├── cost-estimate.md           Cost report + Pricing Calculator screenshot
│   └── report.md                  Architecture + optimization writeup
├── src/
│   ├── server.js                  Express application
│   ├── package.json               Dependencies
│   ├── public/
│   │   └── styles.css             Stylesheet
│   └── README.md                  Local dev guide
├── .github/
│   └── workflows/
│       └── azure-deploy.yml       CI/CD pipeline (Optimization 2)
├── CHANGELOG.md                   Dated entries per member
├── INSTRUCTIONS.md                Copy of the original assignment brief
└── README.md                      This file
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

## Group commit progression

The `commit-steps/` sibling folder (one directory above this README, at the project root) contains an 18-step ordered breakdown of the work, assigning each commit to a specific team member. Each member follows the steps assigned to them so the GitHub commit history reflects "equal, regular contributions" as the rubric requires.

Read `commit-steps/README.md` first.

## License

Coursework. No license granted.
