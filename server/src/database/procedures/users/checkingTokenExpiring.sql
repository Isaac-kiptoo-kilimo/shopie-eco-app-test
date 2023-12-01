CREATE OR ALTER PROCEDURE CheckResetTokenExpiry
    @userID VARCHAR(100),
    @currentDateTime DATETIME
AS
BEGIN
    SELECT resetPasswordExpires
    FROM Users
    WHERE userID = @userID
        AND resetPasswordExpires > @currentDateTime;
END;
