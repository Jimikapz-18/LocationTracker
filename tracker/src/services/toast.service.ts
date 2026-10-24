import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

export interface ToastConfig {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toastSubject = new Subject<ToastConfig>();
    toastState$ = this.toastSubject.asObservable();

    private show(type: ToastConfig['type'], message: string) {
        this.toastSubject.next({ type, message });
    }

    success(message: string) {
        this.show('success', message);
    }

    error(message: string) {
        this.show('error', message);
    }

    info(message: string) {
        this.show('info', message);
    }

    warning(message: string) {
        this.show('warning', message);
    }

}