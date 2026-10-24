import { Component, inject } from '@angular/core';
import { FormBuilder,ReactiveFormsModule,Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { passwordMatchValidator } from '../../validators/password-match-validator';
import { AuthService } from '../../../services/auth.service';
import { RegisterRequest } from '../../../interface/dtos/register-request';
import { ToastService } from '../../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  formbuilder = inject(FormBuilder)
  router = inject(Router)
  authService = inject(AuthService)
  toastService = inject(ToastService)
  registerForm = this.formbuilder.group({
    name: ['', Validators.required],
    userName:['',Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required,Validators.minLength(6)]],
    confirmPassword:['',Validators.required]
  },{
    validators: [passwordMatchValidator('password','confirmPassword')]
  });

  get name(){
    return this.registerForm.get('name');
  }
  get userName(){
    return this.registerForm.get('userName');
  }
  get email(){
    return this.registerForm.get('email');
  }
  get password(){
    return this.registerForm.get('password');
  }
  get confirmPassword(){
    return this.registerForm.get('confirmPassword');
  }

  registerUser(){
    if(this.registerForm.valid){
      const user:RegisterRequest = {
        name : this.name?.value!,
        userName:this.userName?.value!,
        email: this.email?.value?.toLowerCase()!,
        password: this.password?.value!
      };
      this.authService.register(user).subscribe({
        next:() => {
          this.toastService.success("User registered");
          this.router.navigate(['/auth/login']);
        },
        error:(err:HttpErrorResponse) => {
          if(err.error?.message){
            this.toastService.error(err.error.message);
          }
          else{
            this.toastService.error("Unexpected error occurred");
          }
        }
      });
    }
  }
}
