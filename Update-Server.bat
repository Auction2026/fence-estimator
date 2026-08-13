@echo off
echo ==========================================
echo    Fence Estimator - One-Click Update
echo ==========================================
echo.
echo 1. Downloading latest changes from GitHub...
git pull

echo.
echo 2. Updating backend dependencies...
cd backend
npm install

echo.
echo 3. Starting the server...
npm start
