import { Request, Response, json } from "express";
import { v4 } from "uuid";

import mssql from "mssql";
import { AddProduct, UpdateProductControllers, deleteProduct, fetchAllProductsControllers, getSingleProduct } from "./productControllers";




describe("testing the products controllers", () => {
  let res: any;
  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it("should retrieve details for a single product", async () => {
    const req = {
      params: {
        productID: "2793BFE0-94C4-44F6-B9FA-D7BDCC5807B0",
      },
    };

    let expectedProduct = {
    productID: "2793BFE0-94C4-44F6-B9FA-D7BDCC5807B0",
    name: "Mac Book Laptop",
    shortDescription: "This is the latest mac book",
    price: 150000,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxhcHRvcHxlbnwwfHwwfHx8MA%3D%3D"
    };

    jest.spyOn(mssql, "connect").mockResolvedValueOnce({
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValueOnce({
        recordset: [expectedProduct],
      }),
    } as never);

    await getSingleProduct(req as any, res as Response);

    expect(res.json).toHaveBeenCalledWith({ product: [expectedProduct] });
  });

  it("should retrieve details for all products", async () => {
    const req = {};

    let expectedProducts = [
      {
        productID: "2793BFE0-94C4-44F6-B9FA-D7BDCC5807B0",
        name: "Mac Book Laptop",
        shortDescription: "This is the latest mac book",
        price: 150000,
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxhcHRvcHxlbnwwfHwwfHx8MA%3D%3D"
      }
    ];

    jest.spyOn(mssql, "connect").mockResolvedValueOnce({
      request: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValueOnce({
        recordset: expectedProducts,
      }),
    } as never);

    await fetchAllProductsControllers(req as any, res as Response);
    expect(res.json).toHaveBeenCalledWith(expectedProducts);
});
});




describe("Products Controllers", () => {
  let res: any;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe("Create Product", () => {
    it("Successfully creates a product", async () => {
      const req = {
        body: {
          name: "new Tv Stand",
          shortDescription: "This is a good Tv stand for modern house",
          price: 2200,
          image: "https://media.istockphoto.com/id/937510970/photo/smart-tv-mockup-with-black-glossy-screen-on-console-in-living-room.jpg?s=2048x2048&w=is&k=20&c=0_fvqr0Hrqd3NR9C5tsDF2ys6rQQBJEcYI_o6fyvlg0="
        }
      };

      

      const mockedInput = jest.fn().mockReturnThis();
      const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });

      const mockedRequest = {
        input: mockedInput,
        execute: mockedExecute
      };

      const mockedPool = {
        request: jest.fn().mockReturnValue(mockedRequest)
      };

      jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool as never);

      await AddProduct(req as Request, res as any);

      expect(res.json).toHaveBeenCalledWith({ message: 'Created product Successfully' });
      // expect(res.status).toHaveBeenCalledWith(201);
      // expect(mockedInput).toHaveBeenCalledWith('name', mssql.VarChar, 'Diani New Product');
      // expect(mockedInput).toHaveBeenCalledWith('description', mssql.VarChar, 'We will be visiting Diani every weekend to relax');
      // expect(mockedInput).toHaveBeenCalledWith('destination', mssql.VarChar, 'Diani exciting Product');
      // expect(mockedInput).toHaveBeenCalledWith('price', mssql.Int, 5000);
      // expect(mockedInput).toHaveBeenCalledWith('type', mssql.VarChar, 'Weekend outways');
      // expect(mockedInput).toHaveBeenCalledWith('startDate', mssql.Date, '2023-12-01');
      // expect(mockedInput).toHaveBeenCalledWith('endDate', mssql.Date, '2023-12-10');
    });
  });



  describe("Update Product", () => {
    it("Successfully updates a product", async () => {
      const req = {
        params: {
          productID: "2048559D-1426-4895-8715-E88AE41B78AE"
        },
        body: {
          name :"new Tv Stand",
          shortDescription: "This is a good Tv stand for modern house",
          price: 2200,
          image: "https://media.istockphoto.com/id/937510970/photo/smart-tv-mockup-with-black-glossy-screen-on-console-in-living-room.jpg?s=2048x2048&w=is&k=20&c=0_fvqr0Hrqd3NR9C5tsDF2ys6rQQBJEcYI_o6fyvlg0="
        }
      };

     

      const mockedInput = jest.fn().mockReturnThis();
      const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });

      const mockedRequest = {
        input: mockedInput,
        execute: mockedExecute
      };

      const mockedPool = {
        request: jest.fn().mockReturnValue(mockedRequest)
      };

      jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool as never);

      await UpdateProductControllers(req as any, res as any);

      expect(res.json).toHaveBeenCalledWith({ message: 'product updated successfully' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(mockedInput).toHaveBeenCalledWith('name', mssql.VarChar, 'new Tv Stand');
      expect(mockedInput).toHaveBeenCalledWith('shortDescription', mssql.VarChar, 'This is a good Tv stand for modern house');
      expect(mockedInput).toHaveBeenCalledWith('price', mssql.Int, 2200);
      expect(mockedInput).toHaveBeenCalledWith('image', mssql.VarChar, 'https://media.istockphoto.com/id/937510970/photo/smart-tv-mockup-with-black-glossy-screen-on-console-in-living-room.jpg?s=2048x2048&w=is&k=20&c=0_fvqr0Hrqd3NR9C5tsDF2ys6rQQBJEcYI_o6fyvlg0=');

    });
  });



  describe("Delete Product", () => {
    it("Successfully deletes a product", async () => {
      const req = {
        params: {
          productID: "2048559D-1426-4895-8715-E88AE41B78AE"
        }
      };

      const mockedInput = jest.fn().mockReturnThis();
      const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });

      const mockedRequest = {
        input: mockedInput,
        execute: mockedExecute
      };

      const mockedPool = {
        request: jest.fn().mockReturnValue(mockedRequest)
      };

      jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool as never);

      await deleteProduct(req as any, res as any);

      expect(res.json).toHaveBeenCalledWith({ message: 'Deleted successfully' });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });



});
