import {Hall} from "../types";

export class CurrentHall {
    id: number | null;
    rows: number;
    cols: number;
    constructor(hall: Hall | null | CurrentHall) {
        this.id = hall?.id ?? null;
        this.rows = hall?.rows ?? 0;
        this.cols = hall?.cols ?? 0;
    }
}