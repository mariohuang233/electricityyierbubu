#!/bin/bash

# 家庭用电监控系统 - 前后端同时部署脚本
# 支持 Railway、Zeabur 和 Docker 全栈部署

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 打印标题
print_title() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# 检查依赖
check_dependencies() {
    print_title "检查系统依赖"
    
    local missing_deps=()
    
    if ! command -v node &> /dev/null; then
        missing_deps+=("Node.js")
    fi
    
    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_message $RED "错误: 缺少以下依赖:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        exit 1
    fi
    
    print_message $GREEN "✅ 系统依赖检查通过"
}

# 检查环境变量
check_environment() {
    print_title "检查环境配置"
    
    if [ ! -f .env ]; then
        print_message $YELLOW "⚠️  未找到 .env 文件，从示例文件创建..."
        cp env.example .env
        print_message $YELLOW "📝 请编辑 .env 文件配置环境变量"
        print_message $BLUE "💡 特别是 MONGO_URI 需要设置为您的 MongoDB 连接字符串"
        return 1
    fi
    
    source .env
    
    if [ -z "$MONGO_URI" ] || [ "$MONGO_URI" = "mongodb+srv://username:password@cluster.mongodb.net/database" ]; then
        print_message $RED "❌ 请设置正确的 MONGO_URI 环境变量"
        return 1
    fi
    
    print_message $GREEN "✅ 环境配置检查通过"
}

# 安装所有依赖
install_all_dependencies() {
    print_title "安装项目依赖"
    
    # 后端依赖
    print_message $BLUE "📦 安装后端依赖..."
    cd backend
    npm ci --only=production
    cd ..
    
    # 前端依赖
    print_message $BLUE "📦 安装前端依赖..."
    cd frontend
    npm ci
    cd ..
    
    print_message $GREEN "✅ 依赖安装完成"
}

# 构建项目
build_project() {
    print_title "构建项目"
    
    # 构建前端
    print_message $BLUE "🔨 构建前端应用..."
    cd frontend
    npm run build
    cd ..
    
    print_message $GREEN "✅ 项目构建完成"
}

# Docker 全栈部署
deploy_docker() {
    print_title "Docker 全栈部署"
    
    # 检查 Docker
    if ! command -v docker &> /dev/null; then
        print_message $RED "❌ 错误: 未安装 Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_message $RED "❌ 错误: 未安装 Docker Compose"
        exit 1
    fi
    
    # 停止现有容器
    print_message $YELLOW "🛑 停止现有容器..."
    docker-compose down || true
    
    # 构建和启动
    print_message $YELLOW "🚀 构建和启动全栈服务..."
    docker-compose up -d --build
    
    # 等待服务启动
    print_message $BLUE "⏳ 等待服务启动..."
    sleep 10
    
    # 检查服务状态
    print_message $BLUE "🔍 检查服务状态..."
    docker-compose ps
    
    print_message $GREEN "✅ Docker 全栈部署完成"
    print_message $YELLOW "🌐 访问地址: http://localhost"
    print_message $YELLOW "🔧 后端 API: http://localhost:3001"
    print_message $YELLOW "📊 健康检查: http://localhost:3001/api/health"
}

# Railway 全栈部署准备
prepare_railway() {
    print_title "Railway 全栈部署准备"
    
    # 检查 Railway CLI
    if ! command -v railway &> /dev/null; then
        print_message $YELLOW "📦 安装 Railway CLI..."
        npm install -g @railway/cli
    fi
    
    # 创建 Railway 项目配置
    print_message $BLUE "📝 创建 Railway 项目配置..."
    
    # 检查是否已登录
    if ! railway whoami &> /dev/null; then
        print_message $YELLOW "🔐 请先登录 Railway:"
        print_message $BLUE "   railway login"
        return 1
    fi
    
    print_message $GREEN "✅ Railway 部署准备完成"
    print_message $YELLOW "🚀 运行以下命令开始部署:"
    print_message $BLUE "   railway up"
    print_message $BLUE "   railway domain"
}

