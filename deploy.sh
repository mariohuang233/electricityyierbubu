#!/bin/bash

# 家庭用电监控系统部署脚本
# 支持 Railway、Zeabur 和 Docker 部署

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 检查依赖
check_dependencies() {
    print_message $BLUE "检查依赖..."
    
    if ! command -v node &> /dev/null; then
        print_message $RED "错误: 未安装 Node.js"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_message $RED "错误: 未安装 npm"
        exit 1
    fi
    
    print_message $GREEN "依赖检查通过"
}

# 安装依赖
install_dependencies() {
    print_message $BLUE "安装依赖..."
    
    # 后端依赖
    print_message $YELLOW "安装后端依赖..."
    cd backend
    npm ci --only=production
    cd ..
    
    # 前端依赖
    print_message $YELLOW "安装前端依赖..."
    cd frontend
    npm ci
    cd ..
    
    print_message $GREEN "依赖安装完成"
}

# 构建项目
build_project() {
    print_message $BLUE "构建项目..."
    
    # 构建前端
    print_message $YELLOW "构建前端..."
    cd frontend
    npm run build
    cd ..
    
    print_message $GREEN "项目构建完成"
}

# 检查环境变量
check_env() {
    print_message $BLUE "检查环境变量..."
    
    if [ ! -f .env ]; then
        print_message $YELLOW "未找到 .env 文件，从示例文件创建..."
        cp env.example .env
        print_message $YELLOW "请编辑 .env 文件配置环境变量"
    fi
    
    # 检查必要的环境变量
    source .env
    
    if [ -z "$MONGO_URI" ]; then
        print_message $RED "错误: 未设置 MONGO_URI 环境变量"
        exit 1
    fi
    
    print_message $GREEN "环境变量检查通过"
}

# Docker 部署
deploy_docker() {
    print_message $BLUE "使用 Docker 部署..."
    
    # 检查 Docker
    if ! command -v docker &> /dev/null; then
        print_message $RED "错误: 未安装 Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_message $RED "错误: 未安装 Docker Compose"
        exit 1
    fi
    
    # 停止现有容器
    print_message $YELLOW "停止现有容器..."
    docker-compose down || true
    
    # 构建和启动
    print_message $YELLOW "构建和启动容器..."
    docker-compose up -d --build
    
    print_message $GREEN "Docker 部署完成"
    print_message $YELLOW "访问地址: http://localhost"
}

# Railway 部署准备
prepare_railway() {
    print_message $BLUE "准备 Railway 部署..."
    
    # 检查 Railway CLI
    if ! command -v railway &> /dev/null; then
        print_message $YELLOW "安装 Railway CLI..."
        npm install -g @railway/cli
    fi
    
    print_message $GREEN "Railway 部署准备完成"
    print_message $YELLOW "请运行: railway login && railway up"
}

# Zeabur 部署准备
prepare_zeabur() {
    print_message $BLUE "准备 Zeabur 部署..."
    
    print_message $GREEN "Zeabur 部署准备完成"
    print_message $YELLOW "请在 Zeabur 控制台导入 GitHub 仓库"
}

# 显示帮助信息
show_help() {
    echo "家庭用电监控系统部署脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  docker     使用 Docker 部署"
    echo "  railway    准备 Railway 部署"
    echo "  zeabur     准备 Zeabur 部署"
    echo "  build      仅构建项目"
    echo "  install    仅安装依赖"
    echo "  help       显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 docker    # Docker 部署"
    echo "  $0 railway   # 准备 Railway 部署"
    echo "  $0 zeabur    # 准备 Zeabur 部署"
}

# 主函数
main() {
    case "${1:-help}" in
        docker)
            check_dependencies
            check_env
            deploy_docker
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
            install_dependencies
            build_project
            ;;
        install)
            check_dependencies
            install_dependencies
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_message $RED "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
}

# 运行主函数
main "$@"
