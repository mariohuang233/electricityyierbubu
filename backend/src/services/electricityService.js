const ElectricityReading = require('../models/ElectricityReading');
const logger = require('../utils/logger');

class ElectricityService {
  constructor() {
    this.electricityRate = parseFloat(process.env.ELECTRICITY_RATE) || 1.0;
  }

  // 获取总览数据
  async getOverview() {
    try {
      // 使用北京时间 (UTC+8)
      const now = new Date();
      const beijingOffset = 8 * 60 * 60 * 1000;
      const beijingNow = new Date(now.getTime() + beijingOffset);
      
      // 获取北京时间的今天日期字符串，然后构造UTC的今天开始时间
      const todayStr = beijingNow.toISOString().split('T')[0]; // YYYY-MM-DD
      const todayStart = new Date(todayStr + 'T00:00:00.000Z');
      
      // 计算本周开始时间（周一）
      const beijingDay = beijingNow.getUTCDay();
      const daysToMonday = (beijingDay === 0 ? 6 : beijingDay - 1);
      const weekStartStr = new Date(beijingNow.getTime() - daysToMonday * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const weekStart = new Date(weekStartStr + 'T00:00:00.000Z');
      
      // 计算本月开始时间
      const monthStartStr = `${beijingNow.getUTCFullYear()}-${String(beijingNow.getUTCMonth() + 1).padStart(2, '0')}-01`;
      const monthStart = new Date(monthStartStr + 'T00:00:00.000Z');

      const [todayUsage, weekUsage, monthUsage] = await Promise.all([
        this.calculateUsage(todayStart, now),
        this.calculateUsage(weekStart, now),
        this.calculateUsage(monthStart, now)
      ]);

      // 计算预计月费用：当月费用 / 当月已过天数占比
      const currentDay = beijingNow.getUTCDate();
      const daysInMonth = new Date(beijingNow.getUTCFullYear(), beijingNow.getUTCMonth() + 1, 0).getDate();
      const daysPassed = currentDay;
      const monthProgress = daysPassed / daysInMonth;
      const estimatedMonthlyCost = monthProgress > 0 ? (monthUsage * this.electricityRate) / monthProgress : 0;

      return {
        today_usage: todayUsage,
        week_usage: weekUsage,
        month_usage: monthUsage,
        month_cost: monthUsage * this.electricityRate,
        estimated_cost: estimatedMonthlyCost
      };
    } catch (error) {
      logger.error('获取总览数据失败:', error);
      throw error;
    }
  }

  // 计算指定时间段的用电量
  async calculateUsage(startTime, endTime) {
    try {
      const readings = await ElectricityReading.find({
        collected_at: { $gte: startTime, $lte: endTime }
      }).sort({ collected_at: 1 });

      if (readings.length < 2) return 0;

      const firstReading = readings[0];
      const lastReading = readings[readings.length - 1];
      
      // 用电量 = 开始剩余电量 - 结束剩余电量
      const usage = firstReading.remaining_kwh - lastReading.remaining_kwh;
      
      // 如果结果为负数（可能是充值了），返回0
      return Math.max(0, usage);
    } catch (error) {
      logger.error('计算用电量失败:', error);
      return 0;
    }
  }

  // 获取过去24小时趋势
  async get24HourTrend() {
    try {
      // 使用UTC时间进行查询，因为数据库存储的是UTC时间
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const readings = await ElectricityReading.find({
        collected_at: { $gte: yesterday, $lte: now }
      }).sort({ collected_at: 1 });

      const trend = [];
      for (let i = 1; i < readings.length; i++) {
        const current = readings[i];
        const previous = readings[i - 1];
        const usedKwh = Math.max(0, previous.remaining_kwh - current.remaining_kwh);
        
        trend.push({
          time: current.collected_at,
          used_kwh: usedKwh,
          remaining_kwh: current.remaining_kwh
        });
      }

      return trend;
    } catch (error) {
      logger.error('获取24小时趋势失败:', error);
      throw error;
    }
  }

  // 获取当天用电（按小时）
  async getTodayHourlyUsage() {
    try {
      // 使用北京时间 (UTC+8)
      const utcNow = new Date();
      const beijingNow = new Date(utcNow.getTime() + 8 * 60 * 60 * 1000);
      
      // 获取北京时间的今天开始时间（UTC格式）
      const todayStr = beijingNow.toISOString().split('T')[0];
      const todayStart = new Date(todayStr + 'T00:00:00.000Z');
      
      const readings = await ElectricityReading.find({
        collected_at: { $gte: todayStart, $lte: utcNow }
      }).sort({ collected_at: 1 });

      const hourlyUsage = Array(24).fill(0);
      
      for (let i = 1; i < readings.length; i++) {
        const current = readings[i];
        const previous = readings[i - 1];
        // 转换为北京时间获取小时
        const beijingTime = new Date(current.collected_at.getTime() + 8 * 60 * 60 * 1000);
        const hour = parseInt(beijingTime.toISOString().substr(11, 2));
        const usedKwh = Math.max(0, previous.remaining_kwh - current.remaining_kwh);
        
        hourlyUsage[hour] += usedKwh;
      }

      // 只返回到当前小时为止的数据（北京时间）
      const currentHour = parseInt(beijingNow.toISOString().substr(11, 2));
      return hourlyUsage.slice(0, currentHour + 1).map((used_kwh, hour) => ({ hour, used_kwh }));
    } catch (error) {
      logger.error('获取当天小时用电失败:', error);
      throw error;
    }
  }

  // 获取最近30天每日用电
  async get30DayTrend() {
    try {
      // 使用北京时间 (UTC+8)
      const now = new Date();
      const beijingOffset = 8 * 60 * 60 * 1000;
      const beijingNow = new Date(now.getTime() + beijingOffset);
      
      // 获取北京时间的今天日期字符串，然后构造UTC的今天开始时间
      const todayStr = beijingNow.toISOString().split('T')[0]; // YYYY-MM-DD
      const today = new Date(todayStr + 'T00:00:00.000Z');
      const thirtyDaysAgo = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000); // 包含今天共30天

      const dailyUsage = [];
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
        const dayStart = date; // 直接使用UTC时间
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
        
        // 确保不超过今天（包含今天）
        if (dayStart > today) break;
        
        const usage = await this.calculateUsage(dayStart, Math.min(dayEnd, now));
        
        dailyUsage.push({
          date: dayStart.toISOString().split('T')[0],
          used_kwh: usage
        });
      }

      return dailyUsage;
    } catch (error) {
      logger.error('获取30天趋势失败:', error);
      throw error;
    }
  }

  // 获取每月用电
  async getMonthlyTrend() {
    try {
      // 使用北京时间 (UTC+8)
      const now = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
      const monthlyUsage = [];
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        
        const usage = await this.calculateUsage(monthStart, monthEnd);
        
        monthlyUsage.push({
          month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
          used_kwh: usage
        });
      }

      return monthlyUsage;
    } catch (error) {
      logger.error('获取月度趋势失败:', error);
      throw error;
    }
  }

  // 导出数据为CSV格式
  async exportToCSV(startDate, endDate) {
    try {
      const query = {};
      
      if (startDate || endDate) {
        query.collected_at = {};
        if (startDate) query.collected_at.$gte = new Date(startDate);
        if (endDate) query.collected_at.$lte = new Date(endDate);
      }
      
      const readings = await ElectricityReading.find(query)
        .sort({ collected_at: 1 })
        .lean();
      
      // CSV头部
      let csv = 'Date,Time,Meter ID,Meter Name,Remaining kWh,Used kWh\n';
      
      // 计算用电量并生成CSV行
      for (let i = 0; i < readings.length; i++) {
        const current = readings[i];
        const previous = readings[i - 1];
        
        const usedKwh = previous ? 
          Math.max(0, previous.remaining_kwh - current.remaining_kwh) : 0;
        
        const date = new Date(current.collected_at);
        const dateStr = date.toISOString().split('T')[0];
        const timeStr = date.toTimeString().split(' ')[0];
        
        csv += `${dateStr},${timeStr},${current.meter_id},"${current.meter_name}",${current.remaining_kwh},${usedKwh}\n`;
      }
      
      return csv;
    } catch (error) {
      logger.error('CSV导出失败:', error);
      throw error;
    }
  }
}

module.exports = ElectricityService;