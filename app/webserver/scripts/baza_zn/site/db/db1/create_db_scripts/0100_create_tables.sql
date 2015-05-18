
SET SQL DIALECT 3;

SET NAMES NONE;




/******************************************************************************/
/***                                 Tables                                 ***/
/******************************************************************************/



CREATE TABLE T_GROUP (
    ID              CHAR(16) NOT NULL,
    IDC             CHAR(36),
    NAME            VARCHAR(500),
    NOTE            VARCHAR(5000),
    DATE_CREATE     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DATE_UPDATE     TIMESTAMP DEFAULT             CURRENT_TIMESTAMP,
    ID_USER_CREATE  CHAR(16) NOT NULL,
    ID_USER_UPDATE    CHAR(16) NOT NULL
);


CREATE TABLE T_SCRIPT (
    ID              CHAR(16) NOT NULL,
    IDC             CHAR(36),
    PATH            VARCHAR(500) NOT NULL,
    NAME            VARCHAR(500),
    NOTE            VARCHAR(5000),
    DATE_CREATE     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DATE_UPDATE     TIMESTAMP DEFAULT             CURRENT_TIMESTAMP,
    ID_USER_CREATE  CHAR(16) NOT NULL,
    ID_USER_UPDATE    CHAR(16) NOT NULL
);


CREATE TABLE T_SCRIPT_GROUP (
    ID              CHAR(16),
    IDC             CHAR(36),
    ID_SCRIPT       CHAR(16),
    ID_GROUP        CHAR(16),
    IDC_SCRIPT      CHAR(36),
    IDC_GROUP       CHAR(36),
    DATE_CREATE     TIMESTAMP DEFAULT CURRENT_TIMESTAmP,
    DATE_UPDATE     TIMESTAMP DEFAULT CURRENT_TIMESTAmP,
    ID_USER_CREATE  CHAR(16) NOT NULL,
    ID_USER_UPDATE    CHAR(16) NOT NULL
);


CREATE TABLE T_USER (
    ID              CHAR(16) NOT NULL,
    IDC             CHAR(36) NOT NULL,
    LOGIN           VARCHAR(100) NOT NULL,
    PASS            VARCHAR(100) NOT NULL,
    NAME            VARCHAR(500),
    MAIL            VARCHAR(100),
    PASS_LOGIN      VARCHAR(200),
    PASS_MAIL       VARCHAR(200),
    VIZIT_COUNT     INTEGER DEFAULT 0,
    DATE_CREATE     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DATE_UPDATE     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ID_USER_CREATE  CHAR(16) NOT NULL,
    ID_USER_UPDATE    CHAR(16) NOT NULL
);


CREATE TABLE T_USER_GROUP (
    ID              CHAR(16),
    IDC             CHAR(36),
    ID_USER         CHAR(16),
    ID_GROUP        CHAR(16),
    IDC_USER        CHAR(36),
    IDC_GROUP       CHAR(36),
    DATE_CREATE     TIMESTAMP DEFAULT CURRENT_TIMESTAmP,
    DATE_UPDATE     TIMESTAMP DEFAULT CURRENT_TIMESTAmP,
    ID_USER_CREATE  CHAR(16) NOT NULL,
    ID_USER_UPDATE    CHAR(16) NOT NULL
);




/******************************************************************************/
/***                                Indices                                 ***/
/******************************************************************************/

CREATE UNIQUE INDEX T_GROUP_IDX1 ON T_GROUP (ID);
CREATE UNIQUE INDEX T_GROUP_IDX2 ON T_GROUP (IDC);
CREATE INDEX T_GROUP_IDX3 ON T_GROUP (NAME);
CREATE INDEX T_GROUP_IDX4 ON T_GROUP (DATE_CREATE);
CREATE INDEX T_GROUP_IDX5 ON T_GROUP (DATE_UPDATE);
CREATE UNIQUE INDEX IDX_T_SCRIPT_1 ON T_SCRIPT (ID);
CREATE UNIQUE INDEX IDX_T_SCRIPT_2 ON T_SCRIPT (IDC);
CREATE INDEX IDX_T_SCRIPT_3 ON T_SCRIPT (NAME);
CREATE INDEX IDX_T_SCRIPT_4 ON T_SCRIPT (DATE_CREATE);
CREATE INDEX IDX_T_SCRIPT_5 ON T_SCRIPT (DATE_UPDATE);
CREATE INDEX T_SCRIPT_IDX1 ON T_SCRIPT (PATH);
CREATE UNIQUE INDEX IDX_T_SCRIPT_GROUP_1 ON T_SCRIPT_GROUP (ID);
CREATE INDEX IDX_T_SCRIPT_GROUP_2 ON T_SCRIPT_GROUP (ID_SCRIPT);
CREATE INDEX IDX_T_SCRIPT_GROUP_3 ON T_SCRIPT_GROUP (ID_GROUP);
CREATE INDEX IDX_T_SCRIPT_GROUP_4 ON T_SCRIPT_GROUP (IDC_SCRIPT);
CREATE INDEX IDX_T_SCRIPT_GROUP_5 ON T_SCRIPT_GROUP (IDC_GROUP);
CREATE INDEX IDX_T_SCRIPT_GROUP_6 ON T_SCRIPT_GROUP (DATE_CREATE);
CREATE INDEX IDX_T_SCRIPT_GROUP_7 ON T_SCRIPT_GROUP (DATE_UPDATE);
CREATE UNIQUE INDEX T_USER_IDX1 ON T_USER (ID);
CREATE INDEX T_USER_IDX10 ON T_USER (DATE_UPDATE);
CREATE UNIQUE INDEX T_USER_IDX2 ON T_USER (IDC);
CREATE INDEX T_USER_IDX3 ON T_USER (LOGIN);
CREATE INDEX T_USER_IDX4 ON T_USER (NAME);
CREATE INDEX T_USER_IDX5 ON T_USER (MAIL);
CREATE INDEX T_USER_IDX6 ON T_USER (PASS_LOGIN);
CREATE INDEX T_USER_IDX7 ON T_USER (PASS_MAIL);
CREATE INDEX T_USER_IDX8 ON T_USER (VIZIT_COUNT);
CREATE INDEX T_USER_IDX9 ON T_USER (DATE_CREATE);
CREATE UNIQUE INDEX T_USER_GROUP_IDX1 ON T_USER_GROUP (ID);
CREATE INDEX T_USER_GROUP_IDX2 ON T_USER_GROUP (ID_USER);
CREATE INDEX T_USER_GROUP_IDX3 ON T_USER_GROUP (ID_GROUP);
CREATE INDEX T_USER_GROUP_IDX4 ON T_USER_GROUP (IDC_USER);
CREATE INDEX T_USER_GROUP_IDX5 ON T_USER_GROUP (IDC_GROUP);
CREATE INDEX T_USER_GROUP_IDX6 ON T_USER_GROUP (DATE_CREATE);
CREATE INDEX T_USER_GROUP_IDX7 ON T_USER_GROUP (DATE_UPDATE);


