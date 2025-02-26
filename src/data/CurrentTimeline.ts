import {CurrentTimelineData, Seance, SeanceData} from "../types";
import {formatTime, toSeanceData} from "./dataUtils";
import {Time} from "./Time";

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

    fillFromSeances(seances: Seance[]): CurrentTimeline {
        this.seances = seances;
        this.changed = [];
        this.deleted = [];
        this.added = [];
        return this;
    }

    fillFromData(data: CurrentTimelineData): CurrentTimeline {
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
            const index = this.added.findIndex(ad => ad.uiId === data.uiId);
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

    /**
     * Проверить консистентность сетки сеансов.
     * Если сетка не консистентна, то выбросить исключение Error.
     */
    checkConsistency() {
        const seances = this.getActualSeances();
        const hallIds = [...new Set(seances.map(s => s.hall.id))];

        for (const hallId of hallIds) {
            const hallSeances = seances.filter(s => s.hall.id === hallId)
                .sort((s1, s2) => new Time().fillFromTimeData(s1.start).compare(s2.start));
            for (let i = 0; i < hallSeances.length; ++i) {
                if (i !== hallSeances.length-1) {
                    const currentEnd = new Time().fillFromTimeData(hallSeances[i].start)
                        .addMinutes(hallSeances[i].movie.duration);
                    const nextStart = new Time().fillFromTimeData(hallSeances[i+1].start);
                    if (nextStart.compare(currentEnd) < 0) {
                        throw new Error("Сетка сеансов некорректна. Имеется пересечение. " +
                            `${hallSeances[i].hall.name} 
                             ${hallSeances[i].movie.name}
                             ${formatTime(hallSeances[i].start)}
                             (${hallSeances[i].movie.duration} мин)
                              и  ${hallSeances[i+1].movie.name}
                             ${formatTime(hallSeances[i+1].start)}
                             `)
                    }
                }
            }
        }
    }
}