import { Request, Response } from "express";
import mssql, { pool } from "mssql";
import { dbConfig } from "../config/db";
import { v4 } from "uuid";


//create product
export const AddProduct = async (req: Request, res: Response) => {
  try {
    const { name, shortDescription, price, image } = req.body;

    const pool = await mssql.connect(dbConfig);

    const ProductID = v4();

    const request = pool.request();

    request.input("ProductID", mssql.UniqueIdentifier, ProductID);
    request.input("name", mssql.VarChar(200), name);
    request.input("shortDescription", mssql.VarChar(300), shortDescription);
    request.input("price", mssql.Int, price);
    request.input("image", mssql.VarChar(1000), image);

    const result = await request.execute("AddProduct");

    if (result.rowsAffected[0] === 1) {
      return res
        .status(200)
        .json({ success: true, message: "Product added successfully." });
    } else {
      return res
        .status(400)
        .json({
          success: false,
          message: "Product with the same name already exists.",
        });
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};


// Update user status
export const UpdateProductControllers = async (req: Request, res: Response) => {
  try {
    const {name, shortDescription, price, image } = req.body;
    const {productID} =req.params
    if (! productID) {
      return res
        .status(400)
        .json({ error: "product not found" });
    }
    const pool = await mssql.connect(dbConfig);

    const updatedProduct = await pool.request().input("productID",
    mssql.VarChar(100),productID).input("name",mssql.VarChar(200),name).input("shortDescription", mssql.VarChar(300), shortDescription).input("price",
    mssql.Int,price).input("image", mssql.VarChar(1000),image).execute("UpdateProduct");


    if (updatedProduct.returnValue === 0) {
      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to update product",
      });
    }
  } catch (error) {
    return res.json({
      error: error,
    });
  }
};


// Get single product
export const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { productID } = req.params;

    if (!productID) {
      return res.status(400).json({ error: "name parameter is required." });
    }

    const pool = await mssql.connect(dbConfig);

    const request = pool.request();

    request.input("productID", mssql.VarChar(100), productID);

    const result = await request.execute("getSingleProduct");

    if (result.recordset.length > 0) {
      return res.json(
        result.recordset[0]
      );
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }
  } catch (error) {
    return res.json({
      error: error,
    });
  }
};

export const fetchAllProductsControllers=async(req:Request,res:Response)=>{

  try{
    const pool=await mssql.connect(dbConfig);

  const result=await pool.request().execute('fetchAllProducts')

  const fetchedProduct=result.recordset
// console.log(fetchedProduct);

  return res.json(fetchedProduct)
  
  }catch(error){
    return res.json({
      error:error
    })
  }
}


//delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { ProductID } = req.params;

    console.log(ProductID);
    

    if (!ProductID) {
      return res.status(400).json({ error: "productID is required." });
    }

    const pool = await mssql.connect(dbConfig);

    const request = pool.request().input("ProductID", mssql.VarChar(100), ProductID);

    const result = await request.execute("deleteProduct");

    const deletionResult = result.recordset[0].DeletionResult;

    console.log(deletionResult);
    
    if (deletionResult === 1) {
      return res
        .status(200)
        .json({ success: true, message: "Product deleted successfully." });
    } else if (deletionResult === -2) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete product." });
    }
  } catch (error) {
    return res.json({
      error: error,
    });
  }
};


function execute(arg0: string, arg1: { ProductID: string; name: any; shortDescription: any; price: any; image: any; }) {
    throw new Error("Function not implemented.");
}

