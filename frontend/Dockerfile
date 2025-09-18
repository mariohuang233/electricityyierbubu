# 多阶段构建
# 第一阶段：构建应用
FROM node:20-alpine as builder

WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci && npm cache clean --force

# 复制源代码
COPY src/ ./src/
COPY public/ ./public/

# 构建应用
RUN npm run build

# 第二阶段：运行应用
FROM nginx:alpine

# 复制构建产物到nginx目录
COPY --from=builder /app/build /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]