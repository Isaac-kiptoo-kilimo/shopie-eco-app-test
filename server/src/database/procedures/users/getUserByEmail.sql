CREATE OR ALTER PROCEDURE getUserByEmail(
    @email VARCHAR (250)
)

AS BEGIN
    SELECT userID,fullName,email,password,role,profileImage FROM Users WHERE email=@email
END