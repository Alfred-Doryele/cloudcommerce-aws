/*
 * CloudCommerce — Catalog & Orders API
 * Zero dependencies (Node built-in http only) so the Docker image is tiny
 * and the build never depends on npm registry access.
 *
 * Routes:
 *   GET  /health     -> 200 {"status":"ok"}            (ALB health check)
 *   GET  /products   -> the catalog                    (Lab 3)
 *   POST /orders     -> accepts an order, returns id    (Lab 5 wires this to SQS)
 *
 * Env:
 *   PORT          (default 8080)
 *   ORDER_QUEUE_URL  optional — if set, Lab 5 code path would enqueue here.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8080;

let CATALOG = [];
try {
  CATALOG = JSON.parse(fs.readFileSync(path.join(__dirname, "products.json"), "utf8"));
} catch (e) {
  console.error("Could not load products.json:", e.message);
}

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}
function json(res, code, body) {
  cors(res);
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const url = req.url.split("?")[0];

  if (req.method === "OPTIONS") { cors(res); res.writeHead(204); return res.end(); }

  if (req.method === "GET" && url === "/health") return json(res, 200, { status: "ok" });

  if (req.method === "GET" && url === "/products") return json(res, 200, CATALOG);

  if (req.method === "POST" && url === "/orders") {
    let raw = "";
    req.on("data", (c) => { raw += c; if (raw.length > 1e6) req.destroy(); });
    req.on("end", () => {
      let payload = {};
      try { payload = JSON.parse(raw || "{}"); } catch (e) { return json(res, 400, { error: "invalid JSON" }); }
      const orderId = "ord_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      // Lab 5: instead of just returning, publish {orderId, items} to SQS (ORDER_QUEUE_URL)
      console.log("ORDER", orderId, JSON.stringify(payload.items || []));
      return json(res, 201, { orderId, status: "accepted" });
    });
    return;
  }

  json(res, 404, { error: "not found", path: url });
});

server.listen(PORT, () => console.log(`CloudCommerce API listening on :${PORT}`));
