/**
 * Run once to create Crystal Code products in WooCommerce.
 * Usage: node scripts/createWcProducts.js
 */
import dotenv from 'dotenv';
dotenv.config();

const WC_URL    = process.env.WC_URL;
const WC_KEY    = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

if (!WC_URL || !WC_KEY || !WC_SECRET) {
  console.error('Missing WC_URL / WC_CONSUMER_KEY / WC_CONSUMER_SECRET in .env');
  process.exit(1);
}

async function wcPost(path, body) {
  const credentials = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
  const res = await fetch(`${WC_URL}/wp-json/wc/v3${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

const products = [
  {
    key: 'WC_CRYSTAL_CODE_ID',
    name: 'Crystal Code',
    slug: 'crystal-code',
    regular_price: '177.00',
    description: 'Premium crystal sphere with unique engraved QR + illuminated base + premium box + personalized portal + complete block diagnosis.',
    virtual: true,
  },
  {
    key: 'WC_CRYSTAL_CODE_PREMIUM_ID',
    name: 'Crystal Code Premium',
    slug: 'crystal-code-premium',
    regular_price: '217.00',
    description: 'Everything in Crystal Code + Energy bracelet to integrate the process into your daily life.',
    virtual: true,
  },
];

console.log('Creating WooCommerce products...\n');

for (const p of products) {
  try {
    const { id, name } = await wcPost('/products', {
      name: p.name,
      slug: p.slug,
      regular_price: p.regular_price,
      description: p.description,
      virtual: p.virtual,
      status: 'publish',
      catalog_visibility: 'hidden', // not shown in shop, only used internally
    });
    console.log(`✓ "${name}" created — ID: ${id}`);
    console.log(`  Add to .env: ${p.key}=${id}\n`);
  } catch (err) {
    console.error(`✗ Failed to create "${p.name}":`, err.message);
  }
}
