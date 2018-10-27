#!/bin/sh


echo "prepare xne-framework"
cd xne-framework
npm link
cd ..
echo "finish xne-framework"

echo "prepare xne-db"
cd xne-db
npm link
npm link xne-framework
cd ..
echo "finish xne-db"

echo "prepare xne-express"
cd xne-express
npm link xne-framework xne-db
cd ..
echo "finish xne-express"



