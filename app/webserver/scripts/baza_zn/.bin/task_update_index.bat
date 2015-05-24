::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
::задаем основные переменные окружения
@CALL "%curpath%/set_path.bat"
@CLS
:: ===========================================================================


node --harmony app.js --app="app/webserver/start_ex.js"  --site_config_file="%site_path%/config_site.js" --start_ex_script="%site_path%/ex_scripts/task_update_index.js"


:: ===========================================================================
@PAUSE
