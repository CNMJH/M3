@echo off
chcp 65001 >nul
echo ========================================
echo   M3 游戏 - 清理旧进程
echo ========================================
echo.

echo 正在查找占用 3001 端口的进程...
echo.

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING') do (
    echo 发现进程 PID: %%a
    taskkill /F /PID %%a
)

echo.
echo 正在清理所有 Node.js 进程...
taskkill /F /IM node.exe 2>nul

echo.
echo ✅ 清理完成！
echo.
echo 现在可以重新运行 start.bat 启动服务器
echo.
pause
