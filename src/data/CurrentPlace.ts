import {CurrentPlaceData} from "../types";

export class CurrentPlace {
    row: number;
    col: number;
    isVip: boolean;
    isBlocked: boolean;

    constructor(row: number, col: number, isVip: boolean, isBlocked: boolean) {
        this.row = row;
        this.col = col;
        this.isVip = isVip;
        this.isBlocked = isBlocked;
    }

    serialize(): CurrentPlaceData {
        return {
            row: this.row,
            col: this.col,
            isVip: this.isVip,
            isBlocked: this.isBlocked
        } as CurrentPlaceData;
    }
}