# Deployment Guide - GenericMart Cloud (Scenario B)

Method A (Code) deployment via Azure CLI. Bash script (`deploy.azcli`) for Linux/macOS/WSL/Git Bash, PowerShell script (`deploy.ps1`) for native Windows.

## Resources deployed

| # | Resource | Rubric requirement |
|---|---|---|
| 1 | Resource Group `rg-genericmart-cloud` | Container for all project resources |
| 2 | App Service Plan + App Service (2 instances, Linux Node 22) | Core compute resource |
| 3 | Azure SQL Server + Azure SQL Database | Data resource |
| 4 | Storage Account + Blob container `products` | Static asset hosting |
| 5 | Managed Identity on App Service | Security control |

## Cloud optimizations

| # | Optimization | Section 6 category |
|---|---|---|
| 1 | Application Insights telemetry (auto-instruments Web App, linked Log Analytics workspace) | Monitoring &amp; Operations |
| 2 | GitHub Actions CI/CD pipeline (see `.github/workflows/azure-deploy.yml`) | Security & DevOps |

## Prerequisites

- Azure for Students subscription
- Azure CLI installed (`az --version` to verify)
- Node.js 20+ to package app

Install Azure CLI on Windows:
```powershell
winget install -e --id Microsoft.AzureCLI
```

## Step 1 - Log in

```powershell
az login
az account show
```

## Step 2 - Set SQL admin password (NEVER commit this)

PowerShell:
```powershell
$env:SQL_ADMIN_PASSWORD = "YourStrongP@ssw0rd!"
```

Bash:
```bash
export SQL_ADMIN_PASSWORD='YourStrongP@ssw0rd!'
```

Password rules: 8+ chars, 3 of 4 categories (upper, lower, digit, symbol).

## Step 3 - Run deployment script

**Windows PowerShell:**
```powershell
.\deploy.ps1
```

**Linux / macOS / Git Bash / WSL:**
```bash
bash deploy.azcli
```

Script prints `Web App URL`, `Resource Group`, `SQL Server`, `Storage URL`. Save these.

## Step 4 - Package + deploy app code

PowerShell:
```powershell
cd ..\src
npm install --omit=dev
Compress-Archive -Path * -DestinationPath app.zip -Force
az webapp deploy --resource-group rg-genericmart-cloud --name <WEBAPP> --src-path app.zip --type zip
```

Bash:
```bash
cd ../src
npm install --omit=dev
zip -r app.zip . -x "node_modules/.cache/*"
az webapp deploy -g rg-genericmart-cloud -n <WEBAPP> --src-path app.zip --type zip
```

Replace `<WEBAPP>` with the actual web app name printed by the deploy script.

## Step 5 - Verify

Open `https://<WEBAPP>.azurewebsites.net`. Confirm:
- Product catalog loads
- `/health` returns JSON with `sql: true`
- `/cart` works (add product, checkout)
- `/orders` shows the new order (proves SQL persistence)

## Step 6 - Capture evidence

Take Azure Portal screenshots for `deployment/screenshots/`:
- `01-resource-group.png` - resource list
- `02-app-service-instances.png` - Scale out blade showing 2+ instances
- `03-sql-server.png` - SQL Server overview
- `04-storage-account.png` - Blob container
- `05-app-insights.png` - Application Insights overview
- `06-managed-identity.png` - Identity tab
- `07-app-running.png` - browser hitting live URL

## Step 7 - Clean up after grading

```powershell
az group delete --name rg-genericmart-cloud --yes --no-wait
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Password validation failed` | Password fails complexity rule. Pick stronger one. |
| App URL returns 503 | Check `az webapp log tail -g <RG> -n <WEBAPP>` for startup errors. |
| `/health` returns `sql: false` | Verify SQL firewall rule `AllowAzureServices` exists and app settings have correct `SQL_*` values. |
| Local connection refused to SQL | Add your IP: `az sql server firewall-rule create -g <RG> -s <SQL_SERVER> -n MyIP --start-ip-address <YOUR_IP> --end-ip-address <YOUR_IP>` |
