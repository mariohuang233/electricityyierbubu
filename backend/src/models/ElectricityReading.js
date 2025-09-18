const mongoose = require('mongoose');

const electricityReadingSchema = new mongoose.Schema({
  meter_id: {
    type: String,
    required: true,
    index: true
  },
  meter_name: {
    type: String,
    required: true
  },
  remaining_kwh: {
    type: Number,
    required: true,
    min: 0
  },
  collected_at: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// 复合索引用于查询优化
electricityReadingSchema.index({ meter_id: 1, collected_at: -1 });

module.exports = mongoose.model('ElectricityReading', electricityReadingSchema);