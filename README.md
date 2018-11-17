 > * 环境安装
```
    node >= 8
    mongodb
    npm
    脚手架内需要install和link,已写入bat和sh
    windows：运行bat文件,先运行install文件后link
    linux或macos： 运行sh（如果sh无法运行，需要更新权限chmod 777 ./xx.sh）
```

 > * 运行
```
    全局安装pm2 : npm i pm2 -g
    进入xne-express 运行start.bat或start.sh（可调整开发，生产环境和端口）
    或者直接运行命令查看日志：
    cd xne-express &&pm2 start app.js --name xne-express --watch && pm2 log 

```

 > * 脚手架介绍
   
   [swagger](https://swagger.io/)
   [intro](https://www.jianshu.com/p/8ddd692af91f)
   [express](https://expressjs.com/)
 
   [mongo](http://www.cnblogs.com/zhongweiv/p/mongoose.html)
   [redis](https://redis.io/)
   [winston](https://www.jianshu.com/p/e71f727c7b32)

 > * 数据库
```
    mongodb、mysql、redis
    mongo初始表：article
    mysql: 待添加
    redis: 待添加

```
