// Side-effect import MUST be first so process.env is populated before
// any other module (lib/supabase.js) reads from it at evaluation time.
import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import orderRoutes      from './src/routes/orders.js';
import userRoutes       from './src/routes/users.js';
import stripeRoutes     from './src/routes/stripe.js';
import activationRoutes from './src/routes/activation.js';
import adminRoutes      from './src/routes/admin.js';
import blogRoutes       from './src/routes/blog.js';
import wcWebhookRoutes  from './src/routes/wcWebhook.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Raw body needed for webhook signature verification — must come before express.json()
app.use('/api/stripe/webhook',       express.raw({ type: 'application/json' }));
app.use('/api/webhooks/woocommerce', express.raw({ type: '*/*' }));

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/orders',               orderRoutes);
app.use('/api/users',                userRoutes);
app.use('/api/stripe',               stripeRoutes);
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
