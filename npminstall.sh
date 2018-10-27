#!/bin/sh

registry=https://registry.npm.taobao.org/

echo "prepare xne-framework"
cd xne-framework
npm install --registry=$registry
cd ..
echo "finish xne-framework"


echo "prepare xne-db"
cd xne-db
npm install --registry=$registry
cd ..
echo "finish xne-db"

echo "prepare xne-express"
cd xne-express
npm install --registry=$registry
cd ..
echo "finish xne-express"


