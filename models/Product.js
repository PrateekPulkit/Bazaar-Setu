const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  minOrderQuantity: { type: Number, default: 1 },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  images: [String],
  specifications: [{
    key: String,
    value: String
  }],
  status: { type: String, enum: ['active', 'inactive', 'out_of_stock'], default: 'active' },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);