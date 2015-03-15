@SET db_file_path=%~dp0
@SET path_prefix=..\..\..
@SET dbfilename=app.FDB

@call "%path_prefix%\.bin\set_path.bat"
@cd %db_file_path%

@mkdir "%db_file_path%\%path_prefix%\temp\database"


@echo CREATE DATABASE '%db_file_path%\%dbfilename%' page_size 8192 user 'SYSDBA' password 'masterkey'; > "%db_file_path%\%path_prefix%\temp\database\0001_create.sql"
@isql -i "%db_file_path%\%path_prefix%\temp\database\0001_create.sql"

@echo CONNECT '%db_file_path%\%dbfilename%' user 'SYSDBA' password 'masterkey'; > "%db_file_path%\%path_prefix%\temp\database\0002_connect.sql"

@cd create_db_scripts
@mkdir "%db_file_path%\%path_prefix%\temp\database\create_db_scripts"
@for /r . %%g in (*.sql) do (
  @copy "%db_file_path%\%path_prefix%\temp\database\0002_connect.sql"+"%%g" "%db_file_path%\%path_prefix%\temp\database\create_db_scripts\%%~ng"
  @isql -i "%db_file_path%\%path_prefix%\temp\database\create_db_scripts\%%~ng"
)

@pause
