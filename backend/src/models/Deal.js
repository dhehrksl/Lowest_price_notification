const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  dealId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  originalUrl: { type: String, required: true },
  source: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' }
});

module.exports = mongoose.model('Deal', dealSchema);