# Zeabur 全栈部署准备
prepare_zeabur() {
    print_title "Zeabur 全栈部署准备"
    
    print_message $GREEN "✅ Zeabur 部署准备完成"
    print_message $YELLOW "🌐 访问 Zeabur 控制台:"
    print_message $BLUE "   https://zeabur.com"
    print_message $YELLOW "📝 部署步骤:"
    print_message $BLUE "   1. 点击 'New Project'"
    print_message $BLUE "   2. 选择 'Import from GitHub'"
    print_message $BLUE "   3. 选择仓库: mariohuang233/electricityyierbubu"
    print_message $BLUE "   4. 系统会自动创建 backend 和 frontend 服务"
    print_message $BLUE "   5. 配置环境变量"
}

# 验证部署
verify_deployment() {
    print_title "验证部署状态"
    
    # 检查后端健康状态
    print_message $BLUE "🔍 检查后端服务..."
    if curl -f http://localhost:3001/api/health &> /dev/null; then
        print_message $GREEN "✅ 后端服务正常运行"
    else
        print_message $RED "❌ 后端服务异常"
    fi
    
    # 检查前端服务
    print_message $BLUE "🔍 检查前端服务..."
    if curl -f http://localhost &> /dev/null; then
        print_message $GREEN "✅ 前端服务正常运行"
    else
        print_message $RED "❌ 前端服务异常"
    fi
    
    print_message $YELLOW "📊 查看详细日志:"
    print_message $BLUE "   docker-compose logs -f"
}

# 显示部署信息
show_deployment_info() {
    print_title "部署信息"
    
    print_message $GREEN "🎉 全栈部署完成！"
    echo ""
    print_message $YELLOW "📱 前端应用:"
    print_message $BLUE "   URL: http://localhost"
    print_message $BLUE "   功能: 用电监控、趋势分析、数据可视化"
    echo ""
    print_message $YELLOW "🔧 后端 API:"
    print_message $BLUE "   URL: http://localhost:3001"
    print_message $BLUE "   健康检查: http://localhost:3001/api/health"
    print_message $BLUE "   API 文档: http://localhost:3001/api"
    echo ""
    print_message $YELLOW "📊 管理命令:"
    print_message $BLUE "   查看日志: docker-compose logs -f"
    print_message $BLUE "   停止服务: docker-compose down"
    print_message $BLUE "   重启服务: docker-compose restart"
    print_message $BLUE "   查看状态: docker-compose ps"
}

# 显示帮助信息
show_help() {
    echo "家庭用电监控系统 - 全栈一键部署脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  docker      Docker 全栈部署 (推荐)"
    echo "  railway     Railway 全栈部署准备"
    echo "  zeabur      Zeabur 全栈部署准备"
    echo "  build       仅构建项目"
    echo "  install     仅安装依赖"
    echo "  verify      验证部署状态"
    echo "  help        显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 docker    # Docker 全栈部署"
    echo "  $0 railway   # Railway 全栈部署准备"
    echo "  $0 zeabur    # Zeabur 全栈部署准备"
    echo ""
    echo "环境要求:"
    echo "  - Node.js >= 20.0.0"
    echo "  - Docker & Docker Compose (Docker 部署)"
    echo "  - MongoDB 数据库"
}

# 主函数
main() {
    case "${1:-help}" in
        docker)
            check_dependencies
            check_environment
            install_all_dependencies
            build_project
            deploy_docker
            verify_deployment
            show_deployment_info
            ;;
        railway)
            check_dependencies
            prepare_railway
            ;;
        zeabur)
            check_dependencies
            prepare_zeabur
            ;;
        build)
            check_dependencies
            install_all_dependencies
            build_project
            ;;
        install)
            check_dependencies
            install_all_dependencies
            ;;
        verify)
            verify_deployment
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_message $RED "❌ 未知选项: $1"
            show_help
            exit 1
            ;;
    esac
}

# 运行主函数
main "$@"
