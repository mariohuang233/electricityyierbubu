# 🚀 全栈一键部署指南

## 概述

本指南提供家庭用电监控系统的全栈一键部署方案，支持前后端同时部署到不同平台。

## 🎯 部署方式对比

| 部署方式 | 适用场景 | 优势 | 劣势 |
|---------|---------|------|------|
| **Docker** | 本地开发、测试 | 环境一致、快速启动 | 需要本地 Docker |
| **Railway** | 云平台部署 | 简单易用、自动部署 | 需要 GitHub 连接 |
| **Zeabur** | 云平台部署 | 多服务支持、配置灵活 | 需要手动配置 |

## 🚀 一键部署命令

### 1. Docker 全栈部署 (推荐本地)

```bash
# 克隆项目
git clone https://github.com/mariohuang233/electricityyierbubu.git
cd electricityyierbubu

# 配置环境变量
cp env.example .env
# 编辑 .env 文件，设置 MONGO_URI

# 一键部署
chmod +x deploy-stack.sh
./deploy-stack.sh docker
```

**访问地址：**
- 前端：http://localhost
- 后端：http://localhost:3001
- 健康检查：http://localhost:3001/api/health

### 2. Railway 全栈部署 (推荐云平台)

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录 Railway
railway login

# 一键部署
./deploy-stack.sh railway
```

**部署步骤：**
1. 访问 [railway.app](https://railway.app)
2. 连接 GitHub 仓库
3. 系统自动识别 `railway.json` 配置
4. 设置环境变量
5. 自动部署完成

### 3. Zeabur 全栈部署 (推荐云平台)

```bash
# 一键部署准备
./deploy-stack.sh zeabur
```

**部署步骤：**
1. 访问 [zeabur.com](https://zeabur.com)
2. 导入 GitHub 仓库
3. 系统自动识别 `zeabur.json` 配置
4. 创建 backend 和 frontend 服务
5. 配置环境变量

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

# 前端API地址 (Zeabur需要)
REACT_APP_API_URL=https://backend-{service-id}.zeabur.app
```

## 📊 部署架构

### Docker 部署架构

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   (React)       │◄───┤   (Node.js)     │
│   Port: 80      │    │   Port: 3001     │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
                    │
            ┌─────────────────┐
            │   MongoDB       │
            │   (External)    │
            └─────────────────┘
```

### Railway 部署架构

```
┌─────────────────────────────────────┐
│           Railway Platform          │
├─────────────────┬───────────────────┤
│   Frontend      │   Backend         │
│   (Static)      │   (Node.js)       │
│   *.railway.app │   *.railway.app   │
└─────────────────┴───────────────────┘
                    │
            ┌─────────────────┐
            │   MongoDB       │
            │   (Atlas)       │
            └─────────────────┘
```

### Zeabur 部署架构

```
┌─────────────────────────────────────┐
│           Zeabur Platform           │
├─────────────────┬───────────────────┤
│   Frontend      │   Backend         │
│   (Static)      │   (Node.js)       │
│   *.zeabur.app  │   *.zeabur.app    │
└─────────────────┴───────────────────┘
                    │
            ┌─────────────────┐
            │   MongoDB       │
            │   (Atlas)       │
            └─────────────────┘
```

## 🔍 部署验证

### 健康检查

```bash
# 检查后端服务
curl http://localhost:3001/api/health

# 检查前端服务
curl http://localhost

# 检查服务状态 (Docker)
docker-compose ps
```

### 日志查看

```bash
# Docker 日志
docker-compose logs -f

# 后端日志
docker-compose logs -f backend

# 前端日志
docker-compose logs -f frontend
```

## 🛠️ 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 检查端口占用
   lsof -i :3001
   lsof -i :80
   
   # 停止占用进程
   kill -9 <PID>
   ```

2. **MongoDB 连接失败**
   - 检查连接字符串格式
   - 确认网络连接
   - 验证数据库用户权限

3. **构建失败**
   - 检查 Node.js 版本 (>= 20.0.0)
   - 清理缓存：`npm cache clean --force`
   - 重新安装依赖：`rm -rf node_modules && npm install`

4. **服务无法启动**
   - 检查环境变量配置
   - 查看服务日志
   - 验证端口配置

### 性能优化

1. **Docker 优化**
   ```bash
   # 清理未使用的镜像
   docker system prune -a
   
   # 优化构建缓存
   docker-compose build --no-cache
   ```

2. **云平台优化**
   - 设置合适的资源限制
   - 启用健康检查
   - 配置自动重启

## 📈 监控和维护

### 监控指标

- **CPU 使用率**：后端服务 CPU 占用
- **内存使用率**：服务内存占用
- **请求响应时间**：API 响应延迟
- **错误率**：服务错误统计

### 维护任务

1. **定期备份**
   - MongoDB 数据备份
   - 配置文件备份
   - 日志文件归档

2. **更新部署**
   - 代码更新：`git pull && ./deploy-stack.sh docker`
   - 依赖更新：`npm update`
   - 安全补丁：定期检查漏洞

3. **日志管理**
   - 日志轮转
   - 日志清理
   - 错误告警

## 🎉 部署成功

部署完成后，您可以：

1. **访问前端应用**：查看用电监控界面
2. **使用后端 API**：获取用电数据
3. **查看健康状态**：监控服务运行状态
4. **管理数据**：通过 API 管理用电数据

## 📞 技术支持

如果遇到部署问题：

1. 查看本文档的故障排除部分
2. 检查服务日志
3. 在 GitHub 仓库提交 Issue
4. 联系技术支持

---

**注意**：请确保在生产环境中妥善保护敏感信息，如数据库连接字符串等。
