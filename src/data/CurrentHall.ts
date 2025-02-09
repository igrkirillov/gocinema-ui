import {CurrentHallData, Hall} from "../types";
import {CurrentPlace} from "./CurrentPlace";

export class CurrentHall {
    id: number | null;
    name: string;
    rows: number;
    cols: number;
    places: CurrentPlace[]

    constructor() {
        this.id = null;
        this.name = "noname";
        this.rows = 0;
        this.cols = 0;
        this.places = [];
    }

    fillFromHall(hall: Hall | null): CurrentHall {
        this.id = hall?.id ?? null;
        this.name = hall?.name ?? "noname";
        this.rows = hall?.rows ?? 0;
        this.cols = hall?.cols ?? 0;
        this.places = hall?.places?.map(p => new CurrentPlace(p.row, p.col, p.isVip, p.isBlocked)) ?? [];
        return this;
    }

    fillFromData(data: CurrentHallData | null) {
        this.id = data?.id ?? null;
        this.name = data?.name ?? "noname";
        this.rows = data?.rows ?? 0;
        this.cols = data?.cols ?? 0;
        this.places = data?.places?.map(p => new CurrentPlace(p.row, p.col, p.isVip, p.isBlocked)) ?? [];
        return this;
    }

    copy(): CurrentHall {
        const copy = new CurrentHall();
        copy.id = this.id;
        copy.name = this.name;
        copy.rows = this.rows;
        copy.cols = this.cols;
        copy.places = this.places.map(p => new CurrentPlace(p.row, p.col, p.isVip, p.isBlocked)) ?? [];
        return copy;
    }

    refill(): CurrentHall {
        const places = this.places;
        this.places = [];
        for (let row = 0; row < this.rows; ++row) {
            for (let col = 0; col < this.cols; ++col) {
                const oldPlace = places.find(p => p.row === row && p.col === col);
                this.places.push(new CurrentPlace(row, col, !!oldPlace && oldPlace.isVip,
                    !!oldPlace && oldPlace.isBlocked));
            }
        }
        return this;
    }

    setVipPlace(row: number, col: number): CurrentHall {
        this.setAttributesForPlace(true, false, this.findPlace(row, col));
        return this;
    }

    setBlockedPlace(row: number, col: number): CurrentHall {
        this.setAttributesForPlace(false, true, this.findPlace(row, col));
        return this;
    }

    setStandardPlace(row: number, col: number): CurrentHall {
        this.setAttributesForPlace(false, false, this.findPlace(row, col));
        return this;
    }

    findPlace(row: number, col: number): CurrentPlace | null {
        const index = this.places.findIndex(p => p.row === row && p.col === col);
        if (index >= 0) {
            return this.places[index];
        }
        return null;
    }

    setAttributesForPlace(isVip: boolean, isBlocked: boolean, place: CurrentPlace | null) {
        if (place) {
            place.isVip = isVip;
            place.isBlocked = isBlocked;
        }
    }

    serialize():CurrentHallData {
        return {
            id: this.id,
            name: this.name,
            rows: this.rows,
            cols: this.cols,
            places: this.places.map(p => p.serialize())
        } as CurrentHallData;
    }
}