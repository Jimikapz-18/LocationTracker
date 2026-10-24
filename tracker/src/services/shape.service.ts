import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class ShapeService{
    http = inject(HttpClient);
    
    getStateShapes(){
        return this.http.get('/data/gz_2010_us_040_00_5m.json');
    }
}