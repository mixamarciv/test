::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
::задаем основные переменные окружения
@CALL "%curpath%/set_path.bat"
@CLS
:: ===========================================================================

::SET options=%options% --skip_app1=#result_data:{'fcomp':20,'fmonth':'09','fyear':'2014','dba_path':'h:/kv_pay.20/dba_0914'}
::SET options=%options% --skip_flx_to_txt=c:\temp\_flxconv\20\2014.09\20141005\153241\


node.exe --harmony app.js --fcomp=22 --fyear=2014 --fmonth=09 %3 %4 %5 %6 %7 %8 %9 %options% 


:: ===========================================================================
::@PAUSE
