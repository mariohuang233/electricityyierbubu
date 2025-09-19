// CORS 配置模块
const cors = require('cors');

// 开发环境 CORS 配置
const devCorsOptions = {
  origin: true, // 允许所有来源
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// 生产环境 CORS 配置
const prodCorsOptions = {
  origin: function (origin, callback) {
    // 允许的域名列表
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:80',
      'http://localhost:3001',
      'https://electricity-monitor.vercel.app',
      'https://electricity-monitor-frontend.vercel.app'
    ];
    
    // 允许所有 Vercel 域名
    const vercelPattern = /^https:\/\/.*\.vercel\.app$/;
    const railwayPattern = /^https:\/\/.*\.railway\.app$/;
    const zeaburPattern = /^https:\/\/.*\.zeabur\.app$/;
    
    // 如果没有 origin（如 Postman 等工具），允许通过
    if (!origin) return callback(null, true);
    
    // 检查是否在允许列表中
    if (allowedOrigins.includes(origin) || 
        vercelPattern.test(origin) || 
        railwayPattern.test(origin) || 
        zeaburPattern.test(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// 根据环境选择配置
const corsOptions = process.env.NODE_ENV === 'production' ? prodCorsOptions : devCorsOptions;

module.exports = cors(corsOptions);
