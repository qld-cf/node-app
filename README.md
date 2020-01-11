#### express版本的应用模板

---
- 包含mongoDB(mongoose)、Mysql(sequelize)、Redis、日志系统、PM2、本地framework模块封装、Swagger等模块，提供学习开发参考，助你快速构建rest api；（感觉这版有点旧了）

 > 所需环境
1.  node >= 8
2. npm、mysql、mongodb、redis本地安装
```
    // 一键安装项目依赖：
    $ ./npminstall.sh
    $ ./npmlink.sh
    //如果sh无法运行，需要更新权限
    $ sudo chmod 777 ./xx.sh
    // 全局安装pm2
    $ npm i pm2 -g
    // 启动服务
    $ cd xne-express && pm2 start app.js --name xne-express --watch && pm2 log
    // swagger自动生成api文档
    $ http://127.0.0.1:3000/api-docs/
    // 测试
    // mongo
    $ curl http://localhost:3000/api/v1/express/articles/1
    // mysql
    $ curl http://localhost:3000/api/v1/express/projects/1

```

---

[koa2应用模板](https://github.com/qld-cf/koa2-app)

---
[React应用模板](https://github.com/qld-cf/react-ts-template)






