import {TimeData} from "../types";

export class Time {
    hours: number
    minutes: number

    constructor() {
        this.hours = 0;
        this.minutes = 0;
    }

    fillFromTimeData(data: TimeData | null): Time {
        this.hours = data?.hours ?? 0;
        this.minutes = data?.minutes ?? 0;
        return this;
    }

    fillFromString(time: string | null): Time {
        if (time) {
            const parts = time.split(":") as string[];
            this.hours = Number.parseInt(parts[0].trim());
            this.minutes = Number.parseInt(parts[1].trim());
        } else {
            this.hours = 0;
            this.minutes = 0;
        }
        return this;
    }

    serialize():TimeData {
        return {
            hours: this.hours,
            minutes: this.minutes
        } as TimeData;
    }

    compare(other: TimeData | Time): number {
        if (this.compareByHours(other) > 1) {
            return 1;
        } else if (this.compareByHours(other) < 1) {
            return -1;
        } else {
            if (this.compareByMinutes(other) > 1) {
                return 1;
            } else if (this.compareByMinutes(other) < 1) {
                return -1;
            } else {
                return 0;
            }
        }
    }

    compareByHours(other: TimeData) {
        if (this.hours > other.hours) {
            return 1;
        } else if (this.hours < other.hours) {
            return -1;
        } else {
            return 0;
        }
    }
    compareByMinutes(other: TimeData) {
        if (this.hours > other.hours) {
            return 1;
        } else if (this.hours < other.hours) {
            return -1;
        } else {
            return 0;
        }
    }

    toMinutes(): number {
        return this.hours * 60 + this.minutes;
    }

    addMinutes(minutes: number) {
        const tempHours = this.hours + +Number(minutes / 60).toFixed(0);
        const tempMinutes = this.minutes + minutes % 60;
        this.hours = Math.min(23, tempHours);
        this.minutes = Math.min(59, tempMinutes);
        return this;
    }
}