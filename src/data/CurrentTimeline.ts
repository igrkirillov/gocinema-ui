import {CurrentTimelineData, Seance, SeanceData} from "../types";
import {toSeanceData} from "./dataUtils";

export class CurrentTimeline {
    seances: Seance[];
    changed: SeanceData[];
    deleted: SeanceData[];
    added: SeanceData[];

    constructor() {
        this.seances = [];
        this.changed = [];
        this.deleted = [];
        this.added = [];
    }

    fromSeances(seances: Seance[]): CurrentTimeline {
        this.seances = seances;
        this.changed = [];
        this.deleted = [];
        this.added = [];
        return this;
    }

    fromData(data: CurrentTimelineData): CurrentTimeline {
        this.seances = [];
        if (data.seances) {
            this.seances.push(...data.seances);
        }
        this.changed = [];
        if (data.changed) {
            for (const ch of data.changed) {
                // пересоздаём объекты, чтобы сделать их мутабельными для UI
                this.changed.push({...ch} as SeanceData);
            }
        }
        this.deleted = [];
        if (data.deleted) {
            for (const d of data.deleted) {
                // пересоздаём объекты, чтобы сделать их мутабельными для UI
                this.deleted.push({...d} as SeanceData);
            }
        }
        this.added = [];
        if (data.added) {
            for (const ad of data.added) {
                // пересоздаём объекты, чтобы сделать их мутабельными для UI
                this.added.push({...ad} as SeanceData);
            }
        }
        return this;
    }

    getActualSeances() {
        const actual = [] as SeanceData[];
        this.seances.forEach(s => {
            if (this.changed.some(ch => ch.id === s.id)) {
                actual.push(this.changed.find(ch => ch.id === s.id) as SeanceData);
            } else if (this.deleted.some(d => d.id === s.id)) {
                // skip because it's deleted
            } else {
                actual.push(toSeanceData(s));
            }
        });
        actual.push(...this.added);
        return actual;
    }

    serialize(): CurrentTimelineData {
        return {
            seances: this.seances,
            changed: this.changed,
            deleted: this.deleted,
            added: this.added
        } as CurrentTimelineData;
    }

    hasChanges(): boolean {
        return this.changed.length != 0 || this.deleted.length != 0 || this.added.length != 0;
    }

    addChange(data: SeanceData): CurrentTimeline {
        if (!data.id) {
            // если новый элемент
            const index = this.added.findIndex(ad => ad.newId === data.newId);
            if (index < 0) {
                this.added.push(data);
            } else {
                this.added[index] = data;
            }
        } else {
            // если существующий элемент
            const index = this.changed.findIndex(ch => ch.id === data.id);
            if (index < 0) {
                this.changed.push(data);
            } else {
                this.changed[index] = data;
            }
        }
        return this;
    }

    addDelete(data: SeanceData): CurrentTimeline {
        this.deleted.push(data);
        return this;
    }
}