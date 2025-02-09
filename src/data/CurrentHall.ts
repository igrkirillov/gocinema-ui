import {Hall} from "../types";
import {CurrentPlace} from "./CurrentPlace";

export class CurrentHall {
    id: number | null;
    name: string;
    rows: number;
    cols: number;
    places: CurrentPlace[] | null
    constructor(hall: Hall | null) {
        this.id = hall?.id ?? null;
        this.name = hall?.name ?? "noname";
        this.rows = hall?.rows ?? 0;
        this.cols = hall?.cols ?? 0;
        this.places = hall?.places?.map(p => new CurrentPlace(p.row, p.col, p.isVip, p.isBlocked)) ?? [];
    }

    copy(): CurrentHall {
        const copy = new CurrentHall(null);
        copy.id = this.id;
        copy.name = this.name;
        copy.rows = this.rows;
        copy.cols = this.cols;
        copy.places = this.places?.map(p => new CurrentPlace(p.row, p.col, p.isVip, p.isBlocked)) ?? null;
        return copy;
    }

    refill(): CurrentHall {
        const places = this.places;
        this.places = [];
        for (let row = 0; row < this.rows; ++row) {
            for (let col = 0; col < this.cols; ++col) {
                const oldPlace = places?.find(p => p.row === row && p.col === col);
                this.places.push(new CurrentPlace(row, col, !!oldPlace && oldPlace.isVip,
                    !!oldPlace && oldPlace.isBlocked));
            }
        }
        return this;
    }
}