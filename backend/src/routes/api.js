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



// 健康检查
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;