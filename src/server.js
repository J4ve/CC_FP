import express from "express";
import sql from "mssql";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
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

const STORAGE_BASE = process.env.STORAGE_BLOB_BASE || "";

function imgUrl(file) {
  if (STORAGE_BASE) return `${STORAGE_BASE.replace(/\/$/, "")}/${file}`;
  return `https://placehold.co/600x400/0a0f1f/e8eeff?text=${encodeURIComponent(file.replace(/\.[^.]+$/, ""))}`;
}

const PRODUCTS = [
  { sku: "GM-DRN-001", name: "Generic Drone 3000", category: "Drones", price: 8490, stock: 12, image: "drone-aero.png", desc: "4K cinema drone. Totally not a clone of any specific brand." },
  { sku: "GM-SCT-002", name: "Definitely Not A Scooter", category: "Vehicles", price: 12900, stock: 8, image: "scooter-volt.png", desc: "Foldable 1000W e-scooter. Wheels included (most of the time)." },
  { sku: "GM-ELC-003", name: "Generic IoT Dev Board", category: "Electronics", price: 450, stock: 60, image: "board-coredev.png", desc: "Dual-core MCU dev board. Has chips on it. Probably works." },
  { sku: "GM-ROB-004", name: "Robot Arm (Probably)", category: "Robotics", price: 5200, stock: 22, image: "arm-mech.png", desc: "6-DOF robotic arm. Will not pass the Turing test, but will pick things up." },
  { sku: "GM-TLS-005", name: "Wrench Of Holding", category: "Tools", price: 1850, stock: 35, image: "tool-torque.png", desc: "Digital torque wrench. Measures torque, digitally." },
  { sku: "GM-CMP-006", name: "Very Fast Storage Brick", category: "Components", price: 4200, stock: 40, image: "ssd-fast.png", desc: "PCIe 4.0 SSD. 7000 MB/s if the planets align." },
  { sku: "GM-DRN-007", name: "Smol Indoor Quadcopter", category: "Drones", price: 1800, stock: 28, image: "drone-micro.png", desc: "Beginner drone with prop guards. Bumps into walls politely." },
  { sku: "GM-ELC-008", name: "Generic Smart Hub", category: "Electronics", price: 2400, stock: 18, image: "hub-smart.png", desc: "Zigbee + Z-Wave + Wi-Fi. Connects to your other generic stuff." },
  { sku: "GM-ROB-009", name: "Robot Chassis Starter", category: "Robotics", price: 1400, stock: 50, image: "chassis-line.png", desc: "Programmable chassis. Wheels rotate as expected." },
  { sku: "GM-TLS-010", name: "Thermal Cam Of Mystery", category: "Tools", price: 6800, stock: 10, image: "cam-thermal.png", desc: "USB-C thermal imager. Sees heat. Cannot read minds." }
];

const inMemoryOrders = [];
let sqlPoolPromise = null;

async function ensureSqlPool() {
  const cfg = getSqlConfigFromEnv();
  if (!cfg) return null;
  if (!sqlPoolPromise) sqlPoolPromise = sql.connect(cfg);
  return sqlPoolPromise;
}

async function ensureSchema(pool) {
  await pool.request().query(`
    IF OBJECT_ID('dbo.Products', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.Products (
        Sku NVARCHAR(40) NOT NULL PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL,
        Category NVARCHAR(100) NOT NULL,
        Price INT NOT NULL,
        Stock INT NOT NULL,
        ImageFile NVARCHAR(200) NOT NULL DEFAULT '',
        Descr NVARCHAR(500) NOT NULL DEFAULT ''
      );
    END
  `);
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
  const cnt = await pool.request().query(`SELECT COUNT(1) AS C FROM dbo.Products`);
  if (Number(cnt.recordset[0].C) < PRODUCTS.length) {
    await pool.request().query(`DELETE FROM dbo.Products`);
    for (const p of PRODUCTS) {
      await pool.request()
        .input("Sku", sql.NVarChar(40), p.sku)
        .input("Name", sql.NVarChar(200), p.name)
        .input("Category", sql.NVarChar(100), p.category)
        .input("Price", sql.Int, p.price)
        .input("Stock", sql.Int, p.stock)
        .input("ImageFile", sql.NVarChar(200), p.image)
        .input("Descr", sql.NVarChar(500), p.desc)
        .query(`INSERT INTO dbo.Products (Sku, Name, Category, Price, Stock, ImageFile, Descr)
                VALUES (@Sku, @Name, @Category, @Price, @Stock, @ImageFile, @Descr)`);
    }
  }
}

async function loadProducts() {
  try {
    const pool = await ensureSqlPool();
    if (!pool) return PRODUCTS;
    await ensureSchema(pool);
    const r = await pool.request().query(`SELECT Sku, Name, Category, Price, Stock, ImageFile, Descr FROM dbo.Products ORDER BY Sku`);
    return (r.recordset || []).map(x => ({
      sku: x.Sku, name: x.Name, category: x.Category, price: x.Price,
      stock: x.Stock, image: x.ImageFile, desc: x.Descr
    }));
  } catch {
    return PRODUCTS;
  }
}

