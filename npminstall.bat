@echo off
set registry=https://registry.npm.taobao.org/
set num=0
For %%i in (xne-db xne-express xne-framework) do (
    echo prepare %%i
    cd %%i
    echo npm install --registry=%registry%
    call npm install --registry=%registry%
    cd ..
    echo finish %%i
    set /a num+=1
)
echo finish %num% module