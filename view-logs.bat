@echo off
echo ========================================
echo  AI Life Replay - 查看日志
echo ========================================
echo.
echo  [1] Next.js 服务器日志
echo  [2] Cloudflare Tunnel 日志
echo  [3] 查看进程状态
echo  [4] 实时监控日志
echo.

set /p choice="请选择 (1/2/3/4): "

if "%choice%"=="1" (
    wsl bash -ic "journalctl -u cloudflared-tunnel --no-pager -n 50 2>/dev/null || (ps aux | grep next-server | grep -v grep && echo '---' && echo 'Next.js 日志未保存到文件，使用 wsl ps 查看进程状态')"
) else if "%choice%"=="2" (
    wsl bash -ic "journalctl -u cloudflared-tunnel --no-pager -n 50 2>/dev/null || (ps aux | grep cloudflared | grep -v grep && echo '---' && echo 'Cloudflared 正在运行')"
) else if "%choice%"=="3" (
    wsl bash -ic "ps aux | grep -E 'next|cloudflared' | grep -v grep"
) else if "%choice%"=="4" (
    wsl bash -ic "tail -f /var/log/syslog 2>/dev/null | grep -E 'cloudflared|next' || echo '实时日志需要先配置'; sleep 3"
) else (
    echo 无效选择
)

echo.
pause
