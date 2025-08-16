const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: 'https://via.placeholder.com/60' }
});

module.exports = mongoose.model('Inventory', inventorySchema);