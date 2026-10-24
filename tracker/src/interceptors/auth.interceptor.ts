import { HttpInterceptorFn } from "@angular/common/http";
import { AuthResponse } from "../interface/dtos/auth-response";

export const authInterceptor : HttpInterceptorFn = (req,next) =>{
    const user: AuthResponse = JSON.parse(localStorage.getItem("user")!);
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).token: null;

    if(req.url.includes('/auth/login') || req.url.includes('/auth/register')){
        return next(req);
    }
    if(token){
        const clonedReq = req.clone({
            setHeaders:{
                Authorization: `Bearer ${token}`
            }
        });
        return next(clonedReq);
    }
    return next(req);
}
