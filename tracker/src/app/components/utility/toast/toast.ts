import { Component, inject, OnInit } from '@angular/core';
import { ToastConfig, ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class Toast implements OnInit {
  toastService = inject(ToastService);
  toastConfig: ToastConfig | null = null;

  ngOnInit(): void {
    this.toastService.toastState$.subscribe(config => {
      this.toastConfig = config;
      setTimeout(() => { this.toastConfig = null; }, 3200);
    });
  }
}
