# GenericMart Cloud - Architecture & Design Report

**Course:** CSEC 3 - Cloud Computing
**Project:** Final Project, Scenario B (E-Commerce Storefront)
**Team:** JAVE A. BACSAIN, CARL GERALD J. PARRO, MARC JUSTIN N. PRESTADO

## 1. Goal

Deploy a simple e-commerce web application on Microsoft Azure that demonstrates baseline cloud architecture (compute, data, storage, security control) and at least two distinct cloud optimizations from Section 6 of the project brief.

## 2. Application

**GenericMart** is a fictional storefront written in Node.js using the Express framework. It exposes:

- `/` product catalog
- `/cart` view and modify cart (client-side, localStorage)
- `/checkout` persists demo order to Azure SQL
- `/orders` last 20 orders
- `/health` JSON probe (used by Azure load balancer and the CI smoke test)

Product data and order data are stored in Azure SQL Database. Product images are served from Azure Blob Storage.

## 3. Baseline architecture

```
Browser
   |
   v
Azure App Service (Linux, Node 22, S1, 2 instances)
   |  (Managed Identity)
   |--> Azure SQL Database (S0)     [products, orders]
   |--> Azure Blob Storage (LRS)    [product images]
```

| Layer | Service | Configuration |
|---|---|---|
| Compute | App Service Plan + Web App | Standard S1, Linux, Node 22, 2 instances |
| Data | Azure SQL Database | DTU S0, single database |
| Storage | Azure Storage Account | StorageV2, Standard_LRS, public blob container `products` |
| Security control | Managed Identity on Web App | App Service authenticates to Azure resources without storing secrets |
| Networking | Built-in App Service load balancer | Round-robin across both instances |

## 4. Chosen cloud optimizations

### Optimization 1: Application Insights (Monitoring & Operations)

The Web App is wired to an Application Insights component named `cloud-computing-final-project`. The instrumentation key and connection string are injected as App Service appsettings (`APPINSIGHTS_INSTRUMENTATIONKEY`, `APPLICATIONINSIGHTS_CONNECTION_STRING`). Application Insights captures every request, dependency call, exception, and performance metric automatically. Telemetry flows into a Log Analytics workspace (`cloud-computing-final-project-logs`) for query-based dashboards and alerts.

Effect: production-grade observability without manual instrumentation. Demo-friendly Live Metrics blade in the Azure Portal shows requests-per-second in real time.

> Note on the original plan: we initially scoped Optimization #1 as App Service Plan autoscale (Section 6 Scalability). `az monitor autoscale create` returned `ResourceNotFound: None` even after registering `Microsoft.Insights` and verifying the underlying plan id, which appears to be a known Azure CLI bug. We pivoted to Application Insights which sits in the same Section 6 list (Monitoring & Operations) and preserves the "at least two cloud optimizations" requirement. The App Service Plan still runs 2 manually-scaled instances so Deliverable 2 row 2 stays satisfied.

### Optimization 2: GitHub Actions CI/CD (Security & DevOps)

The repository ships a GitHub Actions workflow at `.github/workflows/azure-deploy.yml`. On every push to `main` that touches `src/**`, the pipeline:

1. Checks out the code.
2. Installs production dependencies (`npm ci --omit=dev`).
3. Packages the application into `app.zip`.
4. Logs in to Azure using OIDC federation (no stored client secrets in the repo).
5. Deploys the zip to the App Service.
6. Smoke-tests the live `/health` endpoint and fails the build if it does not return HTTP 200.

Effect: deployments are reproducible, traceable to a commit SHA, and require zero manual `az webapp deploy` runs after the initial infrastructure deployment.

## 5. Security boundary

| Surface | Access |
|---|---|
| App Service public hostname (`app-genericmart-1327081543903332108.azurewebsites.net`) | Public over HTTPS |
| Blob container `products` | Public read on individual blobs (intended for static images) |
| Azure SQL Server | Only Azure-internal traffic (`AllowAzureServices` firewall rule). No public client IP allowed by default. Add a temporary IP rule for local development if needed. |
| Web App -> SQL credentials | Stored as App Service appsettings, never committed to the repo. SQL admin password supplied via environment variable at deploy time only. |
| GitHub Actions -> Azure | OIDC federated identity, no long-lived secret. |

## 6. Deployment method

Method A (Code) via Azure CLI. The script `deployment/deploy.azcli` (and PowerShell mirror `deploy.ps1`) idempotently creates the resource group and all baseline resources, scales the App Service Plan to 2 worker instances, assigns the system-assigned Managed Identity, and prints the deployed web app URL. Detailed instructions live in `deployment/README.md`.

## 7. Trade-offs and what we did not do

- Did not implement Azure Cache for Redis (Scenario B optional). The product catalog is small enough that SQL read times are negligible. A real production storefront would benefit.
- Did not implement Azure Front Door / CDN. Same reason: small static asset set.
- Did not deploy across multiple Azure regions. Single-region Japan East keeps cost within Azure for Students credit.
- Did not implement WAF. Application Gateway with WAF would add a meaningful security boundary in production but is overkill for a demo and not free-tier eligible.

## 8. Live demo URL

<https://app-genericmart-1327081543903332108.azurewebsites.net>
