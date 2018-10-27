@echo off

echo prepare start..
call pm2 start pm2.config.js --env development && pm2 log
echo finish


