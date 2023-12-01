
--use SHOPPIE_ECO_APP
CREATE OR ALTER PROCEDURE ResetPassword(
    @email VARCHAR (250),
    @resetToken VARCHAR(500),
    @newPassword VARCHAR(100)
)
AS
BEGIN
    if EXISTS (select 1 from Users where email = @email)
    begin
        if exists(select 1 from Users where email = @email and resetToken = @resetToken)
    begin
        update Users 
    set password = @newPassword,
        resetToken = null,
        expiryTime = null,
        isSend = 0
    where email = @email;
        select 'password updated successfully 'as message;
        END
    ELSE
    begin
            select 'invalid token' as message;
        END
    end
    ELSE
    begin
        select 'invalid email' as message
    end


END;
