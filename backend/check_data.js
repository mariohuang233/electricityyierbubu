const mongoose = require('mongoose');
const ElectricityReading = require('./src/models/ElectricityReading');

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/electricity_monitor');
    console.log('数据库连接成功');

    console.log('=== 检查未来时间数据 ===');
    const now = new Date();
    console.log('当前时间:', now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
    
    const futureData = await ElectricityReading.find({
      collected_at: { $gt: now }
    }).sort({ collected_at: 1 });
    
    console.log('未来时间数据数量:', futureData.length);
    if (futureData.length > 0) {
      console.log('未来时间数据:', futureData.map(d => ({
        time: d.collected_at.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
        meter_id: d.meter_id,
        remaining_kwh: d.remaining_kwh
      })));
    }

    console.log('\n=== 检查用电量异常数据 ===');
    // 获取所有数据并按时间排序
    const allData = await ElectricityReading.find().sort({ collected_at: 1 });
    console.log('总数据量:', allData.length);
    
    const anomalies = [];
    for (let i = 1; i < allData.length; i++) {
      const current = allData[i];
      const previous = allData[i-1];
      
      // 计算用电量（前一次剩余 - 当前剩余）
      const usedKwh = previous.remaining_kwh - current.remaining_kwh;
      
      if (usedKwh > 100 || usedKwh < 0) {
        anomalies.push({
          time: current.collected_at.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
          meter_id: current.meter_id,
          previous_kwh: previous.remaining_kwh,
          current_kwh: current.remaining_kwh,
          used_kwh: usedKwh
        });
      }
    }
    
    console.log('异常用电量数据数量:', anomalies.length);
    if (anomalies.length > 0) {
      console.log('异常数据:', JSON.stringify(anomalies, null, 2));
    }

    console.log('\n=== 最近10条数据 ===');
    const recentData = await ElectricityReading.find()
      .sort({ collected_at: -1 })
      .limit(10);
    
    console.log('最近数据:');
    recentData.forEach((d, i) => {
      console.log(`${i+1}. 时间: ${d.collected_at.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}, 电表ID: ${d.meter_id}, 剩余电量: ${d.remaining_kwh}kWh`);
    });

    console.log('\n=== 数据时间范围 ===');
    const earliest = await ElectricityReading.findOne().sort({ collected_at: 1 });
    const latest = await ElectricityReading.findOne().sort({ collected_at: -1 });
    
    if (earliest && latest) {
      console.log('最早数据时间:', earliest.collected_at.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
      console.log('最晚数据时间:', latest.collected_at.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
    }
    
  } catch (error) {
    console.error('检查数据时出错:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkData();