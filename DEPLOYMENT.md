# 部署指南

## 🚀 Railway 部署

### 1. 准备工作
1. 在 [Railway](https://railway.app) 注册账号
2. 连接 GitHub 仓库
3. 准备 MongoDB 数据库（推荐使用 [MongoDB Atlas](https://cloud.mongodb.com)）

### 2. 部署步骤
1. 在 Railway 控制台点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择你的仓库 `mariohuang233/electricityyierbubu`
4. 等待自动部署

### 3. 环境变量配置
在 Railway 项目设置中添加以下环境变量：

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=3001
CRON_EXPRESSION=*/10 * * * *
METER_URL=http://www.wap.cnyiot.com/nat/pay.aspx?mid=18100071580
ELECTRICITY_RATE=1.0
LOG_LEVEL=info
NODE_ENV=production
```

### 4. 自定义域名（可选）
1. 在 Railway 项目设置中点击 "Settings"
2. 在 "Domains" 部分添加自定义域名
3. 配置 DNS 记录指向 Railway 提供的域名

## ☁️ Zeabur 部署

### 1. 准备工作
1. 在 [Zeabur](https://zeabur.com) 注册账号
2. 连接 GitHub 仓库
3. 准备 MongoDB 数据库

### 2. 部署步骤
1. 在 Zeabur 控制台点击 "New Project"
2. 选择 "Import from GitHub"
3. 选择你的仓库 `mariohuang233/electricityyierbubu`
4. 系统会自动识别 `zeabur.json` 配置

### 3. 服务配置
Zeabur 会自动创建两个服务：
- **backend**: Node.js 后端服务
- **frontend**: 静态前端服务

### 4. 环境变量配置
为 backend 服务添加环境变量：

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=3001
CRON_EXPRESSION=*/10 * * * *
METER_URL=http://www.wap.cnyiot.com/nat/pay.aspx?mid=18100071580
ELECTRICITY_RATE=1.0
LOG_LEVEL=info
NODE_ENV=production
```

为 frontend 服务添加环境变量：
```
REACT_APP_API_URL=https://backend-{service-id}.zeabur.app
```

## 🐳 Docker 部署

### 本地 Docker 部署
```bash
# 克隆项目
git clone https://github.com/mariohuang233/electricityyierbubu.git
cd electricityyierbubu

# 复制环境变量文件
cp env.example .env

# 编辑环境变量
nano .env

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 云服务器部署
```bash
# 在服务器上克隆项目
git clone https://github.com/mariohuang233/electricityyierbubu.git
cd electricityyierbubu

# 配置环境变量
cp env.example .env
nano .env

# 启动服务
docker-compose up -d

# 设置开机自启
docker-compose up -d
```

## 🔧 故障排除

### 常见问题

1. **MongoDB 连接失败**
   - 检查连接字符串格式
   - 确认网络连接和防火墙设置
   - 验证数据库用户权限

2. **爬虫数据获取失败**
   - 检查目标网站是否可访问
   - 验证 HTML 解析逻辑
   - 查看爬虫日志

3. **前端无法连接后端**
   - 确认后端服务正常运行
   - 检查 API 地址配置
   - 验证 CORS 设置

4. **部署失败**
   - 检查 Node.js 版本兼容性
   - 确认所有依赖已安装
   - 查看构建日志

### 日志查看

```bash
# Railway 日志
railway logs

# Zeabur 日志
# 在 Zeabur 控制台查看服务日志

# Docker 日志
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 📊 监控和维护

### 健康检查
- 后端健康检查端点：`/api/health`
- 前端健康检查：访问根路径

### 性能监控
- 查看 Railway/Zeabur 控制台的性能指标
- 监控内存和 CPU 使用率
- 设置告警通知

### 数据备份
- 定期备份 MongoDB 数据
- 导出历史用电数据
- 设置自动备份策略

## 🔄 更新部署

### 自动更新
- Railway 和 Zeabur 支持自动部署
- 推送代码到 main 分支会自动触发部署

### 手动更新
```bash
# 拉取最新代码
git pull origin main

# 重新构建和部署
docker-compose down
docker-compose up -d --build
```

## 📞 技术支持

如果遇到部署问题，请：
1. 查看本文档的故障排除部分
2. 检查服务日志
3. 在 GitHub 仓库提交 Issue
4. 联系技术支持
