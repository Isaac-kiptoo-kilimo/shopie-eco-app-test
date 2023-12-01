import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User, updatedUserData } from '../interfaces/user';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  updatedUserData!: updatedUserData[];
  userID! : string 
  updateUserForm!: FormGroup
  users!: User[];
  isFormVisible: boolean=false
  // hidden= false
  constructor(private userService:UserService,private formBuilder:FormBuilder){
    this.updateUserForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      profileImage: ['', [Validators.required]]

    });
    
  }
ngOnInit(){
  this.getUserDetails()
}
  updateUser(){
    let updatedUser: User = this.updateUserForm.value;
    // updatedUser.userID = this.userID
       console.log(updatedUser);
       
    this.userService.updateUserById(updatedUser).subscribe(
      (response) => {
        console.log(response);
        
        console.log('User updated successfully', response);
        this.updateUserForm.reset();
        this.getUserDetails()
        this.isFormVisible = true;
        
      },
      (error) => {
        console.error('Error updating user', error);
      }
    );
  }

  getUserDetails(){
    this.userService.checkDetails().subscribe((user)=>{
      console.log(user);
      return user
      
    })
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
}
