CREATE TABLE Products (
    productID VARCHAR(100) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    shortDescription VARCHAR(300) NOT NULL,
    price INT NOT NULL,
    image VARCHAR(1000) NOT NULL
);

DROP TABLE IF EXISTS Products;