import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductService } from './product.service';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  productAddedToCart = new EventEmitter<any>();
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  private allProducts: any[] = [];

  constructor(private productService: ProductService) {
    this.loadCartFromLocalStorage();
    this.loadProductsFromServer();
  }

  addToCart(product: Product[],userID: string) {
    const currentCartItems = this.cartItemsSubject.value;
    const updatedCartItems = [...currentCartItems,  { ...product, userID }];
    this.cartItemsSubject.next(updatedCartItems);
    this.saveCartToLocalStorage(updatedCartItems);

    // Remove the product from the local list of products
    this.removeProductFromList(product);
    this.productAddedToCart.emit(product);

  }

  removeFromCart(index: number) {
    const currentCartItems = this.cartItemsSubject.value;
    const removedItem = currentCartItems[index];

    const updatedCartItems = currentCartItems.filter((_, i) => i !== index);
    this.cartItemsSubject.next(updatedCartItems);
    this.saveCartToLocalStorage(updatedCartItems);

    // Add the product back to the local list of products
    this.addProductToList(removedItem);
  }

  clearCart() {
    const cartItems = this.cartItemsSubject.value;

    // Add all products back to the local list
    cartItems.forEach(product => this.addProductToList(product));

    this.cartItemsSubject.next([]);
    this.saveCartToLocalStorage([]);
  }

  getCartItems(): any[] {
    return this.cartItemsSubject.value;
  }

  getTotalPrice(): number {
    const cartItems = this.cartItemsSubject.value;
    return cartItems.reduce((total, item) => total + item.price, 0);
  }

  private saveCartToLocalStorage(cartItems: any[]) {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  private loadCartFromLocalStorage() {
    const storedCartItems = localStorage.getItem('cartItems');
    const cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
    this.cartItemsSubject.next(cartItems);
  }

  private loadProductsFromServer() {
    // Fetch all products from the server and initialize the local list
    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;
    });
  }

  private addProductToList(product: any) {
    // Add the product back to the local list
    this.allProducts.push(product);
  }

  private removeProductFromList(product: any) {
    // Remove the product from the local list
    const index = this.allProducts.findIndex(p => p.productID === product.productID);
    if (index !== -1) {
      this.allProducts.splice(index, 1);
    }
  }
}
