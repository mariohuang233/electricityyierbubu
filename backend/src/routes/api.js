const express = require('express');
const ElectricityService = require('../services/electricityService');
const logger = require('../utils/logger');

const router = express.Router();
const electricityService = new ElectricityService();

// 总览数据
router.get('/overview', async (req, res) => {
  try {
    const overview = await electricityService.getOverview();
    res.json(overview);
  } catch (error) {
    logger.error('获取总览数据API错误:', error);
    res.status(500).json({ error: '获取总览数据失败' });
  }
});

// 过去24小时趋势
router.get('/trend/24h', async (req, res) => {
  try {
    const trend = await electricityService.get24HourTrend();
    res.json(trend);
  } catch (error) {
    logger.error('获取24小时趋势API错误:', error);
    res.status(500).json({ error: '获取24小时趋势失败' });
  }
});

// 当天用电（按小时）
router.get('/trend/today', async (req, res) => {
  try {
    const trend = await electricityService.getTodayHourlyUsage();
    res.json(trend);
  } catch (error) {
    logger.error('获取当天用电API错误:', error);
    res.status(500).json({ error: '获取当天用电失败' });
  }
});

// 最近30天每日用电
router.get('/trend/30d', async (req, res) => {
  try {
    const trend = await electricityService.get30DayTrend();
    res.json(trend);
  } catch (error) {
    logger.error('获取30天趋势API错误:', error);
    res.status(500).json({ error: '获取30天趋势失败' });
  }
});

// 月度趋势
router.get('/trend/monthly', async (req, res) => {
  try {
    const trend = await electricityService.getMonthlyTrend();
    res.json(trend);
  } catch (error) {
    logger.error('获取月度趋势API错误:', error);
    res.status(500).json({ error: '获取月度趋势失败' });
  }
});



// 手动触发爬虫
router.post('/crawl', async (req, res) => {
  try {
    const MeterCrawler = require('../crawler/meterCrawler');
    const meterCrawler = new MeterCrawler();
    
    logger.info('手动触发爬虫任务');
    const result = await meterCrawler.crawlMeterData();
    
    res.json({
      success: true,
      message: '爬虫任务执行成功',
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('手动爬虫任务失败:', error);
    res.status(500).json({
      success: false,
      error: '爬虫任务执行失败',
      message: error.message
    });
  }
});

// 获取爬虫状态
router.get('/crawler/status', async (req, res) => {
  try {
    const ElectricityReading = require('../models/ElectricityReading');
    
    // 获取最新数据
    const latestReading = await ElectricityReading.findOne()
      .sort({ timestamp: -1 })
      .lean();
    
    // 获取最近24小时的数据数量
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentCount = await ElectricityReading.countDocuments({
      timestamp: { $gte: twentyFourHoursAgo }
    });
    
    res.json({
      latestReading: latestReading ? {
        timestamp: latestReading.timestamp,
        used_kwh: latestReading.used_kwh,
        remaining_kwh: latestReading.remaining_kwh
      } : null,
      recentCount,
      lastUpdate: latestReading ? latestReading.timestamp : null,
      status: latestReading ? 'active' : 'no_data'
    });
  } catch (error) {
    logger.error('获取爬虫状态失败:', error);
    res.status(500).json({ error: '获取爬虫状态失败' });
  }
});

// 健康检查
router.get('/health', (req, res) => {
  // 简单的健康检查，不依赖数据库连接
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  };
  
  res.status(200).json(health);
});

module.exports = router;