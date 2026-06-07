import {
  findOrderBySession,
  findOrdersByUser,
  updateOrder,
} from '../data/orders.js';

// GET /api/orders/:sessionId — public, used by confirmation page
export const getOrderBySession = async (req, res, next) => {
  try {
    const order = await findOrderBySession(req.params.sessionId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/my — authenticated user's orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await findOrdersByUser(req.user.id);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/orders/:id/tracking — admin: add tracking number
export const updateTracking = async (req, res, next) => {
  try {
    const { trackingNumber } = req.body;
    const order = await updateOrder(req.params.id, {
      tracking_number: trackingNumber,
      status: 'shipped',
      shipped_at: new Date().toISOString(),
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};
