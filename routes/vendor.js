const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Vendor Dashboard
router.get('/dashboard', auth, authorize('vendor'), async (req, res) => {
  try {
    const orders = await Order.find({ vendorId: req.user._id })
      .populate('supplierId', 'name businessName')
      .populate('items.productId', 'name');

    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      completedOrders: orders.filter(o => o.status === 'delivered').length,
      totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0)
    };

    res.json({ stats, recentOrders: orders.slice(0, 5) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search Products
router.get('/products/search', auth, authorize('vendor'), async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice } = req.query;
    let query = { status: 'active' };

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    if (category) query.category = category;
    if (minPrice) query.price = { $gte: parseFloat(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: parseFloat(maxPrice) };

    const products = await Product.find(query)
      .populate('supplierId', 'name businessName profile.rating')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// View Product Details
router.get('/products/:id', auth, authorize('vendor'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('supplierId', 'name businessName profile');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Place Order
router.post('/orders', auth, authorize('vendor'), async (req, res) => {
  try {
    const { items, shippingAddress, notes } = req.body;
    
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.productId} not found` });
      }
      
      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });

      // Update product quantity
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity }
      });
    }

    const order = new Order({
      vendorId: req.user._id,
      supplierId: orderItems[0] ? (await Product.findById(orderItems[0].productId)).supplierId : null,
      items: orderItems,
      totalAmount,
      shippingAddress,
      notes
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Vendor Orders
router.get('/orders', auth, authorize('vendor'), async (req, res) => {
  try {
    const orders = await Order.find({ vendorId: req.user._id })
      .populate('supplierId', 'name businessName')
      .populate('items.productId', 'name')
      .sort({ orderDate: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Track Order
router.get('/orders/:id/track', auth, authorize('vendor'), async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      vendorId: req.user._id 
    }).populate('supplierId', 'name businessName phone');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;