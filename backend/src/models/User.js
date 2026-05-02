const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fcmToken: { type: String, required: true, unique: true },
  keywords: [{ type: String }],
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
