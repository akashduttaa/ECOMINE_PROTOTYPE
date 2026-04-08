const mongoose = require('mongoose');

const ScanRecordSchema = new mongoose.Schema({
  userWallet: {
    type: String,
    required: true
  },
  deviceModel: {
    type: String,
    required: true
  },
  estimatedMaterials: {
    type: Map,
    of: Number, // material name to grams
    required: true
  },
  estimatedReward: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING_DROPOFF', 'VERIFIED_BY_WORKER', 'REWARD_ISSUED'],
    default: 'PENDING_DROPOFF'
  },
  workerWallet: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ScanRecord', ScanRecordSchema);
