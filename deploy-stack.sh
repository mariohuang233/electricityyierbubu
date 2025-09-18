#!/bin/bash

# 家庭用电监控系统 - 全栈一键部署脚本
# 支持 Docker、Railway、Zeabur 全栈部署

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# 打印函数
print() {
    echo -e "${1}${2}${NC}"
}

print_title() {
    echo ""
    print $PURPLE "=========================================="
    print $PURPLE "  $1"
    print $PURPLE "=========================================="
    echo ""
}

print_step() {
    print $BLUE "🔧 $1"
}

print_success() {
    print $GREEN "✅ $1"
}

print_warning() {
    print $YELLOW "⚠️  $1"
}

print_error() {
    print $RED "❌ $1"
}

print_info() {
    print $CYAN "💡 $1"
}

# 检查环境
check_environment() {
    print_title "环境检查"
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        print_error "未安装 Node.js"
        exit 1
    fi
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        print_error "未安装 npm"
        exit 1
    fi
    
    # 检查环境变量文件
    if [ ! -f .env ]; then
        print_warning "未找到 .env 文件，从示例文件创建..."
        cp env.example .env
        print_info "请编辑 .env 文件配置环境变量"
        print_info "特别是 MONGO_URI 需要设置为您的 MongoDB 连接字符串"
        return 1
    fi
    
    print_success "环境检查通过"
}

# Docker 全栈部署
deploy_docker() {
    print_title "Docker 全栈部署"
    
    # 检查 Docker
    if ! command -v docker &> /dev/null; then
        print_error "未安装 Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "未安装 Docker Compose"
        exit 1
    fi
    
    print_step "停止现有容器..."
    docker-compose down || true
    
    print_step "构建和启动全栈服务..."
    docker-compose up -d --build
    
    print_step "等待服务启动..."
    sleep 15
    
    print_step "检查服务状态..."
    docker-compose ps
    
    print_success "Docker 全栈部署完成"
    print_info "前端访问: http://localhost"
    print_info "后端 API: http://localhost:3001"
    print_info "健康检查: http://localhost:3001/api/health"
}

# Railway 部署
deploy_railway() {
    print_title "Railway 全栈部署"
    
    # 检查 Railway CLI
    if ! command -v railway &> /dev/null; then
        print_step "安装 Railway CLI..."
        npm install -g @railway/cli
    fi
    
    # 检查登录状态
    if ! railway whoami &> /dev/null; then
        print_warning "请先登录 Railway:"
        print_info "railway login"
        return 1
    fi
    
    print_warning "Railway 主要支持单服务部署"
    print_info "建议使用后端服务部署方案"
    print_step "使用简化配置部署后端..."
    
    # 使用简化配置
    if [ -f railway-simple.json ]; then
        cp railway-simple.json railway.json
        print_info "已切换到简化 Railway 配置"
    fi
    
    if [ -f nixpacks-simple.toml ]; then
        cp nixpacks-simple.toml nixpacks.toml
        print_info "已切换到简化 Nixpacks 配置"
    fi
    
    print_step "部署到 Railway..."
    railway up
    
    print_success "Railway 后端部署完成"
    print_info "获取域名: railway domain"
    print_warning "前端需要单独部署到其他平台"
    print_info "查看详细说明: RAILWAY_DEPLOY.md"
}

# Zeabur 部署
deploy_zeabur() {
    print_title "Zeabur 全栈部署"
    
    print_info "访问 Zeabur 控制台: https://zeabur.com"
    print_info "部署步骤:"
    print_info "1. 点击 'New Project'"
    print_info "2. 选择 'Import from GitHub'"
    print_info "3. 选择仓库: mariohuang233/electricityyierbubu"
    print_info "4. 系统会自动创建 backend 和 frontend 服务"
    print_info "5. 配置环境变量"
    
    print_success "Zeabur 部署准备完成"
}

# 验证部署
verify_deployment() {
    print_title "验证部署状态"
    
    # 检查后端
    if curl -f http://localhost:3001/api/health &> /dev/null; then
        print_success "后端服务正常运行"
    else
        print_error "后端服务异常"
    fi
    
    # 检查前端
    if curl -f http://localhost &> /dev/null; then
        print_success "前端服务正常运行"
    else
        print_error "前端服务异常"
    fi
}

# 显示部署信息
show_info() {
    print_title "部署信息"
    
    print_success "🎉 全栈部署完成！"
    echo ""
    print_info "📱 前端应用: http://localhost"
    print_info "🔧 后端 API: http://localhost:3001"
    print_info "📊 健康检查: http://localhost:3001/api/health"
    echo ""
    print_info "📋 管理命令:"
    print_info "  查看日志: docker-compose logs -f"
    print_info "  停止服务: docker-compose down"
    print_info "  重启服务: docker-compose restart"
    print_info "  查看状态: docker-compose ps"
}

# 显示帮助
show_help() {
    echo "家庭用电监控系统 - 全栈一键部署"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  docker      Docker 全栈部署 (推荐)"
    echo "  railway     Railway 全栈部署"
    echo "  zeabur      Zeabur 全栈部署"
    echo "  verify      验证部署状态"
    echo "  help        显示帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 docker    # Docker 全栈部署"
    echo "  $0 railway   # Railway 全栈部署"
    echo "  $0 zeabur    # Zeabur 全栈部署"
}

# 主函数
main() {
    case "${1:-help}" in
        docker)
            check_environment
            deploy_docker
            verify_deployment
            show_info
            ;;
        railway)
            check_environment
            deploy_railway
            ;;
        zeabur)
            check_environment
            deploy_zeabur
            ;;
        verify)
            verify_deployment
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
}

# 运行主函数
main "$@"
