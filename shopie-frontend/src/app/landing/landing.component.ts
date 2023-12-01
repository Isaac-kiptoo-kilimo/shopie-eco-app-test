import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../interfaces/product';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
filter=''
// @Input() Filteredproducts: any[] = [];
// @Input() searchQuery: string = '';

  products! : Product[]
  constructor(private productService:ProductService){}

ngOnInit(){
  this.getProducts()

}
  
  getProducts(){
    this.productService.getProducts().subscribe((products)=>{
      console.log(products);
      this.products=products
      return products
    })
  }

}
document.addEventListener('DOMContentLoaded', function () {
  const heroContainer = document.getElementById('heroImage') as HTMLElement;
  const imageArray: string[] = [
    'https://luna-askmen-images.askmen.com/1080x540/2020/03/04-013731-best_gold_watches_for_every_style_and_budget.jpg',
    'https://assets-global.website-files.com/605826c62e8de87de744596e/63f5e30a4d577354fdfce512_Duotone-Master-ssssFile-copy.jpg',
    'https://images.drive.com.au/caradvice/image/private/q_auto/v1/1f3591b935f75c9690294dde3584c10a',
  ];
  let currentIndex = 0;

  function changeBackgroundImage() {
    heroContainer.style.backgroundImage = `url('${imageArray[currentIndex]}')`;
    currentIndex = (currentIndex + 1) % imageArray.length;
  }

  setInterval(changeBackgroundImage, 3000);
});


