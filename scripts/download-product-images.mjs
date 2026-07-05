/**
 * Downloads product images from Unsplash Search API using product names.
 * Usage: UNSPLASH_ACCESS_KEY=your_key node scripts/download-product-images.mjs
 *
 * Rate limit: 1 search request per product (~26/hour for this catalog).
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");

function loadEnvLocal() {
  if (process.env.UNSPLASH_ACCESS_KEY) return;
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^UNSPLASH_ACCESS_KEY=(.+)$/);
    if (match) process.env.UNSPLASH_ACCESS_KEY = match[1].trim();
  }
}

/** Tailored search terms for better product-relevant results */
const SEARCH_QUERIES = {
  "wireless-earbuds": "wireless earbuds product",
  "bluetooth-speaker": "portable bluetooth speaker",
  "smart-power-strip": "smart power strip surge protector",
  "electric-kettle": "electric glass kettle",
  "air-fryer": "digital air fryer kitchen",
  "coffee-grinder": "burr coffee grinder",
  "bath-towel-set": "luxury bath towel set",
  "shower-caddy-organizer": "shower caddy organizer",
  "kids-learning-tablet": "kids learning tablet",
  "stem-robot-kit": "STEM robot building kit toy",
  "dog-bed": "orthopedic dog bed",
  "pet-food-storage": "pet food storage container",
  "vitamin-c-serum-set": "vitamin c skincare serum",
  "hair-care-bundle": "shampoo conditioner hair care",
  "yoga-mat": "yoga mat fitness",
  "resistance-bands-set": "resistance bands exercise",
  "standing-desk-lamp": "LED desk lamp office",
  "ergonomic-mouse-pad": "ergonomic mouse pad wrist rest",
  "leather-wallet": "leather wallet mens",
  "sunglasses-classic": "polarized sunglasses",
  "baby-monitor": "video baby monitor",
  "soft-plush-blanket": "soft baby blanket plush",
  "building-blocks-set": "building blocks toys children",
  "board-game-family": "family board game",
  "foam-roller": "foam roller fitness",
  "essential-oil-diffuser": "essential oil diffuser",
};

function parseProducts() {
  const content = fs.readFileSync(path.join(ROOT, "data", "products.ts"), "utf8");
  const blocks = content.split(/\n  \{/);
  const products = [];

  for (const block of blocks.slice(1)) {
    const slug = block.match(/slug: "([^"]+)"/)?.[1];
    const name = block.match(/name: "([^"]+)"/)?.[1];
    if (slug && name) products.push({ slug, name });
  }

  return products;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function searchPhotos(accessKey, query, perPage = 2) {
  const params = new URLSearchParams({
    query,
    per_page: String(perPage),
    orientation: "squarish",
    content_filter: "high",
  });

  const res = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      "Accept-Version": "v1",
    },
  });

  if (res.status === 403 || res.status === 429) {
    const body = await res.text();
    throw new Error(`Rate limited or forbidden (${res.status}): ${body}`);
  }

  if (!res.ok) {
    throw new Error(`Search failed (${res.status}): ${query}`);
  }

  const data = await res.json();
  return data.results || [];
}

async function downloadImage(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "AAMPartnersLLC/1.0 (product-images)" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Download HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 8000) throw new Error("File too small");
  return buf;
}

function buildQuery(product) {
  return SEARCH_QUERIES[product.slug] || product.name;
}

async function fetchImagesForProduct(accessKey, product, usedPhotoIds) {
  const queries = [buildQuery(product), `${product.name} product`];
  let searchesUsed = 0;

  for (const query of queries) {
    const results = await searchPhotos(accessKey, query, 3);
    searchesUsed += 1;
    const fresh = results.filter((r) => r?.id && !usedPhotoIds.has(r.id));

    if (fresh.length >= 2) {
      return { photos: fresh.slice(0, 2), searchesUsed };
    }
    if (fresh.length === 1) {
      const extra = results.find((r) => r?.id && r.id !== fresh[0].id && !usedPhotoIds.has(r.id));
      if (extra) return { photos: [fresh[0], extra], searchesUsed };
    }
  }

  return { photos: [], searchesUsed };
}

async function main() {
  loadEnvLocal();
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.error("Missing UNSPLASH_ACCESS_KEY environment variable.");
    process.exit(1);
  }

  const products = parseProducts();
  console.log(`Fetching images for ${products.length} products (${products.length} API searches)...\n`);

  const usedPhotoIds = new Set();
  const usedHashes = new Set();
  let success = 0;
  let failed = 0;
  let apiCalls = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const dest1 = path.join(PUBLIC, "products", `${product.slug}-1.jpg`);
    const dest2 = path.join(PUBLIC, "products", `${product.slug}-2.jpg`);
    fs.mkdirSync(path.dirname(dest1), { recursive: true });

    process.stdout.write(`[${i + 1}/${products.length}] ${product.name}... `);

    try {
      const { photos, searchesUsed } = await fetchImagesForProduct(accessKey, product, usedPhotoIds);
      apiCalls += searchesUsed;

      if (photos.length < 2) {
        throw new Error(`Only found ${photos.length} usable photo(s) for "${buildQuery(product)}"`);
      }

      for (let j = 0; j < 2; j++) {
        const photo = photos[j];
        const url = `${photo.urls.regular}&w=900&h=1125&fit=crop&q=85`;
        const buf = await downloadImage(url);
        const hash = crypto.createHash("sha256").update(buf).digest("hex");

        if (usedHashes.has(hash)) {
          throw new Error("Duplicate image content detected");
        }

        fs.writeFileSync(j === 0 ? dest1 : dest2, buf);
        usedPhotoIds.add(photo.id);
        usedHashes.add(hash);
      }

      success++;
      console.log(`✓ (${photos[0].id}, ${photos[1].id})`);
    } catch (err) {
      failed++;
      console.log(`✗ ${err.message}`);
    }

    if (i < products.length - 1) {
      await sleep(1200);
    }
  }

  console.log(`\nDone: ${success} products updated, ${failed} failed, ${apiCalls} API searches used`);

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
