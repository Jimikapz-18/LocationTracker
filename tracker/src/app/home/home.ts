import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocationHubService } from '../../services/location-hub.service';
import { Sidebar } from '../components/sidebar/sidebar';

@Component({
    selector: 'app-home',
    imports: [Sidebar, RouterOutlet],
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
    locationHub = inject(LocationHubService);
    sidebarOpen = signal(false);

    ngOnInit(): void {
        this.locationHub.startConnection();
    }

    ngOnDestroy(): void {
        this.locationHub.stopConnection();
    }

    toggleSidebar(): void {
        this.sidebarOpen.update(v => !v);
    }

    closeSidebar(): void {
        this.sidebarOpen.set(false);
    }
}
