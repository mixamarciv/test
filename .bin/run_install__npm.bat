::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
::задаем основные переменные окружения
@CALL "%curpath%/set_path.bat"
@CLS
:: ===========================================================================
@echo start npm install %date% %time% > "%curpath%/log_install__npm.log"

npm install >> "%curpath%/log_install__npm.log" 2>&1

@echo end npm install %date% %time% >> "%curpath%/log_install__npm.log"
:: ===========================================================================
@PAUSE
