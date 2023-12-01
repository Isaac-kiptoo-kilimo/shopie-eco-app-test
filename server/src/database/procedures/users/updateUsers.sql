CREATE OR ALTER PROCEDURE updateUser(
    @userID VARCHAR (100),
    @fullName VARCHAR(200),
    @email VARCHAR(250),
    @profileImage VARCHAR(1000)
)
AS BEGIN
    UPDATE Users SET fullName=@fullName,email=@email,profileImage=@profileImage WHERE userID = @userID;

END