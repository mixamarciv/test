SET TERM ^ ;

CREATE OR ALTER PROCEDURE UUID_TO_CHAR2 (
    uuid char(16))
returns (
    uuidc char(32))
as
begin
  UUIDC = REPLACE(UUID_TO_CHAR( UUID ),'-','');
  suspend;
end^

SET TERM ; ^
