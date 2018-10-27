#!/bin/sh
#   开发环境：pm2 start pm2.config.js --env development && pm2 log
#   生产环境：pm2 start pm2.config.js --env production && pm2 log
echo "watch xne-express"
pm2 start pm2.config.js --env development && pm2 log