function parseCartFromCookie(req) {
  const cookie = String(req.headers.cookie || "");
  const m = cookie.split(";").map(s => s.trim()).find(p => p.startsWith("cart="));
  if (!m) return {};
  try {
    const obj = JSON.parse(decodeURIComponent(m.slice("cart=".length)));
    if (!obj || typeof obj !== "object") return {};
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      const n = Number(v);
      if (Number.isFinite(n) && n > 0 && n < 100) out[String(k)] = Math.floor(n);
    }
    return out;
  } catch { return {}; }
}

function setCartCookie(res, cart) {
  res.setHeader("Set-Cookie", `cart=${encodeURIComponent(JSON.stringify(cart))}; Path=/; HttpOnly; SameSite=Lax`);
}

function cartCount(c) { return Object.values(c).reduce((a, b) => a + Number(b || 0), 0); }
function cartTotal(c, products) {
  const m = new Map(products.map(p => [p.sku, p]));
  let t = 0;
  for (const [k, q] of Object.entries(c)) { const p = m.get(k); if (p) t += p.price * q; }
  return t;
}

function escapeHtml(s) {
  return String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function page(title, body) {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)} - GenericMart</title>
<link rel="stylesheet" href="/styles.css">
</head><body>
<header class="nav">
  <a class="brand" href="/">GenericMart&trade;</a>
  <nav><a href="/">Catalog</a> <a href="/cart">Cart</a> <a href="/orders">Orders</a> <a href="/health">Health</a></nav>
</header>
<main class="wrap">
  <p class="muted" style="margin:0 0 14px;">GenericMart&trade; - A Generic E-Commerce Website (Totally Original Branding, Definitely Not A Clone Of Anything).</p>
  ${body}
