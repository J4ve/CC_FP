# GenericMart Cloud - Application Source

Express.js storefront app. Deployed to Azure App Service. Backed by Azure SQL + Storage.

## Run locally

```bash
cd src
npm install
npm run dev
```

Opens on http://localhost:3000.

## Environment variables

| Variable | Purpose | Example |
|---|---|---|
| `PORT` | Listen port (App Service injects automatically) | `3000` |
| `SQL_SERVER` | Azure SQL FQDN | `sql-cloudcom-12345.database.windows.net` |
| `SQL_DATABASE` | Database name | `sqldb-cloudcom` |
| `SQL_USER` | SQL admin user | `sqladminuser` |
| `SQL_PASSWORD` | SQL admin password | (from env, never committed) |
| `STORAGE_BLOB_BASE` | Public blob base URL for product images | `https://stcloudcom.blob.core.windows.net/products` |

If SQL env vars not set, app falls back to in-memory product/order storage. Useful for local dev without Azure.

## Routes

| Route | Method | Purpose |
|---|---|---|
| `/` | GET | Product catalog |
| `/cart` | GET | Cart view |
| `/cart/add` | POST | Add product to cart |
| `/cart/remove` | POST | Remove product from cart |
| `/checkout` | POST | Persist order to SQL, clear cart |
| `/orders` | GET | Last 20 orders |
| `/health` | GET | JSON health probe (SQL connectivity + instance id) |

## Files

- `server.js` - Express app, catalog, cart, checkout, SQL pool
- `package.json` - deps (`express`, `mssql`, `@azure/storage-blob`)
- `public/styles.css` - dark theme stylesheet
- `public/` - any static asset served at site root
