::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
::задаем основные переменные окружения
@CALL "%curpath%/set_path.bat"
@CLS
:: ===========================================================================
@echo start bower install %date% %time% > "%curpath%/log_install__bower.log"

@CD client/lib 
bower install >> "%curpath%/log_install__bower.log" 2>&1

@echo end bower install %date% %time% >> "%curpath%/log_install__bower.log" 
:: ===========================================================================
@PAUSE
