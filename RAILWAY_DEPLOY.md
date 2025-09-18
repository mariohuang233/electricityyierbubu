# 🚂 Railway 部署指南

## 问题解决

### 修复 Nixpacks 构建错误

Railway 部署时遇到的错误是由于 Nixpacks 配置中的包名问题。已修复：

1. **移除无效的 npm 包名**：`npm` 不是有效的 Nix 包名
2. **简化配置**：只保留必要的 Node.js 包
3. **优化构建流程**：专注于后端服务部署

## 🚀 Railway 部署方案

### 方案一：后端服务部署 (推荐)

Railway 主要支持单服务部署，建议先部署后端服务：

```bash
# 使用简化配置
cp railway-simple.json railway.json
cp nixpacks-simple.toml nixpacks.toml

# 部署到 Railway
railway up
```

**配置说明：**
- 只部署后端 Node.js 服务
- 前端可以单独部署到其他平台
- 后端提供 API 服务

### 方案二：全栈部署 (高级)

如果需要全栈部署，需要创建两个独立的 Railway 项目：

#### 1. 后端项目
```bash
# 后端部署配置
echo '{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && npm start",
    "healthcheckPath": "/api/health"
  }
}' > railway-backend.json
```

#### 2. 前端项目
```bash
# 前端部署配置
echo '{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd frontend && npm run build && npx serve -s build"
  }
}' > railway-frontend.json
```

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
REACT_APP_API_URL=https://backend-production-xxxx.up.railway.app
```

## 📋 部署步骤

### 1. 后端部署

1. 在 Railway 创建新项目
2. 连接 GitHub 仓库
3. 设置根目录为项目根目录
4. 配置环境变量
5. 部署

### 2. 前端部署

1. 在 Railway 创建新项目
2. 连接 GitHub 仓库
3. 设置根目录为项目根目录
4. 配置环境变量（API URL）
5. 部署

## 🛠️ 故障排除

### 常见问题

1. **Nixpacks 构建失败**
   - 检查 `nixpacks.toml` 配置
   - 确保包名正确
   - 简化构建流程

2. **端口配置错误**
   - 确保 PORT 环境变量正确
   - 检查健康检查路径

3. **依赖安装失败**
   - 检查 package.json 配置
   - 确保 Node.js 版本兼容

### 调试命令

```bash
# 本地测试构建
nixpacks build

# 检查配置
railway status

# 查看日志
railway logs
```

## 🎯 最佳实践

1. **单服务部署**：Railway 适合单服务部署
2. **环境变量**：使用 Railway 的环境变量管理
3. **健康检查**：配置正确的健康检查路径
4. **日志监控**：使用 Railway 的日志功能

## 📊 部署架构

```
┌─────────────────────────────────────┐
│           Railway Platform          │
├─────────────────┬───────────────────┤
│   Backend       │   Frontend        │
│   (Node.js)     │   (Static)        │
│   *.railway.app │   *.railway.app   │
└─────────────────┴───────────────────┘
                    │
            ┌─────────────────┐
            │   MongoDB       │
            │   (Atlas)       │
            └─────────────────┘
```

## 🚀 快速部署

```bash
# 1. 克隆项目
git clone https://github.com/mariohuang233/electricityyierbubu.git
cd electricityyierbubu

# 2. 安装 Railway CLI
npm install -g @railway/cli

# 3. 登录 Railway
railway login

# 4. 部署后端
railway up

# 5. 获取域名
railway domain
```

## 📞 技术支持

如果遇到问题：

1. 查看 Railway 构建日志
2. 检查环境变量配置
3. 验证 Nixpacks 配置
4. 在 GitHub 提交 Issue

---

**注意**：Railway 主要支持单服务部署，如需全栈部署，建议使用 Docker 或 Zeabur 方案。
