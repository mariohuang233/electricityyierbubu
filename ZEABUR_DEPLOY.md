# 🚀 Zeabur 全栈一键部署指南

## 问题解决

### 修复前端构建错误

遇到的 `react-scripts: not found` 错误已修复：

1. **移动 react-scripts 到 dependencies**
   - 从 `devDependencies` 移动到 `dependencies`
   - 确保生产构建时可用

2. **优化构建命令**
   - 使用 `npm install` 而不是 `npm ci`
   - 确保所有依赖正确安装

## 🚀 Zeabur 一键部署

### 方法一：使用简化配置（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/mariohuang233/electricityyierbubu.git
cd electricityyierbubu

# 2. 使用简化配置
cp zeabur-simple.json zeabur.json

# 3. 推送到 GitHub
git add .
git commit -m "使用简化 Zeabur 配置"
git push origin main
```

### 方法二：使用部署脚本

```bash
# 使用全栈部署脚本
./deploy-stack.sh zeabur
```

## 🌐 Zeabur 部署步骤

### 1. 访问 Zeabur 控制台
- 打开 [zeabur.com](https://zeabur.com)
- 使用 GitHub 账号登录

### 2. 创建新项目
- 点击 "New Project"
- 选择 "Import from GitHub"
- 选择仓库：`mariohuang233/electricityyierbubu`

### 3. 自动服务创建
系统会自动识别 `zeabur.json` 配置，创建两个服务：
- **backend** - Node.js 后端服务
- **frontend** - React 前端静态服务

### 4. 配置环境变量

#### Backend 服务环境变量
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=3001
NODE_ENV=production
CRON_EXPRESSION=*/10 * * * *
METER_URL=http://www.wap.cnyiot.com/nat/pay.aspx?mid=18100071580
ELECTRICITY_RATE=1.0
LOG_LEVEL=info
```

#### Frontend 服务环境变量
```
REACT_APP_API_URL=https://backend-{service-id}.zeabur.app
```

**注意**：`{service-id}` 需要替换为实际的 backend 服务 ID

### 5. 部署完成
- 等待构建完成
- 获取服务域名
- 访问前端应用

## 🔧 配置说明

### 简化配置 (zeabur-simple.json)
```json
{
  "name": "electricity-monitor",
  "services": [
    {
      "name": "backend",
      "buildCommand": "cd backend && npm install && npm start",
      "startCommand": "cd backend && npm start",
      "environment": "node",
      "port": 3001
    },
    {
      "name": "frontend", 
      "buildCommand": "cd frontend && npm install && npm run build",
      "outputDir": "frontend/build",
      "environment": "static"
    }
  ]
}
```

### 完整配置 (zeabur.json)
包含健康检查、资源限制、网络配置等高级功能。

## 🛠️ 故障排除

### 常见问题

1. **react-scripts: not found**
   - ✅ 已修复：将 react-scripts 移到 dependencies
   - 确保使用 `npm install` 而不是 `npm ci`

2. **构建失败**
   - 检查 Node.js 版本兼容性
   - 确保所有依赖正确安装
   - 查看构建日志

3. **服务无法启动**
   - 检查环境变量配置
   - 验证端口设置
   - 查看服务日志

4. **前端无法连接后端**
   - 检查 REACT_APP_API_URL 配置
   - 确保后端服务正常运行
   - 验证 CORS 设置

### 调试步骤

1. **查看构建日志**
   - 在 Zeabur 控制台查看构建日志
   - 检查依赖安装过程
   - 验证构建命令执行

2. **检查服务状态**
   - 查看服务健康状态
   - 验证端口配置
   - 检查资源使用情况

3. **测试 API 连接**
   - 访问后端健康检查端点
   - 测试 API 接口
   - 验证数据库连接

## 📊 部署架构

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

## 🎯 最佳实践

1. **环境变量管理**
   - 使用 Zeabur 的环境变量功能
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

```bash
# 一键部署到 Zeabur
./deploy-stack.sh zeabur

# 或手动部署
git add .
git commit -m "部署到 Zeabur"
git push origin main
```

## 📞 技术支持

如果遇到问题：

1. 查看 Zeabur 构建日志
2. 检查环境变量配置
3. 验证服务状态
4. 在 GitHub 提交 Issue

---

**注意**：确保在生产环境中妥善保护敏感信息，如数据库连接字符串等。
