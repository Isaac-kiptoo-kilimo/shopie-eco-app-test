import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
forgotPasswordForm!: FormGroup

constructor(private formBuilder: FormBuilder, private userService:UserService, private router:Router){
  this.forgotPasswordForm=this.formBuilder.group({
    email:['',[Validators.required]]
  })
}

initializePasswordReset(){
  if(this.forgotPasswordForm.valid){
  const forgotPassword=this.forgotPasswordForm.value
  console.log(forgotPassword);
  
  this.userService.initializePasswordReset(forgotPassword)
  this.router.navigate(['reset']);
  }else{
    this.forgotPasswordForm.markAllAsTouched()
  }
}

}
