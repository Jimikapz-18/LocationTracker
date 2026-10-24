import { Component, inject, Input, OnInit, output, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FriendService } from '../../../services/friend.service';
import { AuthResponse } from '../../../interface/dtos/auth-response';

@Component({
    selector: 'app-sidebar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {
    @Input() open = false;
    closeRequest = output<void>();

    private authService = inject(AuthService);
    private friendService = inject(FriendService);
    private router = inject(Router);

    currentUser = signal<AuthResponse | null>(null);
    pendingRequestCount = signal(0);

    ngOnInit(): void {
        this.currentUser.set(this.authService.getCurrentUser());
        this.loadPendingCount();
    }

    private loadPendingCount(): void {
        this.friendService.getIncomingFriendRequests().subscribe({
            next: (requests) => this.pendingRequestCount.set(requests.length),
            error: () => this.pendingRequestCount.set(0)
        });
    }

    getInitials(name: string): string {
        return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    }

    logout(): void {
        this.authService.logout();
    }

    close(): void {
        this.closeRequest.emit();
    }
}