</main>
<footer class="foot">CSEC 3 - Cloud Computing Final Project - Azure deployment demo. No products were harmed in the making of this storefront.</footer>
</body></html>`;
}

app.get("/health", async (_req, res) => {
  let sqlOk = false;
  try { const pool = await ensureSqlPool(); if (pool) { await pool.request().query("SELECT 1"); sqlOk = true; } } catch {}
  res.json({ ok: true, sql: sqlOk, instance: process.env.WEBSITE_INSTANCE_ID || "local", time: new Date().toISOString() });
});

app.get("/", async (req, res) => {
  const products = await loadProducts();
  const cart = parseCartFromCookie(req);
  const cats = Array.from(new Set(products.map(p => p.category)));
  res.send(page("Catalog", `
    <h1>Product Catalog</h1>
    <p class="muted">Showing ${products.length} products. Cart: ${cartCount(cart)} items.</p>
    <div class="filters">${cats.map(c => `<span class="chip">${escapeHtml(c)}</span>`).join("")}</div>
    <div class="grid">
    ${products.map(p => `
      <article class="card">
        <img src="${escapeHtml(imgUrl(p.image))}" alt="${escapeHtml(p.name)}" loading="lazy">
        <h3>${escapeHtml(p.name)}</h3>
        <p class="muted">${escapeHtml(p.category)} - ${escapeHtml(p.sku)} - Stock: ${Number(p.stock)}</p>
        <p>${escapeHtml(p.desc)}</p>
        <div class="row">
          <strong>kr ${Number(p.price)}</strong>
          <form method="post" action="/cart/add">
            <input type="hidden" name="sku" value="${escapeHtml(p.sku)}">
            <button type="submit">Add to cart</button>
          </form>
        </div>
      </article>`).join("")}
    </div>`));
});

app.post("/cart/add", async (req, res) => {
  const sku = String(req.body.sku || "").trim();
  const products = await loadProducts();
  const product = products.find(p => p.sku === sku);
  if (!product) { res.redirect("/"); return; }
  const cart = parseCartFromCookie(req);
  const next = (cart[sku] || 0) + 1;
  if (next > product.stock) { res.redirect("/cart?error=stock"); return; }
  cart[sku] = next;
  setCartCookie(res, cart);
  res.redirect("/cart");
});

app.post("/cart/remove", (req, res) => {
  const sku = String(req.body.sku || "").trim();
  const cart = parseCartFromCookie(req);
  delete cart[sku];
  setCartCookie(res, cart);
  res.redirect("/cart");
});

app.get("/cart", async (req, res) => {
  const products = await loadProducts();
  const cart = parseCartFromCookie(req);
  const m = new Map(products.map(p => [p.sku, p]));
  const items = Object.entries(cart).map(([sku, qty]) => ({ sku, qty, p: m.get(sku) })).filter(x => x.p);
  const total = cartTotal(cart, products);
  const err = req.query.error === "stock" ? `<p class="err">Not enough stock.</p>` : "";
  res.send(page("Cart", `
    <h1>Your cart</h1>
    ${err}
    <p><a href="/">&larr; Continue shopping</a></p>
    ${items.length === 0 ? "<p>Your cart is empty.</p>" : `
    <table>
      <thead><tr><th>Product</th><th>SKU</th><th>Qty</th><th>Line total</th><th></th></tr></thead>
      <tbody>
        ${items.map(({ sku, qty, p }) => `
          <tr>
            <td>${escapeHtml(p.name)}</td>
            <td>${escapeHtml(sku)}</td>
            <td>${Number(qty)}</td>
            <td>kr ${Number(p.price * qty)}</td>
            <td><form method="post" action="/cart/remove"><input type="hidden" name="sku" value="${escapeHtml(sku)}"><button>Remove</button></form></td>
          </tr>`).join("")}
      </tbody>
    </table>
    <p class="total"><b>Total:</b> kr ${Number(total)}</p>
    <form method="post" action="/checkout"><button class="primary">Checkout (demo)</button></form>`}`));
});

app.post("/checkout", async (req, res) => {
  const products = await loadProducts();
  const cart = parseCartFromCookie(req);
  const items = Object.entries(cart).map(([sku, qty]) => ({ sku, qty }));
  if (items.length === 0) { res.redirect("/cart"); return; }
  const total = cartTotal(cart, products);

  try {
    const pool = await ensureSqlPool();
    if (pool) {
      await ensureSchema(pool);
      const tx = new sql.Transaction(pool);
      await tx.begin();
      try {
        for (const it of items) {
          const r = await new sql.Request(tx)
            .input("Sku", sql.NVarChar(40), it.sku)
            .query(`SELECT Stock FROM dbo.Products WITH (UPDLOCK, ROWLOCK) WHERE Sku = @Sku`);
          const row = r.recordset?.[0];
          if (!row || Number(it.qty) > Number(row.Stock)) { await tx.rollback(); res.redirect("/cart?error=stock"); return; }
        }
        for (const it of items) {
          await new sql.Request(tx)
            .input("Sku", sql.NVarChar(40), it.sku)
            .input("Qty", sql.Int, Number(it.qty))
            .query(`UPDATE dbo.Products SET Stock = Stock - @Qty WHERE Sku = @Sku`);
        }
        await new sql.Request(tx)
          .input("ItemsJson", sql.NVarChar(sql.MAX), JSON.stringify(items))
          .input("Total", sql.Int, total)
          .query(`INSERT INTO dbo.Orders (ItemsJson, Total) VALUES (@ItemsJson, @Total)`);
        await tx.commit();
      } catch (e) { try { await tx.rollback(); } catch {} throw e; }
      setCartCookie(res, {});
      res.redirect("/orders");
      return;
    }
  } catch {}

  inMemoryOrders.unshift({ items, total, createdAt: new Date().toISOString() });
  setCartCookie(res, {});
  res.redirect("/orders");
});

app.get("/orders", async (_req, res) => {
  try {
    const pool = await ensureSqlPool();
    if (pool) {
      await ensureSchema(pool);
      const r = await pool.request().query(`SELECT TOP (20) Id, Total, ItemsJson, CreatedAt FROM dbo.Orders ORDER BY CreatedAt DESC`);
      const rows = r.recordset || [];
      res.send(page("Orders", `
        <h1>Recent orders</h1>
        <p class="muted">Stored in Azure SQL.</p>
        <table>
          <thead><tr><th>#</th><th>Items</th><th>Total</th><th>UTC</th></tr></thead>
          <tbody>
            ${rows.map(row => {
              let txt = ""; try { txt = JSON.parse(String(row.ItemsJson)).map(x => `${x.sku} x${x.qty}`).join(", "); } catch { txt = "n/a"; }
              return `<tr><td>${Number(row.Id)}</td><td>${escapeHtml(txt)}</td><td>kr ${Number(row.Total)}</td><td>${new Date(row.CreatedAt).toISOString()}</td></tr>`;
            }).join("")}
          </tbody>
        </table>`));
      return;
    }
  } catch {}
  res.send(page("Orders", `
    <h1>Recent orders</h1>
    <p class="muted">In-memory mode (SQL not configured).</p>
    <table>
      <thead><tr><th>#</th><th>Items</th><th>Total</th><th>UTC</th></tr></thead>
      <tbody>${inMemoryOrders.slice(0, 20).map((r, i) =>
        `<tr><td>${i + 1}</td><td>${escapeHtml(r.items.map(x => `${x.sku} x${x.qty}`).join(", "))}</td><td>kr ${Number(r.total)}</td><td>${escapeHtml(r.createdAt)}</td></tr>`).join("")}</tbody>
    </table>`));
});

app.listen(PORT, () => { console.log(`Listening on ${PORT}`); });
