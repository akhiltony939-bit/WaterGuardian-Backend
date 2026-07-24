@echo off


title WaterGuardian-X Launcher


echo ==================================
echo      WaterGuardian-X System
echo ==================================

echo.


echo Starting Backend Server...


cd backend


start cmd /k "npm start"



timeout /t 5



echo Opening Website...


start "" "..\frontend\index.html"



echo.

echo WaterGuardian-X Started Successfully!


pause