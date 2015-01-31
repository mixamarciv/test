@SET db_file_path=%~dp0
@call "..\..\.bin\set_path.bat"
@cd %db_file_path%

@mkdir "%db_file_path%\..\..\temp\database"


@echo CREATE DATABASE '%db_file_path%\app.fdb' page_size 8192 user 'SYSDBA' password 'masterkey'; > "%db_file_path%\..\..\temp\database\0001_create.sql"
@isql -i "%db_file_path%\..\..\temp\database\0001_create.sql"

@echo CONNECT '%db_file_path%\app.fdb' user 'SYSDBA' password 'masterkey'; > "%db_file_path%\..\..\temp\database\0002_connect.sql"

::@SET dbopt=-d "%db_file_path%\app.fdb" -u SYSDBA -p masterkey
@cd create_db_scripts
@mkdir "%db_file_path%\..\..\temp\database\create_db_scripts"
@for /r . %%g in (*.sql) do (
  @copy "%db_file_path%\..\..\temp\database\0002_connect.sql"+"%%g" "%db_file_path%\..\..\temp\database\create_db_scripts\%%~ng"
  @isql -i "%db_file_path%\..\..\temp\database\create_db_scripts\%%~ng"
)

@pause
