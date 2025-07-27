const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Complaint = require('../models/Complaint');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Admin Dashboard
router.get('/dashboard', auth, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSuppliers = await User.countDocuments({ role: 'supplier' });
    const totalVendors = await User.countDocuments({ role: 'vendor' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const openComplaints = await Complaint.countDocuments({ status: { $in: ['open', 'in_progress'] } });

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');
    const recentOrders = await Order.find()
      .populate('vendorId', 'name')
      .populate('supplierId', 'name')
      .sort({ orderDate: -1 })
      .limit(5);

    const stats = {
      totalUsers,
      totalSuppliers,
      totalVendors,
      totalProducts,
      totalOrders,
      openComplaints
    };

    res.json({ stats, recentUsers, recentOrders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// View Registered Users
router.get('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const { role, status, page = 1, limit = 10 } = req.query;
    let query = {};
    
    if (role) query.role = role;
    if (status) query.status = status;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve/Suspend/Deactivate Users
router.put('/users/:id/status', auth, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// View All Transactions
router.get('/transactions', auth, authorize('admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = {};
    
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('vendorId', 'name email')
      .populate('supplierId', 'name businessName')
      .sort({ orderDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// View Complaints
router.get('/complaints', auth, authorize('admin'), async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const complaints = await Complaint.find(query)
      .populate('userId', 'name email role')
      .populate('orderId', 'orderNumber')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Complaint.countDocuments(query);

    res.json({
      complaints,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create/Assign Complaint Ticket
router.post('/complaints', auth, authorize('admin'), async (req, res) => {
  try {
    const complaint = new Complaint({
      ...req.body,
      assignedTo: req.user._id
    });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Complaint
router.put('/complaints/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('userId', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Resolve/Close Complaint
router.put('/complaints/:id/resolve', auth, authorize('admin'), async (req, res) => {
  try {
    const { resolution, status = 'resolved' } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        resolution, 
        updatedAt: Date.now() 
      },
      { new: true }
    ).populate('userId', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