/******************************************************************************/
/***                                Triggers                                ***/
/******************************************************************************/


SET TERM ^ ;



/******************************************************************************/
/***                          Triggers for tables                           ***/
/******************************************************************************/



/* Trigger: T_GROUP_BI0 */
CREATE TRIGGER T_GROUP_BI0 FOR T_GROUP
ACTIVE BEFORE INSERT POSITION 0
AS
begin
  if( new.id is null )then begin
        new.id = gen_uuid();
  end
  new.idc = UUID_TO_CHAR( new.id );
end
^


/* Trigger: T_GROUP_BU0 */
CREATE TRIGGER T_GROUP_BU0 FOR T_GROUP
ACTIVE BEFORE UPDATE POSITION 0
AS
begin
  new.date_update = current_timestamp;
end
^


/* Trigger: T_SCRIPT_BI0 */
CREATE TRIGGER T_SCRIPT_BI0 FOR T_SCRIPT
ACTIVE BEFORE INSERT POSITION 0
AS
begin
  if( new.id is null )then begin
        new.id = gen_uuid();
  end
  new.idc = UUID_TO_CHAR( new.id );
end
^


/* Trigger: T_SCRIPT_BU0 */
CREATE TRIGGER T_SCRIPT_BU0 FOR T_SCRIPT
ACTIVE BEFORE UPDATE POSITION 0
AS
begin
  new.date_update = current_timestamp;
end
^


/* Trigger: T_SCRIPT_GROUP_BI0 */
CREATE TRIGGER T_SCRIPT_GROUP_BI0 FOR T_SCRIPT_GROUP
ACTIVE BEFORE INSERT POSITION 0
AS
begin
  if( new.id is null )then begin
        new.id = gen_uuid();
  end
  new.idc = UUID_TO_CHAR( new.id );
end
^


/* Trigger: T_SCRIPT_GROUP_BU0 */
CREATE TRIGGER T_SCRIPT_GROUP_BU0 FOR T_SCRIPT_GROUP
ACTIVE BEFORE UPDATE POSITION 0
AS
begin
  new.date_update = current_timestamp;
end
^


/* Trigger: T_USER_BI0 */
CREATE TRIGGER T_USER_BI0 FOR T_USER
ACTIVE BEFORE INSERT POSITION 0
AS
begin
  if( new.id is null )then begin
        new.id = gen_uuid();
  end
  new.idc = UUID_TO_CHAR( new.id );
end
^


/* Trigger: T_USER_BIU0 */
CREATE TRIGGER T_USER_BIU0 FOR T_USER
ACTIVE BEFORE INSERT OR UPDATE POSITION 0
AS
begin
  new.login = trim(new.login);
  new.mail  = trim(new.mail);
  new.pass_login = new.pass || new.login;
  new.pass_mail  = new.pass || new.mail;

end
^


/* Trigger: T_USER_BU0 */
CREATE TRIGGER T_USER_BU0 FOR T_USER
ACTIVE BEFORE UPDATE POSITION 0
AS
begin
  new.date_update = current_timestamp;
end
^


/* Trigger: T_USER_GROUP_BI0 */
CREATE TRIGGER T_USER_GROUP_BI0 FOR T_USER_GROUP
ACTIVE BEFORE INSERT POSITION 0
AS
begin
  if( new.id is null )then begin
        new.id = gen_uuid();
  end
  new.idc = UUID_TO_CHAR( new.id );
end
^


/* Trigger: T_USER_GROUP_BU0 */
CREATE TRIGGER T_USER_GROUP_BU0 FOR T_USER_GROUP
ACTIVE BEFORE UPDATE POSITION 0
AS
begin
  new.date_update = current_timestamp;
end
^


SET TERM ; ^

