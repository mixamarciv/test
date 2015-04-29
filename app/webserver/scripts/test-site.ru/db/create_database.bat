
@ECHO задаем PATH для isql.exe
@CALL "..\..\..\..\..\.bin\set_path.bat"

@SET dbfilename=app.FDB

@SET db_file_path=%~dp0
@SET temp_path=%~dp0\temp_%RANDOM%
@SET log_file=%~dp0\create_database.log 

@ECHO %DATE% %TIME% begin create db "%db_file_path%\%dbfilename%" >> %log_file% 2>&1 

@MKDIR "%temp_path%" >> %log_file% 2>&1 
@MKDIR "%temp_path%\create_db_scripts" >> %log_file% 2>&1 

@ECHO создаем БД %dbfilename%
@ECHO CREATE DATABASE '%db_file_path%\%dbfilename%' page_size 8192 user 'SYSDBA' password 'masterkey'; > "%temp_path%\0001_create.sql"
@isql -i "%temp_path%\0001_create.sql" >> %log_file% 2>&1 

@ECHO CONNECT '%db_file_path%\%dbfilename%' user 'SYSDBA' password 'masterkey'; > "%temp_path%\0002_connect.sql"

@ECHO выполняем sql запросы из каталога create_db_scripts
@CD "%db_file_path%\create_db_scripts" >> %log_file% 2>&1 
@FOR /r . %%g in (*.sql) do @(
  @ECHO %%g  >> %log_file% 2>&1 
  @ECHO %%g  
  @COPY "%temp_path%\0002_connect.sql"+"%%g" "%temp_path%\create_db_scripts\%%~ng" >> %log_file% 2>&1 
  @isql -i "%temp_path%\create_db_scripts\%%~ng" >> %log_file% 2>&1 
)

@ECHO удаляем временный каталог
@RMDIR "%temp_path%" /S /Q >> %log_file% 2>&1 

@ECHO %DATE% %TIME%   end create db "%db_file_path%\%dbfilename%" >> %log_file% 2>&1 

@PAUSE
