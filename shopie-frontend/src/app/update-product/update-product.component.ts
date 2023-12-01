import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../interfaces/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent {
  
  hidden = true
  show=true
  updateProductForm!: FormGroup
  products! : Product []
  product!: Product
  productID: string=''
  updateProductID :string =''
  filter=''

  constructor( private formBuilder:FormBuilder, private productService:ProductService ){

 this.updateProductForm = this.formBuilder.group({
  name: ['', [Validators.required]],
  price: ['', [Validators.required]],
  shortDescription: ['', [Validators.required]],
  image:['',[Validators.required]]
}
  );
  }


  ngOnInit() {
    this.getProducts();  
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


  clickUpdateProductID = (productID:string)=> {
    this.updateProductID = productID

    console.log(this.updateProductID);
    
  }

  updateProduct() {
    if (this.updateProductForm.invalid) {
    
      return;
    }
  console.log(this.product);
  console.log(this.updateProductID);
  
  
    if (!this.updateProductID) {
      
      console.error('Invalid product or productID');
      return;
    }
  
    let updatedProduct: Product = this.updateProductForm.value;
     this.productID= this.updateProductID;
  
    console.log(updatedProduct);
  
    this.productService.updateProductById(this.productID, updatedProduct).subscribe(
      (response) => {
        console.log('Product updated successfully', response);
        const index = this.products.findIndex(product => product.productID === this.productID);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }

        this.updateProductForm.reset();
        this.hidden = true;
      },
      (error) => {
        console.error('Error updating Product', error);
      }
    );
  }


}
