-- USE SHOPPIE_ECO_APP
CREATE TABLE Users(
    userID VARCHAR(100) PRIMARY KEY,
    fullName VARCHAR(200) NOT NULL,
    email VARCHAR(250) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(100) DEFAULT 'customer',
    resetToken VARCHAR(500) DEFAULT NULL,
    expiryTime DATETIME DEFAULT NULL,
    welcomed BIT Default 0,
    isSend BIT DEFAULT 0,
    profileImage VARCHAR(1000) NOT NULL
)

select * from Users

UPDATE Users SET role='Admin' where email='isaackilimok1@gmail.com' 
-- ALTER TABLE Users ADD 
DROP TABLE Users