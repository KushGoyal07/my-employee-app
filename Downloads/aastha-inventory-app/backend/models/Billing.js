const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  items: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  total: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Billing', billingSchema);