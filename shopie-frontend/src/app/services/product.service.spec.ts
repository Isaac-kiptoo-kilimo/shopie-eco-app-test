import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../interfaces/product';

describe('ProductService', () => {
  let service: ProductService
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });


  // Test for createProduct method
  it('should create a product', () => {
    const mockProduct: Product[] = 
      [
        {
          productID: "1D8DE3C6-C6AF-4210-A006-FBAAF9706CF8",
          name: "new iphone",
          shortDescription: "This is new Iphone",
          price: 4500,
          image: "https://cdn.pixabay.com/photo/2014/08/05/10/27/iphone-410311_640.jpg"
        }
      ]
    

    service.createProduct(mockProduct).subscribe((res) => {
      expect(res).toEqual({"success": true})
      expect(res).toEqual({"message": "Product added successfullyly."})
        
    });

    const req = httpMock.expectOne('http://localhost:3500/products/create');
    expect(req.request.method).toEqual('POST');
    req.flush({"message": "Product added successfullyly."});
  });


  it('should get products', () => {
    const mockProducts: Product[] =[
      {
        productID: "1D8DE3C6-C6AF-4210-A006-FBAAF9706CF8",
        name: "new iphone",
        shortDescription: "This is new Iphone",
        price: 4500,
        image: "https://cdn.pixabay.com/photo/2014/08/05/10/27/iphone-410311_640.jpg"
      },
      {
        productID: "2048559D-1426-4895-8715-E88AE41B78AE",
        name: "new Tv Stand",
        shortDescription: "This is a good Tv stand for modern house",
        price: 2200,
        image: "https://media.istockphoto.com/id/937510970/photo/smart-tv-mockup-with-black-glossy-screen-on-console-in-living-room.jpg?s=2048x2048&w=is&k=20&c=0_fvqr0Hrqd3NR9C5tsDF2ys6rQQBJEcYI_o6fyvlg0="
      }
  ]

    service.getProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('http://localhost:3500/products/all');
    expect(req.request.method).toEqual('GET');
    req.flush(mockProducts);
  });


  it('should update a product by ID', () => {
    const mockProductID = '1D8DE3C6-C6AF-4210-A006-FBAAF9706CF8';
    const mockUpdatedProduct: Product =
    {
      productID: mockProductID,
      name: "new iphone",
      shortDescription: "This is new Iphone",
      price: 4500,
      image: "https://cdn.pixabay.com/photo/2014/08/05/10/27/iphone-410311_640.jpg"
    }

    service.updateProductById(mockProductID, mockUpdatedProduct).subscribe((res) => {
      expect(res).toEqual({"success": true})
      expect(res).toEqual({"message": "Product updated successfullyly."})
    });

    const req = httpMock.expectOne(`http://localhost:3500/products/update/${mockProductID}`);
    expect(req.request.method).toEqual('PUT');
    req.flush({"message": "Product updated successfullyly."});
  });

 
  it('should get a single product by ID', () => {
    const mockProductID = '1D8DE3C6-C6AF-4210-A006-FBAAF9706CF8';
    const mockedSingleProduct=
    [
      {
        productID: "1D8DE3C6-C6AF-4210-A006-FBAAF9706CF8",
        name: "new iphone",
        shortDescription: "This is new Iphone",
        price: 4500,
        image: "https://cdn.pixabay.com/photo/2014/08/05/10/27/iphone-410311_640.jpg"
      }
    ]
    service.getSingleProduct(mockProductID).subscribe(() => {
      expect(product).toEqual(mockedSingleProduct);
    });

    const req = httpMock.expectOne(`http://localhost:3500/products/single/${mockProductID}`);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  
  it('should delete a product by ID', () => {
    const mockProductID = '1D8DE3C6-C6AF-4210-A006-FBAAF9706CF8';

    service.deleteProduct(mockProductID).subscribe((res) => {
      expect(res).toEqual({"message": "Product updated successfullyly."})
    });

    const req = httpMock.expectOne(`http://localhost:3500/products/delete/${mockProductID}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({"message": "Product deleted successfullyly."});
  });
});
