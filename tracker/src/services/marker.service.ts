import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import * as L from 'leaflet';
import { PopUpService } from "./popup.service";
@Injectable({
    providedIn: 'root'
})
export class MarkerService {
    http = inject(HttpClient);
    popupService = inject(PopUpService)
    capitals: string = '/data/usa-capitals.geojson';
    static scaledRadius(val: number, maxVal: number): number {
        return 20 * (val / maxVal);
    }
    makeCapitalMarkers(map: L.Map): void {
        this.http.get(this.capitals).subscribe((res: any) => {
            for (const c of res.features) {
                const lon = c.geometry.coordinates[0];
                const lat = c.geometry.coordinates[1];
                const marker = L.marker([lat, lon]);
                marker.addTo(map);
            }
        });
    }

    makeCapitalCircleMarkers(map: L.Map): void {
        this.http.get(this.capitals).subscribe((res: any) => {
            const maxPop = Math.max(...res.features.map((x:any) => x.properties.population), 0);
            for (const c of res.features) {
                const lon = c.geometry.coordinates[0];
                const lat = c.geometry.coordinates[1];
                const circle = L.circleMarker([lat, lon],{
                    radius: MarkerService.scaledRadius(c.properties.population,maxPop)
                });
                circle.bindPopup(this.popupService.makeCapitalPopup(c.properties));
                circle.addTo(map);
            }
        });
    }
}