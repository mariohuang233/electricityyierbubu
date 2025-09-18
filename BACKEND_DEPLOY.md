# 🚀 后端部署指南

## 概述

本指南提供家庭用电监控系统后端服务的完整部署方案，支持 Railway 和 Zeabur 两个平台。

## 🎯 部署平台对比

| 平台 | 优势 | 劣势 | 推荐度 |
|------|------|------|--------|
| **Railway** | 简单易用、自动部署 | 免费额度有限 | ⭐⭐⭐⭐ |
| **Zeabur** | 免费额度充足、功能丰富 | 配置相对复杂 | ⭐⭐⭐⭐⭐ |

## 🚂 Railway 后端部署

### 配置说明

**railway.json** - Railway 部署配置
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  },
  "variables": {
    "NODE_ENV": "production",
    "PORT": "3001"
  }
}
```

**nixpacks-simple.toml** - Railway 构建配置
```toml
[phases.setup]
nixPkgs = ["nodejs"]

[phases.install]
cmds = [
  "cd backend && npm ci --only=production"
]

[start]
cmd = "cd backend && npm start"

[variables]
NODE_ENV = "production"
PORT = "3001"
```

### 部署步骤

1. **访问 Railway 控制台**
   - 打开 [railway.app](https://railway.app)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择仓库：`mariohuang233/electricityyierbubu`

3. **配置环境变量**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   PORT=3001
   NODE_ENV=production
   CRON_EXPRESSION=*/10 * * * *
   METER_URL=http://www.wap.cnyiot.com/nat/pay.aspx?mid=18100071580
   ELECTRICITY_RATE=1.0
   LOG_LEVEL=info
   ```

4. **部署完成**
   - 等待自动部署
   - 获取服务域名
   - 测试健康检查端点

## ☁️ Zeabur 后端部署

### 配置说明

**zeabur-backend-only.json** - Zeabur 后端专用配置
```json
{
  "name": "electricity-monitor-backend",
  "description": "家庭用电监控系统 - 后端服务",
  "version": "1.0.0",
  "services": [
    {
      "name": "backend",
      "description": "Node.js 后端 API 服务",
      "buildCommand": "cd backend && npm ci --only=production",
      "startCommand": "cd backend && npm start",
      "environment": "node",
      "port": 3001,
      "healthCheck": {
        "path": "/api/health",
        "port": 3001,
        "interval": 30,
        "timeout": 10,
        "retries": 3
      },
      "env": {
        "NODE_ENV": "production",
        "PORT": "3001",
        "LOG_LEVEL": "info"
      },
      "resources": {
        "cpu": "0.5",
        "memory": "512Mi"
      }
    }
  ]
}
```

### 部署步骤

1. **访问 Zeabur 控制台**
   - 打开 [zeabur.com](https://zeabur.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择 "Import from GitHub"
   - 选择仓库：`mariohuang233/electricityyierbubu`

3. **系统自动识别配置**
   - 使用 `zeabur-backend-only.json` 配置
   - 创建后端服务
   - 配置构建和启动命令

4. **配置环境变量**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   PORT=3001
   NODE_ENV=production
   CRON_EXPRESSION=*/10 * * * *
   METER_URL=http://www.wap.cnyiot.com/nat/pay.aspx?mid=18100071580
   ELECTRICITY_RATE=1.0
   LOG_LEVEL=info
   ```

5. **部署完成**
   - 等待构建和部署
   - 获取服务域名
   - 测试健康检查端点

## 🔧 环境变量配置

### 必需环境变量

```env
# MongoDB 连接字符串
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# 服务端口
PORT=3001

# Node.js 环境
NODE_ENV=production
```

### 可选环境变量

```env
# 爬虫定时任务 (每10分钟)
CRON_EXPRESSION=*/10 * * * *

# 电表URL
METER_URL=http://www.wap.cnyiot.com/nat/pay.aspx?mid=18100071580

# 电费单价 (元/kWh)
ELECTRICITY_RATE=1.0

# 日志级别
LOG_LEVEL=info
```

## 📊 部署架构

```
┌─────────────────────────────────────┐
│           Cloud Platform            │
│   (Railway / Zeabur)                │
├─────────────────────────────────────┤
│   Backend Service                   │
│   - Node.js API Server              │
│   - Port: 3001                      │
│   - Health Check: /api/health       │
└─────────────────────────────────────┘
                    │
            ┌─────────────────┐
            │   MongoDB       │
            │   (Atlas)       │
            └─────────────────┘
```

## 🛠️ 故障排除

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本兼容性
   - 确保所有依赖正确安装
   - 查看构建日志

2. **服务无法启动**
   - 检查环境变量配置
   - 验证端口设置
   - 查看服务日志

3. **数据库连接失败**
   - 检查 MongoDB 连接字符串
   - 确认网络连接
   - 验证数据库用户权限

4. **健康检查失败**
   - 检查健康检查端点
   - 验证服务状态
   - 查看错误日志

### 调试步骤

1. **检查服务状态**
   ```bash
   curl https://backend-xxx.railway.app/api/health
   curl https://backend-xxx.zeabur.app/api/health
   ```

2. **查看构建日志**
   - Railway: 在控制台查看构建日志
   - Zeabur: 在控制台查看构建日志

3. **检查环境变量**
   - 确认所有必需变量已设置
   - 验证变量值格式正确

## 🎯 最佳实践

1. **环境变量管理**
   - 使用平台的环境变量功能
   - 保护敏感信息
   - 区分开发和生产环境

2. **服务监控**
   - 启用健康检查
   - 监控资源使用
   - 设置告警通知

3. **版本管理**
   - 使用 Git 标签管理版本
   - 支持回滚部署
   - 保持配置同步

## 🚀 快速部署命令

### Railway 部署
```bash
# 使用 Railway CLI
npm install -g @railway/cli
railway login
railway up
```

### Zeabur 部署
```bash
# 使用后端专用配置
cp zeabur-backend-only.json zeabur.json
git add . && git commit -m "后端专用配置" && git push
```

## 📞 技术支持

如果遇到问题：

1. 查看平台构建日志
2. 检查环境变量配置
3. 验证服务状态
4. 在 GitHub 提交 Issue

---

**推荐**：使用 Zeabur 部署后端，免费额度充足，功能丰富。
