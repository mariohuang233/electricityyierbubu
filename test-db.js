#!/usr/bin/env node

// 测试数据库连接和数据保存
require('dotenv').config();
const mongoose = require('mongoose');
const ElectricityReading = require('./backend/src/models/ElectricityReading');

async function testDatabase() {
  try {
    console.log('🔍 测试数据库连接...');
    
    // 连接数据库
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/electricity_monitor';
    await mongoose.connect(mongoUri);
    console.log('✅ 数据库连接成功');
    
    // 测试保存数据
    console.log('💾 测试保存数据...');
    const testData = {
      meter_id: '18100071580',
      meter_name: '2759弄18号402阳台',
      remaining_kwh: 4.82,
      collected_at: new Date()
    };
    
    const reading = new ElectricityReading(testData);
    const saved = await reading.save();
    console.log('✅ 数据保存成功:', saved);
    
    // 查询最新数据
    console.log('📊 查询最新数据...');
    const latest = await ElectricityReading.findOne()
      .sort({ collected_at: -1 })
      .lean();
    console.log('📈 最新数据:', latest);
    
    // 查询最近24小时数据数量
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const count = await ElectricityReading.countDocuments({
      collected_at: { $gte: yesterday }
    });
    console.log('📊 最近24小时数据数量:', count);
    
    // 查询所有数据
    const allCount = await ElectricityReading.countDocuments();
    console.log('📊 总数据数量:', allCount);
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 数据库连接已断开');
  }
}

testDatabase();
