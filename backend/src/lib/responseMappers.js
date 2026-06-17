/* =============================================================================
 *  Response mappers — convert Supabase rows (snake_case + flat) into the shape
 *  the admin frontend expects (camelCase + nested product object).
 *
 *  Apply these in controllers right before res.json(). The middleware auth flow
 *  still uses snake_case (req.user) so requireAdmin / requireActivation work.
 * ============================================================================*/

export function mapOrder(o) {
  if (!o) return null;
  return {
    id:               o.id,
    _id:              o.id,                      // back-compat with old admin UI
    email:            o.email,
    name:             o.name,
    phone:            o.phone,
    address: {
      line1:      o.address_line1,
      line2:      o.address_line2,
      city:       o.address_city,
      state:      o.address_state,
      postalCode: o.address_postal_code,
      country:    o.address_country,
    },
    product: {
      name:             o.product_name,
      type:             o.product_type,
      includesBracelet: o.product_includes_bracelet,
      price:            o.product_price_cents,    // kept in cents — fmtMoney divides
      currency:         o.product_currency,
    },
    stripeSessionId:       o.stripe_session_id,
    stripePaymentIntentId: o.stripe_payment_intent_id,
    status:                o.status,
    trackingNumber:        o.tracking_number,
    shippedAt:             o.shipped_at,
    deliveredAt:           o.delivered_at,
    notes:                 o.notes,
    activationCode:        o.activation_code,
    qrCodeUrl:             o.qr_code_url,
    isActivated:           o.is_activated,
    userId:                o.user_id,
    createdAt:             o.created_at,
    updatedAt:             o.updated_at,
  };
}

export function mapProfile(p) {
  if (!p) return null;
  return {
    id:                 p.id,
    _id:                p.id,
    email:              p.email,
    name:               p.name,
    birthDate:          p.birth_date,
    birthTime:          p.birth_time,
    birthPlace:         p.birth_place,
    isActivated:        p.is_activated,
    activationCode:     p.activation_code,
    activatedAt:        p.activated_at,
    subscriptionStatus: p.subscription_status,
    subscriptionId:     p.subscription_id,
    subscriptionEndDate:p.subscription_end_date,
    stripeCustomerId:   p.stripe_customer_id,
    trialStartDate:     p.trial_start_date,
    trialEndDate:       p.trial_end_date,
    isAdmin:            p.is_admin,
    createdAt:          p.created_at,
    updatedAt:          p.updated_at,
  };
}

export function mapProduct(p) {
  if (!p) return null;
  return {
    id:           p.id,
    _id:          p.id,
    name:         p.name,
    description:  p.description,
    price:        p.price_cents,                 // kept in cents for fmtMoney
    currency:     p.currency,
    imageUrl:     p.image_url,
    isActive:     p.is_active,
    slug:         p.slug,
    wcProductId:  p.wc_product_id,
    createdAt:    p.created_at,
    updatedAt:    p.updated_at,
  };
}

export function mapBlogPost(b) {
  if (!b) return null;
  return {
    id:          b.id,
    _id:         b.id,
    title:       b.title,
    slug:        b.slug,
    excerpt:     b.excerpt,
    content:     b.content,
    imageUrl:    b.image_url,
    author:      b.author,
    category:    b.category,
    isPublished: b.is_published,
    publishedAt: b.published_at,
    createdAt:   b.created_at,
    updatedAt:   b.updated_at,
  };
}
