CREATE OR ALTER PROCEDURE forgotPassword(
    @userID VARCHAR(100)
)
AS BEGIN
    UPDATE Users SET resetPassword=1 WHERE userID=@userID
END