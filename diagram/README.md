# Architecture Diagram

The final architecture diagram lives in this folder as `architecture.png`.

## How to produce the diagram

1. Open https://app.diagrams.net (formerly draw.io) and create a new diagram.
2. Use the **Azure** shape library (Extras > Edit Diagram > or via "More shapes" > Networking > Azure).
3. Place the following components and link them with labeled arrows.

### Components to include (matches the rubric "minimum 3 distinct services" rule)

| Component | Notes |
|---|---|
| Internet user (laptop icon) | Top of diagram, public side of boundary. |
| Azure Front Door / public DNS | Optional, can be replaced with App Service hostname label. |
| Azure App Service (Web App) | 2 instances, label as "Linux Node 20, S1 plan". |
| App Service Plan | Show the plan separately from the Web App; attach the autoscale profile to it. |
| Autoscale rule callout | "CPU > 70% scale out, CPU < 30% scale in, min 2 max 4." |
| Managed Identity badge on the Web App | Indicate secret-less authentication. |
| Azure SQL Server + Database | Connection labeled "TDS / 1433, encrypted". |
| Azure Storage Account + Blob container | Connection labeled "HTTPS blob read". |
| GitHub Actions runner | Off to the side; arrow into App Service labeled "OIDC + zip deploy". |
| Security boundary | A dashed rectangle around private resources (SQL, Storage internals), keeping the Web App public surface outside. |

### Required diagram elements (Deliverable 1 rubric)

- All Azure resources shown and labeled.
- Connections include direction (arrows) and protocol labels.
- Security boundary clearly drawn (dashed rectangle or shaded region).
- Both optimizations highlighted: autoscale on the App Service Plan, GitHub Actions CI/CD on the Web App.

## Export

Export the final diagram as `architecture.png` (PNG, transparent background OK, minimum 1600 px wide for clarity in the video).

Save to: `diagram/architecture.png`.

## Optional: source file

If using draw.io, also save the editable `architecture.drawio` file in this folder so future edits stay reproducible.
