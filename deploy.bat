@echo off
echo 🚀 Preparing Quote System for Deployment...
echo.

echo 📁 Checking if git is initialized...
if not exist ".git" (
    echo 🔧 Initializing git repository...
    git init
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

echo.
echo 📝 Adding all files to git...
git add .

echo.
echo 💾 Committing changes...
git commit -m "Ready for deployment - Quote System with updated notifications"

echo.
echo 📋 Current git status:
git status

echo.
echo 🌐 Next steps:
echo 1. Create a GitHub repository at https://github.com/new
echo 2. Copy your repository URL
echo 3. Run: git remote add origin YOUR_REPOSITORY_URL
echo 4. Run: git push -u origin main
echo 5. Go to https://vercel.com and deploy your repository
echo.
echo 📖 See DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause
