import { Coordinate } from "../Coordinate";

export interface LocationUpdate {
    userId: string;
    userName: string;
    coordinate: Coordinate;
    lastUpdated: string; // ISO 8601 datetime string
}