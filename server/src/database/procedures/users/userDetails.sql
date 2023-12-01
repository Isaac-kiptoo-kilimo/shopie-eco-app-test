CREATE OR ALTER PROCEDURE GetUserDetails(
    @userID VARCHAR(100)
)
AS
BEGIN
    SELECT
        userID,
        fullName,
        email,
        role,
        profileImage
    FROM
        Users
    WHERE
        userID = @userID;
END;


