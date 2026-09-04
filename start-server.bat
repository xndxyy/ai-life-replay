@echo off
echo ========================================
echo  AI Life Replay - 启动服务器和Tunnel
echo ========================================
echo.

cd /d C:\Users\Administrator\Desktop\ai-life-replay

echo [1/2] 启动 Next.js 服务器...
start "Next.js" wsl -e bash -ic "cd /mnt/c/Users/Administrator/Desktop/ai-life-replay && PORT=3000 HOSTNAME=0.0.0.0 NODE_ENV=production node .next/standalone/server.js 2>&1 | tee /tmp/nextjs.log"

timeout /t 3 /nobreak >nul

echo [2/2] 启动 Cloudflare Tunnel...
start "Cloudflare Tunnel" wsl -e bash -ic "cloudflared tunnel run ai-life-replay 2>&1 | tee /tmp/cloudflared.log"

echo.
echo 服务器已在后台启动！
echo 访问 https://ailovelife.online 查看
echo.
pause
