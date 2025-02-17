import {Hall, Movie, MovieData, Seance, SeanceData, TimeData} from "../types";
import {Time} from "./Time";

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
        name: movie.name,
        description: movie.description,
        country: movie.country,
        duration: movie.duration
    } : {}) as MovieData;
}

export function toSeanceData(seance: Seance | null): SeanceData {
    return (seance ? {
        id: seance.id,
        hall: seance.hall,
        movie: seance.movie,
        start: new Time().fillFromString(seance.start).serialize()
    } : {}) as SeanceData;
}

export function formatTime(data: TimeData): string {
    return data ? ('0' + data.hours).slice(-2) + ":" + ('0' + data.minutes).slice(-2) : "";
}