const mongoose = require('mongoose');
const ElectricityReading = require('./src/models/ElectricityReading');
require('dotenv').config();

async function cleanDirtyData() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/electricity_monitor');
    console.log('Connected to MongoDB');

    // 查找今天19时左右的异常数据
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    
    console.log('Searching for dirty data...');
    
    // 查找所有今天的数据
    const readings = await ElectricityReading.find({
      collected_at: {
        $gte: todayStart,
        $lt: todayEnd
      }
    }).sort({ collected_at: 1 });
    
    console.log(`Found ${readings.length} readings for today`);
    
    // 计算用电量并找出异常数据
    const dirtyReadings = [];
    for (let i = 1; i < readings.length; i++) {
      const current = readings[i];
      const previous = readings[i - 1];
      
      // 计算用电量（前一个剩余电量 - 当前剩余电量）
      const usedKwh = previous.remaining_kwh - current.remaining_kwh;
      
      // 检查是否为异常数据（用电量过大，比如超过50kWh）
      if (usedKwh > 50) {
        const hour = new Date(current.collected_at.getTime() + 8 * 60 * 60 * 1000).getUTCHours();
        console.log(`Found dirty data: Hour ${hour}, Used ${usedKwh.toFixed(2)} kWh`);
        console.log(`Reading ID: ${current._id}, Time: ${current.collected_at}, Remaining: ${current.remaining_kwh}`);
        
        // 特别检查是否是19时113.61kWh的脏数据
        if (Math.abs(usedKwh - 113.61) < 0.1) {
          dirtyReadings.push(current);
          console.log('*** This matches the reported dirty data (113.61 kWh) ***');
        }
      }
    }
    
    if (dirtyReadings.length === 0) {
      console.log('No dirty data found matching the criteria.');
      return;
    }
    
    console.log(`\nFound ${dirtyReadings.length} dirty readings to delete:`);
    dirtyReadings.forEach(reading => {
      console.log(`- ID: ${reading._id}, Time: ${reading.collected_at}, Remaining: ${reading.remaining_kwh}`);
    });
    
    // 询问用户确认
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise(resolve => {
      rl.question('\nDo you want to delete these dirty readings? (y/N): ', resolve);
    });
    
    rl.close();
    
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      // 删除脏数据
      const deleteIds = dirtyReadings.map(r => r._id);
      const result = await ElectricityReading.deleteMany({
        _id: { $in: deleteIds }
      });
      
      console.log(`\nDeleted ${result.deletedCount} dirty readings.`);
      console.log('Clean up completed!');
    } else {
      console.log('Operation cancelled.');
    }
    
  } catch (error) {
    console.error('Error cleaning dirty data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// 运行清理脚本
cleanDirtyData();