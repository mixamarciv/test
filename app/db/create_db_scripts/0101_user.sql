CREATE TABLE T_USER (
    ID CHAR(16) NOT NULL,
    IDC CHAR(36) NOT NULL,
    LOGIN VARCHAR(100) NOT NULL,
    PASS VARCHAR(100) NOT NULL,
    NAME VARCHAR(500),
    MAIL VARCHAR(500),
    VIZIT_COUNT INTEGER DEFAULT 0,
    PASS_LOGIN   VARCHAR(200),
    PASS_MAIL    VARCHAR(200),
    DATE_CREATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DATE_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SET TERM ^ ;

CREATE OR ALTER trigger t_user_bi0 for t_user
active before insert position 0
AS
begin
  if( new.id is null )then begin
        new.id = gen_uuid();
  end
  new.idc = UUID_TO_CHAR( new.id );
end^

CREATE OR ALTER trigger t_user_bu0 for t_user
active before update position 0
AS
begin
  new.date_update = current_timestamp;
end^

CREATE OR ALTER TRIGGER T_USER_BIU0 FOR T_USER
ACTIVE BEFORE INSERT OR UPDATE POSITION 0
AS
begin
  new.login = trim(new.login);
  new.mail  = trim(new.mail);
  new.pass_login = new.pass || new.login;
  new.pass_mail  = new.pass || new.mail;

end^

SET TERM ; ^

INSERT INTO T_USER (LOGIN, PASS, NAME) VALUES ( 'admin', '12345', 'administrator');

COMMIT WORK;
-----------------------------------------------------------------------
