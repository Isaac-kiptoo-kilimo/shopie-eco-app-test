import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User, UserDetails } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent {

  filter=''
  userID: string=''
  users!: User []
  isFormVisible: boolean=true
  showProfileDropdown: boolean = false;
  loggedIn=true
  userDetails!: UserDetails ;


  constructor(private userService: UserService, private authService:AuthService, private router: Router){
    this.getUsers();
    this.loggedIn = authService.isLoggedIn()  
}
loggedInTrue = localStorage.getItem('loggedIn')


ngOnInit() {
  
  this.getUsers();

  if (this.authService.isLoggedIn()) {
   
    this.authService.getUserDetails().subscribe(
      (userDetails) => {
        console.log(userDetails[0].fullName);
        
        this.userDetails = userDetails[0];
        this.userID = userDetails[0].userID;
        
      },
      (error) => {
        console.error('Error getting user details:', error);
      }
    );
  }
  
}

  getUsers(){
    this.userService.getUsers().subscribe(users=>{
      this.users=users
      return users
    })
  }    

  deleteUser(userID:string){
    console.log(userID);
    
    this.userService.deleteUser(userID).subscribe((res)=>{
      console.log("user Deleted Successfully");
      this.getUsers()
      
    })
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

