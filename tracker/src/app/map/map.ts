import { AfterViewInit, Component, inject, OnDestroy, signal } from '@angular/core';
import * as L from 'leaflet';
import { LocationHubService } from '../../services/location-hub.service';
import { AuthService } from '../../services/auth.service';
import { LocationUpdate } from '../../interface/dtos/location-update';

interface MarkerEntry {
  marker: L.Marker;
  lastUpdated: Date;
  userName: string;
  isSelf: boolean;
}

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css'
})
export class MapComponent implements AfterViewInit, OnDestroy {

  private map!: L.Map;
  private entries = new Map<string, MarkerEntry>();
  private locationHub = inject(LocationHubService);
  private authService = inject(AuthService);
  private tooltipTimer?: ReturnType<typeof setInterval>;

  onlineCount = signal(0);

  ngAfterViewInit(): void {
    this.initMap();

    // Restore already-cached friend locations
    this.locationHub.getLocationSnapshot().forEach(loc => this.upsertMarker(loc, false));

    // Restore own cached location
    const selfSnap = this.locationHub.getSelfSnapshot();
    if (selfSnap) this.upsertMarker(selfSnap, true);

    // Live updates
    this.locationHub.locationUpdates$.subscribe(loc => this.upsertMarker(loc, false));
    this.locationHub.selfLocation$.subscribe(loc => this.upsertMarker(loc, true));

    // Refresh tooltip timestamps every 30 s
    this.tooltipTimer = setInterval(() => this.refreshTooltips(), 30_000);
  }

  // ── Map init ──────────────────────────────────────────────────────────────

  private initMap(): void {
    this.map = L.map('map', { zoomControl: false }).setView([20, 78], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
        '&copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
  }

  // ── Marker management ─────────────────────────────────────────────────────

  private upsertMarker(loc: LocationUpdate, isSelf: boolean): void {
    const coord: [number, number] = [loc.coordinate.latitude, loc.coordinate.longitude];
    const lastUpdated = loc.lastUpdated ? new Date(loc.lastUpdated) : new Date();
    const tip = this.tooltipHtml(loc.userName, lastUpdated, isSelf);

    const existing = this.entries.get(loc.userId);
    if (existing) {
      existing.marker.setLatLng(coord);
      existing.lastUpdated = lastUpdated;
      existing.marker.setTooltipContent(tip);
    } else {
      const icon = this.buildIcon(loc.userName, isSelf);
      const marker = L.marker(coord, { icon })
        .bindTooltip(tip, {
          permanent: true,
          direction: 'top',
          offset: [0, -22],
          className: 'lt-tooltip'
        })
        .addTo(this.map);
      this.entries.set(loc.userId, { marker, lastUpdated, userName: loc.userName, isSelf });
      this.onlineCount.set(this.entries.size);
    }
  }

  private buildIcon(userName: string, isSelf: boolean): L.DivIcon {
    const initials = userName.split(/[\s_@]/).map(w => w[0] ?? '').join('').slice(0, 2).toUpperCase();
    const color = isSelf ? '#34d399' : this.colorFor(userName);
    const bg = isSelf ? 'rgba(52,211,153,0.15)' : `${color}18`;

    return L.divIcon({
      className: '',
      html: `
        <div class="lt-marker-outer">
          <div class="lt-marker-ring" style="color:${color}"></div>
          <div class="lt-marker-dot" style="color:${color};background:${bg}">
            ${initials}
          </div>
        </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  }

  private tooltipHtml(userName: string, lastUpdated: Date, isSelf: boolean): string {
    const timeLabel = this.timeAgo(lastUpdated);
    const nameHtml = isSelf
      ? `<b>${userName}</b> <span style="color:#34d399;font-size:10px">(you)</span>`
      : `<b>${userName}</b>`;
    return `<div>${nameHtml}</div><div style="color:#22d3ee;font-size:10px;margin-top:1px">${timeLabel}</div>`;
  }

  private refreshTooltips(): void {
    this.entries.forEach(e =>
      e.marker.setTooltipContent(this.tooltipHtml(e.userName, e.lastUpdated, e.isSelf))
    );
  }

  // ── Public actions (bound in template) ───────────────────────────────────

  fitAllMarkers(): void {
    if (this.entries.size === 0) return;
    const group = L.featureGroup([...this.entries.values()].map(e => e.marker));
    this.map.fitBounds(group.getBounds(), { padding: [70, 70], maxZoom: 14 });
  }

  centerOnSelf(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    const self = [...this.entries.values()].find(e => e.isSelf);
    if (self) {
      this.map.flyTo(self.marker.getLatLng(), 14, { duration: 1.2 });
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private colorFor(name: string): string {
    const palette = ['#22d3ee', '#a78bfa', '#f472b6', '#fb923c', '#818cf8', '#4ade80', '#facc15', '#e879f9'];
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (name.charCodeAt(i) + ((h << 5) - h)) | 0;
    return palette[Math.abs(h) % palette.length];
  }

  private timeAgo(date: Date): string {
    const s = Math.floor((Date.now() - date.getTime()) / 1000);
    if (s < 30)  return 'just now';
    if (s < 60)  return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60)  return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24)  return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  ngOnDestroy(): void {
    if (this.tooltipTimer) clearInterval(this.tooltipTimer);
    // Connection lifecycle is owned by Home — do NOT stop it here
  }
}
