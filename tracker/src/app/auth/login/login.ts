import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginRequest } from '../../../interface/dtos/login-request';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  formbuilder = inject(FormBuilder)
  authService = inject(AuthService);;
  router = inject(Router);
  toastService = inject(ToastService)
  loginForm = this.formbuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  get email(){
    return this.loginForm.get('email');
  }
  get password(){
    return this.loginForm.get('password');
  }
  login(){
    const request:LoginRequest = {
      email : this.email?.value?.toLowerCase()!,
      password: this.password?.value!
    }
    this.authService.login(request).subscribe({
      next: () => {
        this.router.navigate(['/home']);
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
