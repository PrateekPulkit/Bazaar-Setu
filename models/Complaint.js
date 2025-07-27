const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  ticketNumber: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['product_quality', 'delivery_issue', 'payment_issue', 'service_issue', 'other'],
    required: true
  },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  status: { 
    type: String, 
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resolution: String,
  attachments: [String]
});

complaintSchema.pre('save', function(next) {
  if (this.isNew && !this.ticketNumber) {
    this.ticketNumber = 'TKT' + Date.now() + Math.floor(Math.random() * 1000);
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);