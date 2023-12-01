import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor( private http:HttpClient) { }

  createProduct(product : Product): Observable<any> {
    return this.http.post('http://localhost:3500/products/create', product);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:3500/products/all', {
      headers: {
        'Content-type': 'application/json',
      },
    });
  }


  updateProductById(productID: string, updatedProduct: Product): Observable<Product> {
    console.log(updatedProduct);
    console.log(productID);
    
    return this.http.put<Product>(`http://localhost:3500/products/update/${productID}`, updatedProduct).pipe(
      tap((updatedProduct: Product) => {
       
        console.log('Product updated on the server:', updatedProduct);
      }),
      catchError((error) => {
        console.error('Error updating product on the server:', error);
        return throwError(error);
      })
    );;
  }
  

  getSingleProduct(productID:string){

    console.log(productID);
    
    return this.http.get(`http://localhost:3500/products/single/${productID}`)
  }

  
  deleteProduct(productID: string): Observable<any> {
    return this.http.delete(`http://localhost:3500/products/delete/${productID}`)
   
  }

  
}
