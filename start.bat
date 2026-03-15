@echo off
chcp 65001 >nul
echo ========================================
echo   M3 游戏 - 启动脚本
echo ========================================
echo.

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误：未检测到 Node.js
    echo.
    echo 请先安装 Node.js: https://nodejs.org/
    echo 建议版本：18.x 或更高
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
node -v
echo.

REM 检查 node_modules 是否存在
if not exist "node_modules\" (
    echo 📦 首次运行，正在安装依赖...
    echo    这可能需要 1-3 分钟，请耐心等待
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo.
    echo ✅ 依赖安装完成
    echo.
) else (
    echo ✅ 依赖已安装
    echo.
    REM 检查是否需要更新依赖
    echo  检查依赖更新...
    call npm install
    echo.
)

echo ========================================
echo   启动开发服务器
echo ========================================
echo.
echo 🌐 浏览器访问：http://localhost:3001
echo.
echo 💡 提示:
echo    - 按 Ctrl+C 停止服务器
echo    - 修改代码后自动热更新
echo.
echo ========================================
echo.

REM 启动开发服务器
call npm run dev

pause
