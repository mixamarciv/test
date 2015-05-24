/******************************************************************************/
/***                                Triggers                                ***/
/******************************************************************************/


SET TERM ^ ;



/******************************************************************************/
/***                          Triggers for tables                           ***/
/******************************************************************************/



/* Trigger: t_POST_BI0 */
CREATE TRIGGER t_POST_BI0 FOR t_POST
ACTIVE BEFORE INSERT POSITION 0
AS
begin
  new.date_create = current_timestamp;
  new.date_modify = current_timestamp;

end
^


/* Trigger: t_POST_BU0 */
CREATE TRIGGER t_POST_BU0 FOR t_POST
ACTIVE BEFORE UPDATE POSITION 0
AS
begin
    new.date_modify = current_timestamp;
end
^


/* Trigger: t_word_BI0 */
CREATE TRIGGER t_word_BI0 FOR t_word
ACTIVE BEFORE INSERT POSITION 0
AS
begin
  new.create_date = current_timestamp;
end
^


/* Trigger: t_word__POST_BI0 */
CREATE TRIGGER t_word__POST_BI0 FOR t_word__POST
ACTIVE BEFORE INSERT POSITION 0
AS
begin
  new.create_date = current_timestamp;
end
^


SET TERM ; ^
