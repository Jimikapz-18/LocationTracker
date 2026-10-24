import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ApiURL } from '../../environment/environment'
import { RegisterRequest } from "../interface/dtos/register-request";
import { tap } from "rxjs";
import { LoginRequest } from "../interface/dtos/login-request";
import { AuthResponse } from "../interface/dtos/auth-response";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private httpClient = inject(HttpClient);
    private router = inject(Router);
    private baseUrl = ApiURL;

    register(user: RegisterRequest) {
        return this.httpClient.post(`${this.baseUrl}/api/auth/register`, user);
    }

    login(request: LoginRequest) {
        return this.httpClient.post<AuthResponse>(`${this.baseUrl}/api/auth/login`, request)
            .pipe(
                tap((response) => {
                    localStorage.setItem('user', JSON.stringify(response));
                })
            );
    }

    getToken(): string | null {
        const userJson = localStorage.getItem('user');
        if (!userJson) return null;
        try {
            const user: AuthResponse = JSON.parse(userJson);
            return user.token || null;
        } catch {
            return null;
        }
    }

    getCurrentUser(): AuthResponse | null {
        const userJson = localStorage.getItem('user');
        if (!userJson) return null;
        try {
            return JSON.parse(userJson) as AuthResponse;
        } catch {
            return null;
        }
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    logout(): void {
        localStorage.removeItem('user');
        this.router.navigate(['/auth/login']);
    }
}