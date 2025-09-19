# 🔧 API 连接问题诊断和解决方案

## 问题描述

前端显示"获取数据失败，请检查网络连接"，但后端部署成功。

## 🔍 问题诊断

### 1. 检查后端服务状态

```bash
# 测试后端健康检查
curl https://your-backend-url.com/api/health

# 测试总览数据
curl https://your-backend-url.com/api/overview
```

### 2. 使用诊断脚本

```bash
# 测试本地 API
node test-api.js

# 测试远程 API
node test-api.js https://your-backend-url.com/api/health
```

## 🛠️ 解决方案

### 方案一：修复前端 API 配置

#### 1. 检查环境变量
确保前端部署时设置了正确的 `REACT_APP_API_URL`：

```
REACT_APP_API_URL=https://your-backend-url.com/api
```

#### 2. 更新前端 API 配置
已修复 `frontend/src/api/electricityApi.js`：
- 移除硬编码的 Railway URL
- 使用环境变量或本地开发 URL

### 方案二：修复后端 CORS 配置

#### 1. 更新 CORS 设置
已优化 `backend/src/index.js` 的 CORS 配置：
- 允许所有常见的前端域名
- 支持 Vercel、Railway、Zeabur 域名
- 配置正确的请求头和方法

#### 2. 支持的域名
```javascript
origin: [
  'http://localhost:3000',
  'http://localhost:80',
  'https://electricity-monitor.vercel.app',
  'https://electricity-monitor-frontend.vercel.app',
  'https://*.vercel.app',
  'https://*.railway.app',
  'https://*.zeabur.app'
]
```

## 🚀 部署步骤

### 1. 后端重新部署

#### Railway 部署
```bash
# 推送更新到 GitHub
git add .
git commit -m "修复 CORS 配置"
git push origin main

# Railway 会自动重新部署
```

#### Zeabur 部署
```bash
# 推送更新到 GitHub
git add .
git commit -m "修复 CORS 配置"
git push origin main

# Zeabur 会自动重新部署
```

### 2. 前端重新部署

#### Vercel 部署
1. 访问 [vercel.com](https://vercel.com)
2. 进入项目设置
3. 配置环境变量：
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```
4. 重新部署

## 🔧 环境变量配置

### 后端环境变量
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=3001
NODE_ENV=production
CRON_EXPRESSION=*/10 * * * *
METER_URL=http://www.wap.cnyiot.com/nat/pay.aspx?mid=18100071580
ELECTRICITY_RATE=1.0
LOG_LEVEL=info
```

### 前端环境变量
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

## 🧪 测试连接

### 1. 使用诊断脚本
```bash
# 测试本地开发
node test-api.js

# 测试生产环境
node test-api.js https://your-backend-url.com/api/health
```

### 2. 手动测试
```bash
# 测试健康检查
curl https://your-backend-url.com/api/health

# 测试总览数据
curl https://your-backend-url.com/api/overview

# 测试 CORS
curl -H "Origin: https://your-frontend-url.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://your-backend-url.com/api/health
```

## 📊 常见问题

### 1. CORS 错误
**错误信息**: `Access to fetch at 'https://api.com' from origin 'https://frontend.com' has been blocked by CORS policy`

**解决方案**:
- 检查后端 CORS 配置
- 确保前端域名在允许列表中
- 验证请求头配置

### 2. 网络连接错误
**错误信息**: `Network Error` 或 `Failed to fetch`

**解决方案**:
- 检查后端服务是否运行
- 验证 API URL 是否正确
- 检查网络连接

### 3. 404 错误
**错误信息**: `404 Not Found`

**解决方案**:
- 检查 API 路径是否正确
- 验证后端路由配置
- 确保服务正常启动

### 4. 500 错误
**错误信息**: `500 Internal Server Error`

**解决方案**:
- 检查后端日志
- 验证数据库连接
- 检查环境变量配置

## 🎯 最佳实践

### 1. 开发环境
```javascript
// 本地开发配置
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
```

### 2. 生产环境
```javascript
// 生产环境配置
const API_BASE_URL = process.env.REACT_APP_API_URL;
```

### 3. 错误处理
```javascript
// 统一的错误处理
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API请求失败:', error);
    // 显示用户友好的错误信息
    return Promise.reject(error);
  }
);
```

## 📞 技术支持

如果问题仍然存在：

1. 查看后端服务日志
2. 检查前端浏览器控制台
3. 使用诊断脚本测试连接
4. 在 GitHub 提交 Issue

---

**注意**：确保在生产环境中妥善保护敏感信息，如 API 密钥等。
