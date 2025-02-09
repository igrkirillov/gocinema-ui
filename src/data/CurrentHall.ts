import {Hall} from "../types";
import {CurrentPlace} from "./CurrentPlace";

export class CurrentHall {
    id: number | null;
    rows: number;
    cols: number;
    places: CurrentPlace[] | null
    constructor(hall: Hall | null) {
        this.id = hall?.id ?? null;
        this.rows = hall?.rows ?? 0;
        this.cols = hall?.cols ?? 0;
        this.places = hall?.places?.map(p => new CurrentPlace(p.row, p.col, p.isVip, p.isBlocked)) ?? null;
    }

    copy(): CurrentHall {
        const copy = new CurrentHall(null);
        copy.id = this.id;
        copy.rows = this.rows;
        copy.cols = this.cols;
        copy.places = this.places?.map(p => new CurrentPlace(p.row, p.col, p.isVip, p.isBlocked)) ?? null;
        return copy;
    }
}