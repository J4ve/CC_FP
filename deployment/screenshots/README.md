# Azure Portal Screenshot Index

Evidence captures supporting Deliverable 2 (Deployment Documentation) and Deliverable 4 (Live Demo - Segment 2 Portal walkthrough). Each file documents a specific Azure resource setting + the rubric requirement it satisfies.

| File | Resource / View | Brief explanation of settings shown | Rubric line satisfied |
|---|---|---|---|
| `01-resource-group.png` | Resource group `rg-genericmart-cloud` overview | Lists all 8 resources in the group (App Service Plan, Web App, SQL Server, SQL Database, Storage Account, App Insights, Log Analytics, Smart Detector alert rule). Region: Japan East. Subscription: Azure for Students. | D2 row 1: Resource Group is the container for all project resources |
| `02-app-service-instances.png` | App Service Plan `asp-genericmart` -> Scale out blade | Tier: Standard S1 (1 vCPU, 1.75 GB RAM, Linux). Scale method: Manual. **Instance count = 2**. Autoscale is available but not enabled - we use Application Insights as Optimization #1 instead. | D2 row 2: Core compute resource - App Service Plan + Web App (2+ instances) |
| `03-sql-server.png` | SQL Server `sql-genericmart-jave1` -> Overview | Server name + fully qualified domain name. Database `sqldb-genericmart` listed. Pricing tier DTU S0 (10 DTU, 250 GB max). Firewall rule `AllowAzureServices` (0.0.0.0 -> 0.0.0.0) restricts to Azure-internal traffic. | D2 row 3: Data resource - Azure SQL Database |
| `04-storage-account.png` | Storage Account `stgenericmart88263765814` -> Storage browser -> Blob containers | Account kind StorageV2, replication Standard_LRS, location Japan East. Blob container `products` visible (intended for product image assets). | D2 row 3 (additional data resource) + Minimum 3 services rule |
| `05-app-insights.png` | Application Insights `cloud-computing-final-project` -> Overview | Application type: Web. Linked Log Analytics workspace `cloud-computing-final-project-logs`. Instrumentation key configured. Auto-instruments requests, dependencies, exceptions on the Web App. | Optimization #1 - Section 6 Monitoring & Operations (Advanced Telemetry) |
| `06-managed-identity.png` | Web App `app-genericmart-1327081543903332108` -> Identity blade -> System assigned tab | **Status: On**. Object (principal) ID + Tenant ID visible. Web App authenticates to Azure resources via this identity without storing client secrets. | D2 row 4: A security control - Managed Identity |
| `07-app-running.png` | Live application URL in browser | `https://app-genericmart-1327081543903332108.azurewebsites.net/` rendering the GenericMart product catalog page. TeknikkTorget-derived UI with Philippine peso prices. Cart, checkout, /health endpoint all functional. | D4 live demo: application runs end-to-end in browser |
| `08-cicd-actions-run.png` | GitHub Actions workflow run | Successful run of `.github/workflows/azure-deploy.yml` (green checkmark). Triggered by push to main with `src/**` changes. Steps: Checkout -> setup-node + npm cache -> npm ci -> zip -> Azure login via OIDC -> webapps-deploy -> curl /health smoke test. | Optimization #2 - Section 6 Security & DevOps (CI/CD Automation) |
| `09-app-catalog.png` | Live app catalog page in browser at the live URL | Full TeknikkTorget-derived product grid rendered from Azure SQL, Philippine peso prices, search + sort + category chips visible. | D4 Live demo Segment 2 (extra evidence) |
| `10-app-cart.png` | Cart page after adding products | Cart table with line items, quantities, line totals, subtotal in pesos, Continue shopping + Checkout actions. | D4 Live demo Segment 2 (extra evidence) |
| `11-app-checkout.png` | Checkout confirmation flow | Checkout page or post-checkout orders view, proving the cart-to-SQL persistence path works end-to-end. | D4 Live demo Segment 2 (extra evidence) |
| `12-app-search.png` | Catalog with search bar active | Search input filtered to a brand or product name, demonstrating the client-side search feature. | D4 Live demo Segment 2 (extra evidence) |

## Capture procedure

All 8 screenshots taken in Azure Portal (https://portal.azure.com) or browser, captured with Windows Snipping Tool (Win+Shift+S), saved as PNG.

## Why these specific shots

The rubric Excellent criterion for D2 GUI evidence says *"Screenshots must be clear, organized sequentially in a document or folder, and include brief explanations of your chosen settings."* This index file is the explanation for each numbered screenshot.
