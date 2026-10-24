import { inject, Injectable } from "@angular/core";
import * as signalR from '@microsoft/signalr';
import { Subject } from "rxjs";
import { AuthService } from "./auth.service";
import { LocationUpdate } from "../interface/dtos/location-update";
import { ApiURL, production } from "../../environment/environment";

@Injectable({
    providedIn: 'root'
})
export class LocationHubService {
    private hubConnection!: signalR.HubConnection;
    private friendCache = new Map<string, LocationUpdate>();
    private selfCache: LocationUpdate | null = null;

    private locationSubject = new Subject<LocationUpdate>();
    private selfSubject = new Subject<LocationUpdate>();

    private authService = inject(AuthService);
    private sendInterval?: ReturnType<typeof setInterval>;

    /** Emits whenever a friend's location is updated */
    locationUpdates$ = this.locationSubject.asObservable();

    /** Emits whenever the current user's own location is sent */
    selfLocation$ = this.selfSubject.asObservable();

    startConnection(): void {
        const token = this.authService.getToken();
        if (!token) return;

        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${ApiURL}/hubs/location`, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.start()
            .then(() => {
                console.log('SignalR connected');
                this.sendLocationNow();
                this.sendInterval = setInterval(() => this.sendLocationNow(), 30_000);
            })
            .catch(console.error);

        this.hubConnection.on('FriendsLocationsUpdated', (location: LocationUpdate) => {
            this.friendCache.set(location.userId, location);
            this.locationSubject.next(location);
        });
    }

    /** Snapshot of all friend locations received so far */
    getLocationSnapshot(): Map<string, LocationUpdate> {
        return this.friendCache;
    }

    /** Last known own location (null if not yet sent) */
    getSelfSnapshot(): LocationUpdate | null {
        return this.selfCache;
    }

    private sendLocationNow(): void {
        if (production) {
            this.sendRealLocation();
        } else {
            this.sendRandomLocation();
        }
    }

    private sendRealLocation(): void {
        if (!navigator.geolocation) {
            this.sendRandomLocation();
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => this.transmit(pos.coords.latitude, pos.coords.longitude),
            () => this.sendRandomLocation(),
            { enableHighAccuracy: true, timeout: 10_000 }
        );
    }

    private sendRandomLocation(): void {
        const lat = 20 + Math.random() * 10;
        const lng = 70 + Math.random() * 10;
        this.transmit(lat, lng);
    }

    private transmit(lat: number, lng: number): void {
        this.hubConnection.invoke('SendLocation', lat, lng)
            .then(() => this.emitSelf(lat, lng))
            .catch(err => console.error('Error sending location', err));
    }

    private emitSelf(lat: number, lng: number): void {
        const user = this.authService.getCurrentUser();
        if (!user) return;
        const update: LocationUpdate = {
            userId: user.userId,
            userName: user.name,
            coordinate: { latitude: lat, longitude: lng },
            lastUpdated: new Date().toISOString()
        };
        this.selfCache = update;
        this.selfSubject.next(update);
    }

    stopConnection(): void {
        if (this.sendInterval) {
            clearInterval(this.sendInterval);
            this.sendInterval = undefined;
        }
        this.hubConnection?.stop();
    }
}
