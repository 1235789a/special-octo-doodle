@echo off
chcp 65001 > nul
echo ========================================
echo    社群体检报告 - Windows启动脚本
echo ========================================
echo.
echo 正在启动服务器...
echo.
python server.py
pause
