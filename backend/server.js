// Side-effect import MUST be first so process.env is populated before
// any other module (lib/supabase.js) reads from it at evaluation time.
import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import orderRoutes      from './src/routes/orders.js';
import userRoutes       from './src/routes/users.js';
import stripeRoutes     from './src/routes/stripe.js';
import accessRoutes     from './src/routes/access.js';
import activationRoutes from './src/routes/activation.js';
import adminRoutes      from './src/routes/admin.js';
import blogRoutes       from './src/routes/blog.js';
import wcWebhookRoutes  from './src/routes/wcWebhook.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Raw body needed for webhook signature verification — must come before express.json()
app.use('/api/stripe/webhook',       express.raw({ type: 'application/json' }));
app.use('/api/webhooks/woocommerce', express.raw({ type: '*/*' }));

/* -----------------------------------------------------------------------------
 * CORS
 *
 * FRONTEND_URL es un único valor, pero en desarrollo la web se abre desde varios
 * sitios a la vez (localhost:5173, el puerto que Vite elija si ese está ocupado,
 * y el túnel de VS Code). Con un solo origen permitido, todos los demás reciben
 * un preflight rechazado y el checkout falla con "Connection problem".
 *
 * En producción la lista sigue siendo cerrada: sólo FRONTEND_URL y lo que se
 * declare explícitamente en CORS_EXTRA_ORIGINS.
 * ---------------------------------------------------------------------------*/
const isProd = process.env.NODE_ENV === 'production';

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.APP_URL,
  ...(process.env.CORS_EXTRA_ORIGINS || '').split(','),
]
  .map((o) => (o || '').trim().replace(/\/$/, ''))
  .filter(Boolean);

/* Sólo fuera de producción: cualquier puerto local y los túneles de VS Code. */
const devOriginPatterns = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/[a-z0-9-]+\.devtunnels\.ms$/i,
];

app.use(cors({
  credentials: true,
  origin(origin, callback) {
    // Sin cabecera Origin: curl, health checks, webhooks de Stripe, servidor a
    // servidor. No es una petición de navegador, CORS no aplica.
    if (!origin) return callback(null, true);

    const clean = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(clean)) return callback(null, true);
    if (!isProd && devOriginPatterns.some((re) => re.test(clean))) return callback(null, true);

    console.warn(`[cors] Origen bloqueado: ${origin}`);
    return callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },
}));

app.use(express.json());

// Routes
app.use('/api/orders',               orderRoutes);
app.use('/api/users',                userRoutes);
app.use('/api/stripe',               stripeRoutes);
app.use('/api/access',               accessRoutes);
app.use('/api/activation',           activationRoutes);
app.use('/api/admin',                adminRoutes);
app.use('/api/blog',                 blogRoutes);
app.use('/api/webhooks/woocommerce', wcWebhookRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', backend: 'supabase' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack || err);
  res.status(err.statusCode || 500).json({ message: err.message || 'Internal server error' });
});

// No DB connection step — Supabase is reached per-request via @supabase/supabase-js.
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
