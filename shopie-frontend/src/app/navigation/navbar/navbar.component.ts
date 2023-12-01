import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { UserDetails } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  products: Product[] = [];
  cartItems: any[] = [];
  cartQuantity: number = 0;
  cartTotal: number = 0;
  showCart=false
  loggedIn: boolean = false;
  showProfileDropdown: boolean = false;
 filter=''
 userDetails!: UserDetails ;
 userID! : string;

  constructor(private router: Router, private authService: AuthService, private formBuilder:FormBuilder, private productService: ProductService, private cartService: CartService) {
    this.loggedIn = authService.isLoggedIn();
  }

  loggedInTrue = localStorage.getItem('loggedIn')

  // loggedIn = this.loggedInTrue

  ngOnInit(): void {
    this.getProducts();
    this.getCartItems()
    this.cartService.cartItems$.subscribe(cartItems => {
      this.cartQuantity = cartItems.length;
      this.cartTotal = this.cartService.getTotalPrice();
    });
    if (this.authService.isLoggedIn()) {
     
      this.authService.getUserDetails().subscribe(
        (userDetails) => {
          console.log(userDetails[0].fullName);
          
          this.userDetails = userDetails[0];
          this.userID = userDetails[0].userID;
          this.getProducts();
        },
        (error) => {
          console.error('Error getting user details:', error);
        }
      );
    }
  }

  checkLoggedIn(){

    console.log(this.loggedInTrue);
    if(this.loggedInTrue == 'true'){
     
    }
  }



  getProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

 
getCartItems(){
  this.cartService.cartItems$.subscribe((cartItems) => {
    this.cartItems = cartItems;
  });
}

  removeFromCart(index: number) {
    this.cartService.removeFromCart(index);
  }

  clearCart() {
    this.cartService.clearCart();
  }
 

  logout() {
    this.router.navigate(['']);
    localStorage.clear();
    this.loggedIn = false;
  }

  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
  }
}


