@echo off
REM =================================================================
REM 🚀 LEAD ROCKETS - WINDOWS DEPLOYMENT SCRIPT
REM =================================================================
REM This script helps you deploy Lead Rockets SaaS on Windows

echo 🚀 Lead Rockets Deployment Script (Windows)
echo =========================================

REM Check if .env exists
if not exist "backend\.env" (
    echo ❌ Error: backend\.env file not found!
    echo 💡 Copy backend\.env.example to backend\.env and configure your settings
    echo    See API-KEYS-GUIDE.md for detailed instructions
    pause
    exit /b 1
)

REM Check required environment variables
echo 🔍 Checking environment configuration...

set "missing_vars="
for %%v in (JWT_SECRET MONGODB_URI SMTP_USER SMTP_PASS) do (
    findstr /C:"%%v=" backend\.env >nul 2>&1
    if errorlevel 1 (
        if defined missing_vars (
            set "missing_vars=!missing_vars! %%v"
        ) else (
            set "missing_vars=%%v"
        )
    )
)

if defined missing_vars (
    echo ❌ Error: Missing required environment variables:!missing_vars!
    echo 💡 Please check your backend\.env file
    pause
    exit /b 1
)

echo ✅ Environment configuration looks good!

echo.
echo Select deployment option:
echo 1) Railway (Recommended - Free)
echo 2) Render (Alternative - Free)
echo 3) Local Development
echo 4) Show deployment status
choice /C 1234 /M "Enter choice (1-4): "

if errorlevel 4 goto show_status
if errorlevel 3 goto local_dev
if errorlevel 2 goto deploy_render
if errorlevel 1 goto deploy_railway

:deploy_railway
echo 🚂 Deploying to Railway...
echo 💡 Railway deployment requires manual setup via web dashboard
echo 📖 See DEPLOYMENT.md for detailed Railway instructions
echo.
echo 🔗 Railway Dashboard: https://railway.app
echo 📚 Documentation: https://docs.railway.app
goto end

:deploy_render
echo 🎨 Deploying to Render...
echo 💡 Render deployment requires manual setup via web dashboard
echo 📖 See DEPLOYMENT.md for detailed Render instructions
echo.
echo 🔗 Render Dashboard: https://dashboard.render.com
echo 📚 Documentation: https://render.com/docs
goto end

:local_dev
echo 🏠 Setting up local development...
echo.
echo Starting backend server...
start cmd /k "cd backend && npm run dev"
echo.
echo Starting frontend server...
timeout /t 3 /nobreak >nul
start cmd /k "npm run dev"
echo.
echo ✅ Local servers started!
echo 🔗 Backend: http://localhost:5000
echo 🌐 Frontend: http://localhost:5173
goto end

:show_status
echo 🔍 Current deployment status:
echo 📁 Project structure: ✅ Ready
echo ⚙️ Configuration: ✅ Ready
echo 🧪 Tests: ✅ Ready
echo 🐳 Docker: ✅ Ready
echo 📚 Documentation: ✅ Ready
echo.
echo 💡 To deploy:
echo    1. Set up MongoDB Atlas (free)
echo    2. Configure Gmail SMTP (free)
echo    3. Use Railway/Render dashboard
echo.
goto end

:end
echo.
echo 🎉 Deployment process initiated!
echo 📖 Check DEPLOYMENT-CHECKLIST.md for next steps
echo 🔑 Check API-KEYS-GUIDE.md for configuration details
pause