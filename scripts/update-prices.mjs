import { readFile, writeFile, mkdir } from "node:fs/promises";
import vm from "node:vm";

// Load PRODUCTS from the same file the website uses
const code = await readFile("scripts/products-data.js", "utf8");
const { PRODUCTS, DEFAULT_CURRENCY } = vm.runInNewContext(
  `${code}\n({ PRODUCTS, DEFAULT_CURRENCY })`
);

let prices = {};
try { prices = JSON.parse(await readFile("data/prices.json", "utf8")); } catch {}

// Looks for schema.org "offers" anywhere inside a JSON-LD block
function findOffer(node) {
  if (Array.isArray(node)) {
    for (const n of node) { const r = findOffer(n); if (r) return r; }
    return null;
  }
  if (node && typeof node === "object") {
    if (node.offers) {
      const o = Array.isArray(node.offers) ? node.offers[0] : node.offers;
      const price = o.price ?? o.lowPrice ?? o.priceSpecification?.price;
      if (price != null && !isNaN(parseFloat(price))) {
        return {
          amount: parseFloat(price),
          currency: o.priceCurrency ?? o.priceSpecification?.priceCurrency
        };
      }
    }
    for (const v of Object.values(node)) { const r = findOffer(v); if (r) return r; }
  }
  return null;
}

function extractPrice(html) {
  // 1) JSON-LD structured data (most shops have it)
  const blocks = html.matchAll(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );
  for (const [, json] of blocks) {
    try {
      const found = findOffer(JSON.parse(json));
      if (found) return found;
    } catch {}
  }
  // 2) Open Graph / product meta tags
  const meta = (name) =>
    html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"))?.[1];
  const amount = meta("product:price:amount") ?? meta("og:price:amount");
  if (amount && !isNaN(parseFloat(amount))) {
    return {
      amount: parseFloat(amount),
      currency: meta("product:price:currency") ?? meta("og:price:currency")
    };
  }
  return null;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let ok = 0, failed = 0;

for (const item of PRODUCTS) {
  for (const [tier, variant] of Object.entries(item.variants)) {
    const key = `${item.id}:${tier}`;
    try {
      const res = await fetch(variant.url, {
        headers: { "User-Agent": "HealTheeBot/1.0 (price check)" },
        signal: AbortSignal.timeout(15000)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const found = extractPrice(await res.text());
      if (!found) throw new Error("no price found in page");

      prices[key] = {
        amount: found.amount,
        currency: found.currency ?? DEFAULT_CURRENCY,
        updated: new Date().toISOString().slice(0, 10)
      };
      ok++;
      console.log(`✓ ${key}: ${prices[key].amount} ${prices[key].currency}`);
    } catch (err) {
      failed++;
      console.warn(`✗ ${key}: ${err.message} (keeping previous value)`);
    }
    await sleep(1000); // be polite to the shops
  }
}

await mkdir("data", { recursive: true });
await writeFile("data/prices.json", JSON.stringify(prices, null, 2));
console.log(`\nDone: ${ok} updated, ${failed} failed.`);