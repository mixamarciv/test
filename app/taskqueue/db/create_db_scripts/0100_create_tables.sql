



CREATE TABLE TASK (
    IDC           CHAR(36),
    IDC_FIRST_RUN CHAR(36),
    NAME          VARCHAR(500),
    NOTE          VARCHAR(2000),
    RUN_JSON      VARCHAR(20000),
    OUT_FILE      VARCHAR(2000),
    CACHE_TEXT    VARCHAR(30000),
    CACHE_HASH    VARCHAR(40),
    DATE_CREATE   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DATE_UPDATE   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DATE_RUN      TIMESTAMP,
    DATE_END      TIMESTAMP,
    STATUS        SMALLINT
);


CREATE TABLE TASK_QUEUE (
    IDC             CHAR(36),
    USER_INFO       VARCHAR(5000),
    USER_INFO_HASH  VARCHAR(40),
    IDC_TASK        CHAR(36),
    DATE_CREATE     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DATE_UPDATE     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE TASK_STATUS (
    ID    SMALLINT,
    NAME  VARCHAR(200)
);


INSERT INTO TASK_STATUS (ID, NAME) VALUES (0, 'только созданная задача');
INSERT INTO TASK_STATUS (ID, NAME) VALUES (1, 'поставлена в очередь');
INSERT INTO TASK_STATUS (ID, NAME) VALUES (2, 'выполняется');
INSERT INTO TASK_STATUS (ID, NAME) VALUES (3, 'прервана');
INSERT INTO TASK_STATUS (ID, NAME) VALUES (4, 'завершена');

COMMIT WORK;




CREATE UNIQUE INDEX TASK_IDX1 ON TASK (CACHE_HASH);
CREATE UNIQUE INDEX TASK_IDX2 ON TASK (IDC, DATE_END, DATE_CREATE);
CREATE INDEX TASK_IDX3 ON TASK (STATUS, DATE_CREATE);
CREATE UNIQUE INDEX TASK_QUEUE_IDX1 ON TASK_QUEUE (IDC);
CREATE INDEX TASK_QUEUE_IDX2 ON TASK_QUEUE (IDC_TASK, DATE_CREATE);
CREATE INDEX TASK_QUEUE_IDX3 ON TASK_QUEUE (IDC_TASK, USER_INFO_HASH);




SET TERM ^ ;





/* Trigger: TASK_BI0 */
CREATE TRIGGER TASK_BI0 FOR TASK
ACTIVE BEFORE INSERT POSITION 0
AS
begin
  new.date_create = current_timestamp;
end
^


/* Trigger: TASK_BU0 */
CREATE TRIGGER TASK_BU0 FOR TASK
ACTIVE BEFORE UPDATE POSITION 0
AS
begin
  new.date_update = current_timestamp;
end
^


/* Trigger: TASK_QUEUE_BI0 */
CREATE TRIGGER TASK_QUEUE_BI0 FOR TASK_QUEUE
ACTIVE BEFORE INSERT POSITION 0
AS
begin
  new.date_create = current_timestamp;
end
^


/* Trigger: TASK_QUEUE_BU0 */
CREATE TRIGGER TASK_QUEUE_BU0 FOR TASK_QUEUE
ACTIVE BEFORE UPDATE POSITION 0
AS
begin
  new.date_update = current_timestamp;
end
^


SET TERM ; ^

