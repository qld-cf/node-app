 > * 服务说明
```
    初始化过程
    进入指定目录，swagger project create xne-express 选择express
    npm i
```

 > * api文档
```
    客户端查询  [http://localhost:3000/docs]
```
    Swagger相关
#   swagger提供一种api应用方案
#   命令行：swagger project edit
#   api控制器新增或修改接口内容，需要对应调整  ./api/swagger/swagger.yaml

    引用通用库和数据库
#   npm link xne-framework
#   npm link xne-db
#   底层库如framework更新后，db和express目录需要重新link
