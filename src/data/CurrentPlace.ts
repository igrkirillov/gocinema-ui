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
}