import {
  listOrders,
  findOrderById,
  updateOrder,
  getOrderStats,
} from '../data/orders.js';
import { listProfiles } from '../data/profiles.js';
import { mapOrder, mapProfile } from '../lib/responseMappers.js';

// GET /api/admin/orders
export const getOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const result = await listOrders({
      status,
      search,
      page:  Number(page),
      limit: Number(limit),
    });
    res.json({
      ...result,
      orders: (result.orders || []).map(mapOrder),
    });
  } catch (err) { next(err); }
};

// GET /api/admin/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const order = await findOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(mapOrder(order));
  } catch (err) { next(err); }
};

// PATCH /api/admin/orders/:id
// Body: { status, trackingNumber, notes }
export const updateOrderCtrl = async (req, res, next) => {
  try {
    const { status, trackingNumber, notes } = req.body;
    const patch = {};

    if (status) {
      patch.status = status;
      if (status === 'shipped') {
        patch.shipped_at = new Date().toISOString();
        if (trackingNumber) patch.tracking_number = trackingNumber;
      }
      if (status === 'delivered') patch.delivered_at = new Date().toISOString();
    }
    if (trackingNumber !== undefined) patch.tracking_number = trackingNumber;
    if (notes          !== undefined) patch.notes           = notes;

    const order = await updateOrder(req.params.id, patch);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(mapOrder(order));
  } catch (err) { next(err); }
};

// GET /api/admin/stats
export const getStats = async (req, res, next) => {
  try {
    const stats = await getOrderStats();
    const { total: totalUsers } = await listProfiles({ page: 1, limit: 1 });
    res.json({ ...stats, totalUsers });
  } catch (err) { next(err); }
};

// GET /api/admin/users
export const getUsers = async (req, res, next) => {
  try {
    const { search = '', page = 1, limit = 20 } = req.query;
    const result = await listProfiles({
      search,
      page:  Number(page),
      limit: Number(limit),
    });
    res.json({
      ...result,
      users: (result.users || []).map(mapProfile),
    });
  } catch (err) { next(err); }
};
