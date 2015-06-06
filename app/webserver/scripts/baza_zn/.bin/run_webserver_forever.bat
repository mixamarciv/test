::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
@echo "%curpath%set_path.bat"
::задаем основные переменные окружения
@CALL "%curpath%set_path.bat"

@echo ===========================================================================



node start_app.js node --harmony app.js --app=app/webserver/start.js --site_config_file="%site_path%/config_site.js"


@echo ===========================================================================
@PAUSE
