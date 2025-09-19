require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const apiRoutes = require('./routes/api');
const MeterCrawler = require('./crawler/meterCrawler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:80',
    'https://electricity-monitor.vercel.app',
    'https://electricity-monitor-frontend.vercel.app',
    'https://*.vercel.app',
    'https://*.railway.app',
    'https://*.zeabur.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 路由
app.use('/api', apiRoutes);

// 根路径
app.get('/', (req, res) => {
  res.json({ 
    message: '家庭用电监控系统API',
    version: '1.0.0',
    status: 'running'
  });
});

// 简单健康检查（备用）
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404处理
app.use('*', (req, res) => {
  logger.warn(`404 - 未找到路径: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: '接口不存在',
    path: req.originalUrl,
    method: req.method
  });
});

// 全局错误处理中间件
app.use((error, req, res, next) => {
  logger.error('未捕获的错误:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });
  
  res.status(500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? error.message : '请稍后重试'
  });
});

// MongoDB连接
async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      logger.warn('MONGO_URI环境变量未设置，跳过数据库连接');
      return false;
    }
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB连接成功');
    return true;
  } catch (error) {
    logger.error('MongoDB连接失败:', error);
    logger.warn('应用将在没有数据库连接的情况下启动');
    return false;
  }
}

// 初始化爬虫
const meterCrawler = new MeterCrawler();

// 设置定时任务
function setupCronJob() {
  const cronExpression = process.env.CRON_EXPRESSION || '*/10 * * * *';
  
  cron.schedule(cronExpression, async () => {
    logger.info('开始执行定时爬取任务');
    try {
      await meterCrawler.crawlMeterData();
    } catch (error) {
      logger.error('定时爬取任务失败:', error);
    }
  });
  
  logger.info(`定时任务已设置: ${cronExpression}`);
}

// 启动服务器
async function startServer() {
  try {
    const dbConnected = await connectDB();
    
    app.listen(PORT, () => {
      logger.info(`服务器运行在端口 ${PORT}`);
      console.log(`🚀 服务器启动成功: http://localhost:${PORT}`);
      
      if (dbConnected) {
        // 只有在数据库连接成功时才启动定时任务和爬虫
        setupCronJob();
        
        // 立即执行一次爬取（可选）
        setTimeout(async () => {
          try {
            logger.info('执行初始数据爬取');
            await meterCrawler.crawlMeterData();
          } catch (error) {
            logger.error('初始数据爬取失败:', error);
          }
        }, 5000);
      } else {
        logger.warn('数据库未连接，跳过定时任务和爬虫初始化');
      }
    });
  } catch (error) {
    logger.error('服务器启动失败:', error);
    process.exit(1);
  }
}

// 未捕获异常处理
process.on('uncaughtException', (error) => {
  logger.error('未捕获的异常:', error);
  console.error('未捕获的异常:', error);
  process.exit(1);
});

// 未处理的Promise拒绝
process.on('unhandledRejection', (reason, promise) => {
  logger.error('未处理的Promise拒绝:', { reason, promise });
  console.error('未处理的Promise拒绝:', reason);
  process.exit(1);
});

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('收到SIGTERM信号，正在关闭服务器...');
  mongoose.connection.close(() => {
    logger.info('MongoDB连接已关闭');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('收到SIGINT信号，正在关闭服务器...');
  mongoose.connection.close(() => {
    logger.info('MongoDB连接已关闭');
    process.exit(0);
  });
});

startServer();