::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
::задаем основные переменные окружения
@CALL "%curpath%/set_path.bat"
@CLS
:: ===========================================================================


git config http.postBuffer 524288000
git config --global user.name "mixa marciv"
git config --global user.email "mixamarciv@gmail.com"

git remote rm origin
git remote add origin http://localgitlab:81/mixa/test.git

git commit -m "%date% %time%"


:: ===========================================================================
@cmd
