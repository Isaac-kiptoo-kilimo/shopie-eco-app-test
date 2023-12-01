create or Alter procedure getSingleProduct
@ProductID VARCHAR(100)

AS
BEGIN
    select * from Products
where ProductID = @ProductID
END