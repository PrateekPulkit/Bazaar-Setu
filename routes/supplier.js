const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Supplier Dashboard
router.get('/dashboard', auth, authorize('supplier'), async (req, res) => {
  try {
    const products = await Product.find({ supplierId: req.user._id });
    const orders = await Order.find({ supplierId: req.user._id })
      .populate('vendorId', 'name email')
      .populate('items.productId', 'name');

    const stats = {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.status === 'active').length,
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      revenue: orders.reduce((sum, order) => sum + order.totalAmount, 0)
    };

    res.json({ stats, recentOrders: orders.slice(0, 5) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Manage Products
router.get('/products', auth, authorize('supplier'), async (req, res) => {
  try {
    const products = await Product.find({ supplierId: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/products', auth, authorize('supplier'), async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      supplierId: req.user._id
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/products/:id', auth, authorize('supplier'), async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, supplierId: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// View Orders
router.get('/orders', auth, authorize('supplier'), async (req, res) => {
  try {
    const orders = await Order.find({ supplierId: req.user._id })
      .populate('vendorId', 'name email phone')
      .populate('items.productId', 'name')
      .sort({ orderDate: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Order Status
router.put('/orders/:id/status', auth, authorize('supplier'), async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, supplierId: req.user._id },
      { status, trackingNumber },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;