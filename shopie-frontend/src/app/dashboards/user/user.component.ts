import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { UserDetails } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  products!: Product[];
  userDetails!: UserDetails ;
  userID! : string;
  loggedIn=true
  filter=''
  showCart = false
  isFormVisible: boolean=true
    // products: Product[] = [];
cartItems: any[] = [];
cartQuantity: number = 0;
cartTotal: number = 0;
notHidden=true
// showCart=false
// loggedIn: boolean = false;
showProfileDropdown: boolean = false;
  product!: any;

  constructor(private router:Router, private userService: UserService,  private cartService: CartService, private authService: AuthService, private productService: ProductService) {
    this.loggedIn = authService.isLoggedIn();
  }

  loggedInTrue = localStorage.getItem('loggedIn')
  


  ngOnInit() {
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
    // this.cartService.productAddedToCart.subscribe((product) => {
    //   this.removeProductFromList(product);
    // });
  
  }

  getProducts() {
    this.userService.getProducts().subscribe((products) => {
      console.log(products);
      this.products = products;
      return products;
    });
  }

  getSingleProduct(productID: string){
    console.log(productID);
    
    this.productService.getSingleProduct(productID).subscribe((res)=>{
      this.product=res
      console.log(this.product.shortDescription);
      
    })
  }
  addToCart(product: any, userID:string) {
    console.log(product);
    
    this.cartService.addToCart(product, userID);
    // this.getProducts()
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
    
    checkLoggedIn(){

      console.log(this.loggedInTrue);
      if(this.loggedInTrue == 'true'){
       
      }
    }
    
    logout() {
      this.router.navigate(['']);
      localStorage.clear();
      this.loggedIn = false;
    }
    
    toggleProfileDropdown() {
      this.showProfileDropdown = !this.showProfileDropdown;
    }
  // removeProductFromList(product: any) {
  //   const index = this.products.findIndex((p) => p.productID === product.productID);
  //   if (index !== -1) {
  //     this.products.splice(index, 1);
  //   }
  // }
}


