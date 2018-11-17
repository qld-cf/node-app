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
```
    基于swagger - API文档框架，一款REST APIs文档生成工具
    [swagger](https://swagger.io/)
    [intro](https://www.jianshu.com/p/8ddd692af91f)
    express  node.js框架
    [express](https://expressjs.com/)
    mongoose 一款m对ongodb进行便捷操作的对象模型工具
    [mongo](http://www.cnblogs.com/zhongweiv/p/mongoose.html)
    redis 一个把结构化的数据放在内存中的一个存储系统，你可以把它作为数据库，缓存和消息中间件来使用
    [redis](https://redis.io/)
    winston node.js日志库
    [winston](https://www.jianshu.com/p/e71f727c7b32)

```
 > * 数据库
```
    mongodb、mysql、redis
    mongo初始表：article
    mysql: 待添加
    redis: 待添加

```
