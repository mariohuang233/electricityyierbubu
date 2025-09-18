const mongoose = require('mongoose');
const ElectricityReading = require('./src/models/ElectricityReading');

async function fixData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/electricity_monitor');
    console.log('数据库连接成功');

    console.log('=== 数据分析报告 ===');
    
    // 检查当前时间
    const now = new Date();
    const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    console.log('当前UTC时间:', now.toISOString());
    console.log('当前北京时间:', beijingTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
    
    // 获取所有数据
    const allData = await ElectricityReading.find().sort({ collected_at: 1 });
    console.log('\n总数据量:', allData.length);
    
    if (allData.length === 0) {
      console.log('没有数据');
      return;
    }
    
    console.log('最早数据:', allData[0].collected_at.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
    console.log('最晚数据:', allData[allData.length - 1].collected_at.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
    
    // 检查未来时间数据
    const futureData = allData.filter(d => d.collected_at > now);
    console.log('\n未来时间数据数量:', futureData.length);
    if (futureData.length > 0) {
      console.log('未来时间数据:');
      futureData.forEach(d => {
        console.log(`- ${d.collected_at.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}: ${d.remaining_kwh}kWh`);
      });
    }
    
    // 检查异常数据
    console.log('\n=== 异常数据分析 ===');
    const anomalies = [];
    const outliers = [];
    
    for (let i = 1; i < allData.length; i++) {
      const current = allData[i];
      const previous = allData[i - 1];
      
      // 检查剩余电量异常跳跃（超过100kWh的变化）
      const diff = Math.abs(current.remaining_kwh - previous.remaining_kwh);
      if (diff > 100) {
        outliers.push({
          index: i,
          time: current.collected_at.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
          previous_kwh: previous.remaining_kwh,
          current_kwh: current.remaining_kwh,
          diff: diff
        });
      }
      
      // 检查用电量异常（负值或超过100kWh）
      const usedKwh = previous.remaining_kwh - current.remaining_kwh;
      if (usedKwh > 100 || usedKwh < -10) {
        anomalies.push({
          index: i,
          time: current.collected_at.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
          previous_kwh: previous.remaining_kwh,
          current_kwh: current.remaining_kwh,
          used_kwh: usedKwh
        });
      }
    }
    
    console.log('剩余电量异常跳跃数量:', outliers.length);
    if (outliers.length > 0) {
      console.log('异常跳跃数据:');
      outliers.forEach(o => {
        console.log(`- ${o.time}: ${o.previous_kwh} -> ${o.current_kwh} (差值: ${o.diff}kWh)`);
      });
    }
    
    console.log('\n异常用电量数据数量:', anomalies.length);
    if (anomalies.length > 0) {
      console.log('异常用电量数据:');
      anomalies.forEach(a => {
        console.log(`- ${a.time}: 用电${a.used_kwh}kWh (${a.previous_kwh} -> ${a.current_kwh})`);
      });
    }
    
    // 数据修复建议
    console.log('\n=== 数据修复建议 ===');
    if (outliers.length > 0) {
      console.log('发现剩余电量异常跳跃，建议:');
      console.log('1. 检查数据采集系统是否有故障');
      console.log('2. 考虑删除或修正异常数据点');
      console.log('3. 如果是电表读数错误，可以用前后数据插值修正');
    }
    
    if (futureData.length > 0) {
      console.log('发现未来时间数据，建议:');
      console.log('1. 检查系统时间设置');
      console.log('2. 删除未来时间的数据记录');
    }
    
    // 提供修复选项
    console.log('\n=== 自动修复选项 ===');
    console.log('如需自动修复，请运行以下命令之一:');
    console.log('1. 删除未来时间数据: node fix_data.js --remove-future');
    console.log('2. 修正异常跳跃数据: node fix_data.js --fix-outliers');
    console.log('3. 删除所有异常数据: node fix_data.js --remove-anomalies');
    
  } catch (error) {
    console.error('数据分析失败:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

fixData();