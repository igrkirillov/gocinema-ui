import {
    BookedPlace,
    CurrentHallData,
    CurrentPricingData,
    CurrentTimelineData,
    Hall,
    Movie,
    MovieData, Place,
    Seance,
    SeanceData,
    TimeData
} from "../types";
import {Time} from "./Time";
import {CurrentTimeline} from "./CurrentTimeline";

export function getHallByIdOrThrow(id: number | null, halls: Hall[]): Hall {
    const hall = halls.find(h => h.id === id);
    if (!hall) {
        throw Error(`Hall with id ${id} not found`);
    }
    return hall;
}

export function toMovieData(movie: Movie | null): MovieData {
    return (movie ? {
        id: movie.id,
        uiId: null,
        name: movie.name,
        description: movie.description,
        country: movie.country,
        duration: movie.duration
    } : {
        id: null,
        uiId: new Date().getTime(),
        name: null,
        description: null,
        country: null,
        duration: null
    }) as MovieData;
}

export function toSeanceData(seance: Seance | null): SeanceData {
    return (seance ? {
        id: seance.id,
        uiId: null,
        hall: seance.hall,
        movie: seance.movie,
        start: new Time().fillFromString(seance.start).serialize()
    } : {
        id: null,
        uiId: new Date().getTime(),
        hall: null,
        movie: null,
        start: null
    }) as SeanceData;
}

export function formatTime(data: TimeData): string {
    return data ? ('0' + data.hours).slice(-2) + ":" + ('0' + data.minutes).slice(-2) : "";
}

export function isAllDataSaved(currentHalls: CurrentHallData[] | null, currentPricings: CurrentPricingData[] | null,
                               currentTimeline: CurrentTimelineData | null) {
    return (!currentHalls || currentHalls.length == 0)
        && (!currentPricings || currentPricings.length == 0)
        && (!currentTimeline || !new CurrentTimeline().fillFromData(currentTimeline).hasChanges());
}

export function getSixDays(date: number): number[] {
    const days = [];
    days.push(date)
    const day = new Date(date);
    for (let i = 1; i <= 5; ++i) {
        day.setDate(day.getDate() + 1);
        days.push(day.getTime())
    }
    return days;
}

export function dateToISOFormat(dateTime: number): string {
    if (!dateTime) {
        return "";
    }
    const date = new Date();
    date.setTime(dateTime);
    return `${date.getFullYear()}-${("0"+(date.getMonth()+1)).slice(-2)}-${("0"+date.getDate()).slice(-2)}`;
}

export function dateISOStrToRuFormat(isoDate: string): string {
    if (!isoDate) {
        return "";
    }
    const parts = isoDate.split("-");
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

export function calcCost(bookedPlaces: BookedPlace[]) {
    if (!bookedPlaces) {
        return 0;
    }
    let cost = 0;
    for (const bp of bookedPlaces) {
        if (bp.hallPlace.isVip) {
            cost += bp.movieShow.hall.vipPrice;
        } else {
            cost += bp.movieShow.hall.standardPrice;
        }
    }
    return cost;
}

export function placeToUserStr(place: Place) {
    return `${place.row+1}-${place.col+1}${place.isVip ? "(vip)" : ""}`;
}