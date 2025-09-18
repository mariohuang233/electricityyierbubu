# 🚀 Vercel 前端部署指南

## 问题解决

### 修复环境变量错误

Vercel 提示 `Environment Variable "REACT_APP_API_URL" references Secret "react_app_api_url", which does not exist.` 的解决方案：

1. **移除错误的配置**
   - 删除 `vercel.json` 中的错误环境变量配置
   - 使用 Vercel 控制台直接配置环境变量

2. **正确的配置方式**
   - 在 Vercel 控制台设置环境变量
   - 不要使用 `@` 符号引用不存在的 Secret

## 🚀 Vercel 部署步骤

### 方法一：使用 Vercel 控制台（推荐）

#### 1. 访问 Vercel 控制台
- 打开 [vercel.com](https://vercel.com)
- 使用 GitHub 账号登录

#### 2. 导入项目
- 点击 "New Project"
- 选择 "Import Git Repository"
- 选择仓库：`mariohuang233/electricityyierbubu`

#### 3. 配置项目设置
- **Framework Preset**: Create React App
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

#### 4. 配置环境变量
在 Vercel 项目设置中添加环境变量：

**环境变量名称**: `REACT_APP_API_URL`
**环境变量值**: `https://backend-xxx.zeabur.app`

（将 `xxx` 替换为实际的 Zeabur 后端域名）

#### 5. 部署完成
- 点击 "Deploy" 开始部署
- 等待构建完成
- 获得前端域名

### 方法二：使用 Vercel CLI

#### 1. 安装 Vercel CLI
```bash
npm install -g vercel
```

#### 2. 登录 Vercel
```bash
vercel login
```

#### 3. 部署项目
```bash
# 进入前端目录
cd frontend

# 部署到 Vercel
vercel

# 配置环境变量
vercel env add REACT_APP_API_URL
# 输入值：https://backend-xxx.zeabur.app
```

## 🔧 环境变量配置

### 必需环境变量

```
REACT_APP_API_URL=https://backend-xxx.zeabur.app
```

**注意**：
- 将 `xxx` 替换为实际的 Zeabur 后端域名
- 确保 URL 以 `https://` 开头
- 不要使用 `@` 符号引用 Secret

### 获取后端域名

1. **部署后端到 Zeabur**
   - 访问 [zeabur.com](https://zeabur.com)
   - 导入项目并部署
   - 获取后端服务域名

2. **记录后端域名**
   - 格式：`https://backend-xxx.zeabur.app`
   - 用于前端环境变量配置

## 📊 部署架构

```
┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Zeabur        │
│   (Frontend)    │◄───┤   (Backend)     │
│   *.vercel.app  │    │   *.zeabur.app  │
└─────────────────┘    └─────────────────┘
                                │
                        ┌─────────────────┐
                        │   MongoDB       │
                        │   (Atlas)       │
                        └─────────────────┘
```

## 🛠️ 故障排除

### 常见问题

1. **环境变量错误**
   - 确保在 Vercel 控制台正确配置
   - 不要使用 `@` 符号引用不存在的 Secret
   - 检查变量名和值是否正确

2. **构建失败**
   - 检查 Node.js 版本兼容性
   - 确保所有依赖正确安装
   - 查看构建日志

3. **API 连接失败**
   - 检查 `REACT_APP_API_URL` 配置
   - 确保后端服务正常运行
   - 验证 CORS 设置

### 调试步骤

1. **检查环境变量**
   ```bash
   # 在 Vercel 控制台查看环境变量
   # 确保 REACT_APP_API_URL 配置正确
   ```

2. **测试后端连接**
   ```bash
   curl https://backend-xxx.zeabur.app/api/health
   ```

3. **查看构建日志**
   - 在 Vercel 控制台查看构建日志
   - 检查是否有错误信息

## 🎯 最佳实践

1. **环境变量管理**
   - 使用 Vercel 控制台管理环境变量
   - 区分开发和生产环境
   - 保护敏感信息

2. **部署优化**
   - 启用自动部署
   - 配置分支预览
   - 设置自定义域名

3. **性能优化**
   - 启用 Vercel 的全球 CDN
   - 配置缓存策略
   - 优化构建过程

## 🚀 快速部署命令

```bash
# 1. 克隆项目
git clone https://github.com/mariohuang233/electricityyierbubu.git
cd electricityyierbubu

# 2. 使用简化配置
cp vercel-simple.json vercel.json

# 3. 推送到 GitHub
git add .
git commit -m "使用简化 Vercel 配置"
git push origin main

# 4. 在 Vercel 控制台导入项目
# 5. 配置环境变量 REACT_APP_API_URL
```

## 📞 技术支持

如果遇到问题：

1. 查看 Vercel 构建日志
2. 检查环境变量配置
3. 验证后端服务状态
4. 在 GitHub 提交 Issue

---

**注意**：确保在生产环境中妥善保护敏感信息，如 API 密钥等。
