# 🚀 快速部署指南

## 全栈一键部署

### 🎯 三种部署方式

1. **Docker 全栈部署** (推荐本地开发)
2. **Railway 全栈部署** (推荐云平台)
3. **Zeabur 全栈部署** (推荐云平台)

### 🚀 一键部署命令

```bash
# 给脚本执行权限
chmod +x deploy-stack.sh

# Docker 全栈部署 (推荐)
./deploy-stack.sh docker

# Railway 全栈部署
./deploy-stack.sh railway

# Zeabur 全栈部署
./deploy-stack.sh zeabur
```

## 一键部署到云平台

### Railway 部署（推荐）

1. **访问 Railway**
   - 打开 [railway.app](https://railway.app)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择仓库：`mariohuang233/electricityyierbubu`

3. **配置环境变量**
   在 Railway 项目设置中添加：
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   PORT=3001
   CRON_EXPRESSION=*/10 * * * *
   METER_URL=http://www.wap.cnyiot.com/nat/pay.aspx?mid=18100071580
   ELECTRICITY_RATE=1.0
   LOG_LEVEL=info
   NODE_ENV=production
   ```

4. **部署完成**
   - 等待自动部署
   - 访问提供的域名

### Zeabur 部署

1. **访问 Zeabur**
   - 打开 [zeabur.com](https://zeabur.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择 "Import from GitHub"
   - 选择仓库：`mariohuang233/electricityyierbubu`

3. **自动配置**
   - 系统会自动识别 `zeabur.json`
   - 创建 backend 和 frontend 服务

4. **配置环境变量**
   - Backend 服务环境变量：
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   PORT=3001
   CRON_EXPRESSION=*/10 * * * *
   METER_URL=http://www.wap.cnyiot.com/nat/pay.aspx?mid=18100071580
   ELECTRICITY_RATE=1.0
   LOG_LEVEL=info
   NODE_ENV=production
   ```
   - Frontend 服务环境变量：
   ```
   REACT_APP_API_URL=https://backend-{service-id}.zeabur.app
   ```

## 本地 Docker 部署

```bash
# 克隆项目
git clone https://github.com/mariohuang233/electricityyierbubu.git
cd electricityyierbubu

# 配置环境变量
cp env.example .env
# 编辑 .env 文件，设置 MongoDB 连接字符串

# 一键部署
chmod +x deploy.sh
./deploy.sh docker
```

## 数据库准备

### MongoDB Atlas（推荐）

1. 访问 [cloud.mongodb.com](https://cloud.mongodb.com)
2. 创建免费集群
3. 创建数据库用户
4. 获取连接字符串
5. 在环境变量中设置 `MONGO_URI`

### 本地 MongoDB

```bash
# 安装 MongoDB
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# 启动服务
mongod
```

## 故障排除

### 常见问题

1. **部署失败**
   - 检查 Node.js 版本（需要 >= 20.0.0）
   - 确认所有环境变量已设置
   - 查看部署日志

2. **数据库连接失败**
   - 检查 MongoDB 连接字符串
   - 确认网络连接
   - 验证数据库用户权限

3. **爬虫无法获取数据**
   - 检查目标网站是否可访问
   - 验证 HTML 解析逻辑
   - 查看爬虫日志

### 获取帮助

- 查看详细文档：[DEPLOYMENT.md](./DEPLOYMENT.md)
- 提交 Issue：[GitHub Issues](https://github.com/mariohuang233/electricityyierbubu/issues)
- 查看日志：在云平台控制台查看服务日志

## 成功部署后

1. 访问前端应用
2. 检查数据采集是否正常
3. 查看用电趋势图表
4. 配置自定义域名（可选）

🎉 恭喜！您的家庭用电监控系统已成功部署！
