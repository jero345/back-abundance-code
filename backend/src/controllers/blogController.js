import * as Blog from '../data/blogPosts.js';

/* ── PUBLIC ──────────────────────────────────────────────────────────────── */

// GET /api/blog
export const getPosts = async (req, res, next) => {
  try {
    const page     = Math.max(1, parseInt(req.query.page)  || 1);
    const limit    = Math.min(50, parseInt(req.query.limit) || 12);
    const category = req.query.category;

    const result = await Blog.listPublished({ category, page, limit });
    res.json(result);
  } catch (err) { next(err); }
};

// GET /api/blog/:slug
export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await Blog.findPublishedBySlug(req.params.slug);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) { next(err); }
};

/* ── ADMIN ───────────────────────────────────────────────────────────────── */

// GET /api/admin/blog
export const adminGetPosts = async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const result = await Blog.listAll({ page, limit });
    res.json(result);
  } catch (err) { next(err); }
};

// GET /api/admin/blog/:id
export const adminGetPost = async (req, res, next) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) { next(err); }
};

// POST /api/admin/blog
export const adminCreatePost = async (req, res, next) => {
  try {
    const { title, slug, excerpt, content, imageUrl, author, category, isPublished } = req.body;
    const post = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      image_url:    imageUrl,
      author,
      category,
      is_published: !!isPublished,
    });
    res.status(201).json(post);
  } catch (err) { next(err); }
};

// PATCH /api/admin/blog/:id
export const adminUpdatePost = async (req, res, next) => {
  try {
    const patch = {};
    const map = {
      title:       'title',
      slug:        'slug',
      excerpt:     'excerpt',
      content:     'content',
      imageUrl:    'image_url',
      author:      'author',
      category:    'category',
      isPublished: 'is_published',
    };
    for (const [k, dbCol] of Object.entries(map)) {
      if (req.body[k] !== undefined) patch[dbCol] = req.body[k];
    }

    const post = await Blog.update(req.params.id, patch);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) { next(err); }
};

// DELETE /api/admin/blog/:id
export const adminDeletePost = async (req, res, next) => {
  try {
    await Blog.remove(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
