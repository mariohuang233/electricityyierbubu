# 家庭用电监控与可视化系统

一个基于 Node.js + React 的家庭用电监控系统，支持自动数据采集、实时监控和趋势分析。

## 🚀 功能特性

- **自动数据采集**: 每10分钟自动爬取电表数据
- **实时监控**: 显示今日、本周、本月用电量和费用
- **趋势分析**: 24小时、30天、月度用电趋势图表
- **移动端适配**: 响应式设计，支持手机和平板访问
- **数据持久化**: MongoDB存储历史数据
- **容器化部署**: 支持Docker和云平台部署

## 📋 系统架构

```
├── backend/           # Node.js后端服务
│   ├── src/
│   │   ├── crawler/   # 数据爬虫
│   │   ├── models/    # 数据模型
│   │   ├── routes/    # API路由
│   │   ├── services/  # 业务逻辑
│   │   └── utils/     # 工具函数
│   └── Dockerfile
├── frontend/          # React前端应用
│   ├── src/
│   │   ├── api/       # API封装
│   │   ├── components/# 组件
│   │   └── pages/     # 页面
│   └── Dockerfile
└── logs/             # 日志文件
```

## 🛠️ 技术栈

### 后端
- **Node.js** + **Express**: 服务器框架
- **MongoDB** + **Mongoose**: 数据库
- **node-cron**: 定时任务
- **axios** + **cheerio**: 数据爬取
- **winston**: 日志管理

### 前端
- **React 18**: 前端框架
- **Ant Design**: UI组件库
- **ECharts**: 数据可视化
- **axios**: HTTP客户端

## 📦 快速开始

### 环境要求

- Node.js >= 16.0.0
- MongoDB数据库
- Docker (可选)

### 1. 克隆项目

```bash
git clone https://github.com/mariohuang233/electricityyierbubu.git
cd electricityyierbubu
```

### 2. 环境配置

复制环境变量文件并配置：

```bash
cp env.example .env
```

编辑 `.env` 文件：

```env
# MongoDB连接字符串
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# 服务端口
PORT=3001

# 爬虫定时任务 (每10分钟)
CRON_EXPRESSION=*/10 * * * *

# 电表URL
METER_URL=http://www.wap.cnyiot.com/nat/pay.aspx?mid=18100071580

# 电费单价 (元/kWh)
ELECTRICITY_RATE=1.0
```

### 3. 安装依赖

```bash
# 后端依赖
cd backend
npm install

# 前端依赖
cd ../frontend
npm install
```

### 4. 启动服务

#### 开发模式

```bash
# 启动后端 (终端1)
cd backend
npm run dev

# 启动前端 (终端2)
cd frontend
npm start
```

#### 生产模式

```bash
# 构建前端
cd frontend
npm run build

# 启动后端
cd backend
npm start
```

访问 http://localhost:3000 查看应用

## 🚀 一键部署

### 使用部署脚本

```bash
# 给脚本执行权限
chmod +x deploy.sh

# Docker 部署
./deploy.sh docker

# Railway 部署准备
./deploy.sh railway

# Zeabur 部署准备
./deploy.sh zeabur
```

## 🐳 Docker 部署

### 使用 Docker Compose

```bash
# 创建 .env 文件并配置环境变量
cp env.example .env

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 单独构建

```bash
# 构建后端镜像
docker build -t electricity-backend ./backend

# 构建前端镜像
docker build -t electricity-frontend ./frontend

# 运行容器
docker run -d --name backend -p 3001:3001 electricity-backend
docker run -d --name frontend -p 80:80 electricity-frontend
```

## ☁️ 云平台部署

### Railway 部署

1. 在 [Railway](https://railway.app) 注册账号
2. 连接 GitHub 仓库 `mariohuang233/electricityyierbubu`
3. 设置环境变量（参考 `env.example`）
4. 部署会自动开始

**环境变量配置：**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=3001
CRON_EXPRESSION=*/10 * * * *
METER_URL=http://www.wap.cnyiot.com/nat/pay.aspx?mid=18100071580
ELECTRICITY_RATE=1.0
LOG_LEVEL=info
NODE_ENV=production
```

### Zeabur 部署

1. 在 [Zeabur](https://zeabur.com) 注册账号
2. 导入 GitHub 仓库 `mariohuang233/electricityyierbubu`
3. 系统会自动识别 `zeabur.json` 配置
4. 为 backend 服务配置环境变量

**环境变量配置：**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=3001
CRON_EXPRESSION=*/10 * * * *
METER_URL=http://www.wap.cnyiot.com/nat/pay.aspx?mid=18100071580
ELECTRICITY_RATE=1.0
LOG_LEVEL=info
NODE_ENV=production
```

**前端服务环境变量：**
```
REACT_APP_API_URL=https://backend-{service-id}.zeabur.app
```

### 详细部署指南

查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 获取详细的部署说明和故障排除指南。

## 📊 API 接口

### 总览数据
```
GET /api/overview
```

### 趋势数据
```
GET /api/trend/24h      # 过去24小时
GET /api/trend/today    # 当天按小时
GET /api/trend/30d      # 最近30天
GET /api/trend/monthly  # 月度统计
```

### 健康检查
```
GET /api/health
```

## 📱 功能截图

- **总览页面**: 显示用电总览和24小时趋势
- **当天趋势**: 按小时显示当天用电情况
- **历史趋势**: 30天和月度用电分析

## 🔧 配置说明

### 爬虫配置

- `CRON_EXPRESSION`: 定时任务表达式，默认每10分钟执行
- `METER_URL`: 电表数据源URL
- 支持失败重试，最多3次

### 数据库配置

- 使用MongoDB存储电表读数
- 自动创建索引优化查询性能
- 支持历史数据导入

### 日志配置

- 使用winston记录系统日志
- 错误日志和综合日志分别存储
- 支持日志级别配置

## 🚨 故障排除

### 常见问题

1. **MongoDB连接失败**
   - 检查连接字符串格式
   - 确认网络连接和防火墙设置

2. **爬虫数据获取失败**
   - 检查目标网站是否可访问
   - 验证HTML解析逻辑

3. **前端无法连接后端**
   - 确认后端服务正常运行
   - 检查代理配置

### 日志查看

```bash
# 查看应用日志
tail -f logs/combined.log

# 查看错误日志
tail -f logs/error.log

# Docker日志
docker-compose logs -f backend
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

## 📞 联系方式

如有问题或建议，请提交 Issue 或联系开发者。

---

**注意**: 请确保在生产环境中妥善保护敏感信息，如数据库连接字符串等。