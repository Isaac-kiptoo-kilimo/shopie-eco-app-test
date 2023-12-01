import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/interfaces/product';
import { User, UserDetails } from 'src/app/interfaces/user';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
// import { ModalCommunicationService } from 'src/app/services/modal-communication.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  visible = true
  notVisible=false
  loggedIn=true
  hidden=true
  filter=''
  userID! : string;
  createProductForm!: FormGroup
  products!: Product[];
  users!: User[];
  userDetails!: UserDetails ;
  isFormVisible: boolean=true
  showProfileDropdown: boolean = false;

  updateProductForm!: FormGroup
  product!: Product
  productID: string=''
  updateProductID :string =''

  constructor(
    private productService:ProductService,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {
this.createProductForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      shortDescription: ['', [Validators.required]],
      image:['',[Validators.required]]
    }
      );  
      this.loggedIn = authService.isLoggedIn()  
  }
  loggedInTrue = localStorage.getItem('loggedIn')


  ngOnInit() {
    this.getProducts();
    this.getUsers();

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

  getProducts() {
    this.productService.getProducts().subscribe(
      (response) => {
        this.products = response;
      },
      (error) => {
        console.error('Error fetching tours:', error);
      }
    );
  }

  createProduct() {
    let createProduct: Product = this.createProductForm.value;
    this.productService.createProduct(createProduct).subscribe(
      () => {
        this.getProducts();
        // this.loadProducts();
        this.visible=true
       
      },
      (error) => {
        console.error('Error creating products:', error);
      }
    );
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {
        console.error('Error fetching users:',error.error.message);
      }
    );
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (products) => {
        this.products = products;
        this.loadProducts();
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );

    
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = users;
        this.loadUsers();
      },
      (error) => {
        console.error('Error fetching tours:', error);
      }
    );
  }

  deleteProduct(productID: string): void {
    alert('Are you sure You want to delete, this action is irreversible')
    this.productService.deleteProduct(productID).subscribe(
      () => {
        this.loadProducts();
      },
      (error) => {
        console.error('Error deleting product:', error);
      }
    );
  }


  deleteUser(userID: string): void {
    alert('Are you sure You want to delete, this action is irreversible')
    this.userService.deleteUser(userID).subscribe(
      () => {
        this.loadUsers();
      },
      (error) => {
        console.error('Error deleting Tour:', error);
      }
    );
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

 
}
