import {Hall, Movie, MovieData, TimeData} from "../types";

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

export function formatTime(data: TimeData): string {
    return ('0' + data.hours).slice(-2) + ":" + ('0' + data.minutes).slice(-2);
}