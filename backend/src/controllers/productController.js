import * as Products from '../data/products.js';
import { mapProduct } from '../lib/responseMappers.js';

// GET /api/admin/products
export const getProducts = async (req, res, next) => {
  try {
    const products = await Products.listProducts();
    res.json({ products: products.map(mapProduct) });
  } catch (err) { next(err); }
};

// POST /api/admin/products
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, imageUrl, isActive, slug } = req.body;
    const product = await Products.createProduct({
      name,
      description,
      price_cents: Math.round(Number(price) * 100), // dollars → cents
      image_url:   imageUrl,
      is_active:   isActive !== false,
      slug,
    });
    res.status(201).json(mapProduct(product));
  } catch (err) { next(err); }
};

// PATCH /api/admin/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, imageUrl, isActive, slug } = req.body;
    const patch = {};
    if (name        !== undefined) patch.name        = name;
    if (description !== undefined) patch.description = description;
    if (imageUrl    !== undefined) patch.image_url   = imageUrl;
    if (isActive    !== undefined) patch.is_active   = isActive;
    if (slug        !== undefined) patch.slug        = slug;
    if (price       !== undefined) patch.price_cents = Math.round(Number(price) * 100);

    const product = await Products.updateProduct(req.params.id, patch);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(mapProduct(product));
  } catch (err) { next(err); }
};

// DELETE /api/admin/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    await Products.deleteProduct(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
