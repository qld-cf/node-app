@echo off

echo prepare xne-framework
cd xne-framework
call npm link
cd ..
echo finish xne-framework

echo prepare xne-db
cd xne-db
call npm link
call npm link xne-framework
cd ..
echo finish xne-db


::依赖xne-framework xne-db
set num=0
For %%i in (xne-express) do (
    echo prepare %%i
    cd %%i
    call npm link xne-framework xne-db
    cd ..
    echo finish %%i
    set /a num+=1
)
echo finish %num% module
