const express = require('express');
const router = express.Router();
const Billing = require('../models/Billing');
const Inventory = require('../models/Inventory');

// Create new bill
router.post('/', async (req, res) => {
  try {
    const { items } = req.body;
    let total = 0;

    // Process each item
    for (const item of items) {
      const inventoryItem = await Inventory.findById(item.id);
      if (!inventoryItem) {
        return res.status(400).json({ error: `Item ${item.id} not found` });
      }

      if (inventoryItem.quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${inventoryItem.name}` });
      }

      // Update stock
      inventoryItem.quantity -= item.quantity;
      await inventoryItem.save();
      total += item.quantity * inventoryItem.price;
    }

    // Create bill
    const bill = new Billing({
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total
    });

    await bill.save();
    res.json({ success: true, bill });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get billing history
router.get('/history', async (req, res) => {
  try {
    const history = await Billing.find().sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.post('/', async (req, res) => {
  try {
    const { items, subtotal, tax, total } = req.body;
    
    const bill = new Billing({
      items: items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      subtotal,
      tax,
      total
    });

    await bill.save();
    res.status(201).json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;