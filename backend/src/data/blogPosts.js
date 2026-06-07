import { sb, throwIfError } from '../lib/supabase.js';

const FULL_COLS    = 'id, title, slug, excerpt, content, image_url, author, category, is_published, published_at, created_at, updated_at';
const SUMMARY_COLS = 'id, title, slug, excerpt, image_url, author, category, is_published, published_at, created_at, updated_at';

/* ── Public ──────────────────────────────────────────────────────────────── */

export async function listPublished({ category, page = 1, limit = 12 } = {}) {
  const from = (page - 1) * limit;
  const to   = from + limit - 1;

  let q = sb
    .from('blog_posts')
    .select(SUMMARY_COLS, { count: 'exact' })
    .eq('is_published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (category) q = q.eq('category', category);

  const { data, error, count } = await q;
  throwIfError(error);
  return { posts: data || [], total: count || 0, page, pages: Math.ceil((count || 0) / limit) };
}

export async function findPublishedBySlug(slug) {
  const { data, error } = await sb
    .from('blog_posts')
    .select(FULL_COLS)
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  throwIfError(error);
  return data;
}

/* ── Admin ───────────────────────────────────────────────────────────────── */

export async function listAll({ page = 1, limit = 20 } = {}) {
  const from = (page - 1) * limit;
  const to   = from + limit - 1;

  const { data, error, count } = await sb
    .from('blog_posts')
    .select(SUMMARY_COLS, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  throwIfError(error);
  return { posts: data || [], total: count || 0, page, pages: Math.ceil((count || 0) / limit) };
}

export async function findById(id) {
  const { data, error } = await sb
    .from('blog_posts')
    .select(FULL_COLS)
    .eq('id', id)
    .maybeSingle();
  throwIfError(error);
  return data;
}

export async function create(payload) {
  // Auto-generate slug from title if not provided
  if (!payload.slug && payload.title) {
    payload.slug = slugify(payload.title);
  }
  // Set published_at if publishing for the first time
  if (payload.is_published && !payload.published_at) {
    payload.published_at = new Date().toISOString();
  }
  const { data, error } = await sb
    .from('blog_posts')
    .insert(payload)
    .select(FULL_COLS)
    .single();
  throwIfError(error);
  return data;
}

export async function update(id, patch) {
  // Stamp publish date on first publish
  if (patch.is_published) {
    const cur = await findById(id);
    if (cur && !cur.published_at) {
      patch.published_at = new Date().toISOString();
    }
  }
  const { data, error } = await sb
    .from('blog_posts')
    .update(patch)
    .eq('id', id)
    .select(FULL_COLS)
    .maybeSingle();
  throwIfError(error);
  return data;
}

export async function remove(id) {
  const { error } = await sb
    .from('blog_posts')
    .delete()
    .eq('id', id);
  throwIfError(error);
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}
