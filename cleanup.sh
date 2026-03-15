#!/bin/bash

# M3 游戏 - 清理旧进程 (Linux/Mac)

echo "========================================"
echo "  M3 游戏 - 清理旧进程"
echo "========================================"
echo ""

echo "正在查找占用 3001 端口的进程..."
echo ""

PID=$(lsof -ti:3001)

if [ -n "$PID" ]; then
    echo "发现进程 PID: $PID"
    kill -9 $PID
    echo "已杀死进程"
else
    echo "未发现占用 3001 端口的进程"
fi

echo ""
echo "正在清理所有 Node.js 进程..."
pkill -f "node" 2>/dev/null

echo ""
echo "✅ 清理完成！"
echo ""
echo "现在可以重新运行 ./start.sh 启动服务器"
echo ""
