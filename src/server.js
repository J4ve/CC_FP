import express from "express";
import sql from "mssql";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

function getSqlConfigFromEnv() {
  const server = process.env.SQL_SERVER;
  const database = process.env.SQL_DATABASE;
  const user = process.env.SQL_USER;
  const password = process.env.SQL_PASSWORD;
  if (!server || !database || !user || !password) return null;
  return {
    server,
    database,
    user,
    password,
    options: { encrypt: true, trustServerCertificate: false }
  };
}

let sqlPoolPromise = null;
async function ensureSqlPool() {
  const cfg = getSqlConfigFromEnv();
  if (!cfg) return null;
  if (!sqlPoolPromise) sqlPoolPromise = sql.connect(cfg);
  return sqlPoolPromise;
}

async function ensureSchema(pool) {
  await pool.request().query(`
    IF OBJECT_ID('dbo.Orders', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.Orders (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ItemsJson NVARCHAR(MAX) NOT NULL,
        Total INT NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END
  `);
}

const inMemoryOrders = [];

app.get("/health", async (_req, res) => {
  let sqlOk = false;
  try {
    const pool = await ensureSqlPool();
    if (pool) { await pool.request().query("SELECT 1"); sqlOk = true; }
  } catch {}
  res.json({
    ok: true,
    sql: sqlOk,
    instance: process.env.WEBSITE_INSTANCE_ID || "local",
    time: new Date().toISOString()
  });
});

app.post("/api/checkout", async (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : null;
  const total = Number(req.body?.total);
  if (!items || items.length === 0 || !Number.isFinite(total) || total < 0) {
    res.status(400).json({ ok: false, error: "invalid order payload" });
    return;
  }
  try {
    const pool = await ensureSqlPool();
    if (pool) {
      await ensureSchema(pool);
      const r = await pool.request()
        .input("ItemsJson", sql.NVarChar(sql.MAX), JSON.stringify(items))
        .input("Total", sql.Int, Math.round(total))
        .query(`INSERT INTO dbo.Orders (ItemsJson, Total)
                OUTPUT INSERTED.Id, INSERTED.CreatedAt
                VALUES (@ItemsJson, @Total)`);
      const row = r.recordset?.[0];
      res.json({ ok: true, id: Number(row?.Id || 0), createdAt: row?.CreatedAt });
      return;
    }
  } catch (e) {
    // fall through to in-memory
  }
  const id = inMemoryOrders.length + 1;
  inMemoryOrders.unshift({ id, items, total, createdAt: new Date().toISOString() });
  res.json({ ok: true, id, createdAt: new Date().toISOString() });
});

app.get("/api/orders", async (_req, res) => {
  try {
    const pool = await ensureSqlPool();
    if (pool) {
      await ensureSchema(pool);
      const r = await pool.request().query(
        `SELECT TOP (20) Id, Total, ItemsJson, CreatedAt FROM dbo.Orders ORDER BY CreatedAt DESC`
      );
      const rows = (r.recordset || []).map(x => {
        let items = [];
        try { items = JSON.parse(String(x.ItemsJson || "[]")); } catch {}
        return { id: Number(x.Id), total: Number(x.Total), items, createdAt: x.CreatedAt };
      });
      res.json({ ok: true, rows });
      return;
    }
  } catch {}
  res.json({ ok: true, rows: inMemoryOrders.slice(0, 20) });
});

app.listen(PORT, () => { console.log(`Listening on ${PORT}`); });
