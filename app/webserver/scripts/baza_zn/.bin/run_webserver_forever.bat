::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
::задаем основные переменные окружения
@CALL "%curpath%/set_path.bat"
@CLS
:: ===========================================================================



node start_app.js node --harmony app.js --app=app/webserver/start.js --site_config_file="%site_config_path%"


:: ===========================================================================
@PAUSE
