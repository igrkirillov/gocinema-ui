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
        this.seances = data.seances;
        this.changed = data.changed;
        this.deleted = data.deleted;
        this.added = data.added;
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
            this.added.push(data);
        } else {
            this.changed.push(data);
        }
        return this;
    }

    addDelete(data: SeanceData): CurrentTimeline {
        this.deleted.push(data);
        return this;
    }
}