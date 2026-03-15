#!/bin/bash

# M3 游戏 - 启动脚本 (Linux/Mac)

echo "========================================"
echo "  M3 游戏 - 启动脚本"
echo "========================================"
echo ""

echo "[1/4] 清理旧进程..."
PID=$(lsof -ti:3001 2>/dev/null)
if [ -n "$PID" ]; then
    kill -9 $PID 2>/dev/null
    echo "   已清理旧进程 (PID: $PID)"
else
    echo "   无需清理"
fi
sleep 1
echo ""

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未检测到 Node.js"
    echo ""
    echo "请先安装 Node.js: https://nodejs.org/"
    echo "建议版本：18.x 或更高"
    exit 1
fi

echo "[2/4] ✅ Node.js 已安装"
node -v
echo ""

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "[3/4] 📦 首次运行，正在安装依赖..."
    echo "   这可能需要 1-3 分钟，请耐心等待"
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo ""
    echo "✅ 依赖安装完成"
    echo ""
else
    echo "[3/4] ✅ 依赖已安装"
    echo ""
    # 检查是否需要更新依赖
    echo " 检查依赖更新..."
    npm install
    echo ""
fi

echo "[4/4] 启动开发服务器..."
echo "========================================"
echo ""
echo "🌐 浏览器访问：http://localhost:3001"
echo ""
echo "💡 提示:"
echo "   - 按 Ctrl+C 停止服务器"
echo "   - 修改代码后自动热更新"
echo ""
echo "========================================"
echo ""

# 启动开发服务器
npm run dev
