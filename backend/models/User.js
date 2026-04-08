const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['USER', 'INFORMAL_WORKER', 'ADMIN'],
    default: 'USER'
  },
  // Informal worker fields for Transparent Ledger
  verificationCount: {
    type: Number,
    default: 0
  },
  totalRewardsGenerated: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
