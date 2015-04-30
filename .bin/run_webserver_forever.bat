::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
::задаем основные переменные окружения
@CALL "%curpath%/set_path.bat"
@CLS
:: ===========================================================================

::SET options=%options% --skip_app1=#result_data:{'fcomp':20,'fmonth':'09','fyear':'2014','dba_path':'h:/kv_pay.20/dba_0914'}
::SET options=%options% --skip_flx_to_txt=c:\temp\_flxconv\20\2014.09\20141005\153241\


::cd node_modules/pm2/bin

node.exe start_app.js node.exe --harmony app.js --app=app/webserver/start.js --site_config_file=./scripts/test-site.ru/config_site.js
::node.exe --harmony app.js --app=webserver 
::node.exe app.js

:: ===========================================================================
@PAUSE
