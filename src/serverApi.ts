import config from "../config/app.json";
import {
    CurrentHallData,
    CurrentPricingData,
    Hall,
    HallParameters,
    Movie,
    MovieData,
    MovieParameters,
    PlaceParameters, Seance, SeanceData, SeanceParameters, User
} from "./types";
import {formatTime} from "./data/dataUtils";

export async function getHalls(user: User): Promise<Hall[]> {
    const response = await fetch(config.serverUrl + "/halls", {
        method: "GET",
        headers: {
            ...authHeader(user)
        }
    });
    if (response.ok) {
        return await response.json() as Hall[];
    } else {
        throw Error(response.statusText);
    }
}

export async function deleteHallById(user: User, hallId: number) {
    const response = await fetch(config.serverUrl + "/halls/" + hallId, {
        method: "DELETE",
        headers: {
            ...authHeader(user)
        }
    });
    if (!response.ok) {
        throw Error(response.statusText);
    }
}

export async function createNextHall(user: User, allHalls: Hall[]): Promise<Hall> {
    const maxNumber = allHalls.map(h => Number(h.name.substring(4, h.name.length)))
        .reduce((prev, current) => Math.max(prev, current), 0);
    const response = await fetch(config.serverUrl + "/halls",
        {
                method: "POST",
                body: JSON.stringify({name: `Зал ${maxNumber + 1}`, cols: 0, rows: 0} as HallParameters),
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader(user)
                },
            });
    if (response.ok) {
        return await response.json() as Hall;
    } else {
        throw Error(response.statusText);
    }
}

export async function patchHall(user: User, currentHall: CurrentHallData, hall: Hall): Promise<void> {
    const response = await fetch(config.serverUrl + "/halls/" + currentHall.id,
        {
            method: "PATCH",
            body: JSON.stringify({
                name: currentHall.name,
                cols: currentHall.cols,
                rows: currentHall.rows,
                places: currentHall.places?.map(p => {
                    return {
                        row: p.row,
                        col: p.col,
                        isVip: p.isVip,
                        isBlocked: p.isBlocked
                    } as PlaceParameters
                }),
                standardPrice: hall.standardPrice,
                vipPrice: hall.vipPrice} as HallParameters),
            headers: {
                'Content-Type': 'application/json',
                ...authHeader(user)
            },
        });
    if (!response.ok) {
        throw Error(response.statusText);
    }
}

export async function savePricing(user: User, currentPricing: CurrentPricingData, hall: Hall): Promise<void> {
    const response = await fetch(config.serverUrl + "/halls/" + currentPricing.id,
        {
            method: "PATCH",
            body: JSON.stringify({
                name: hall.name,
                cols: hall.cols,
                rows: hall.rows,
                places: hall.places?.map(p => {
                    return {
                        row: p.row,
                        col: p.col,
                        isVip: p.isVip,
                        isBlocked: p.isBlocked
                    } as PlaceParameters
                }),
                standardPrice: currentPricing.standardPrice,
                vipPrice: currentPricing.vipPrice} as HallParameters),
            headers: {
                'Content-Type': 'application/json',
                ...authHeader(user)
            },
        });
    if (!response.ok) {
        throw Error(response.statusText);
    }
}

export async function saveNewMovie(user: User, movieData: MovieData): Promise<Movie> {
    const response = await fetch(config.serverUrl + "/movies",
        {
            method: "POST",
            body: JSON.stringify({
                name: movieData.name,
                description: movieData.description,
                country: movieData.country,
                releaseDate: null,
                duration: 120} as MovieParameters),
            headers: {
                'Content-Type': 'application/json',
                ...authHeader(user)
            },
        });
    if (response.ok) {
        return await response.json() as Movie;
    } else {
        throw Error(response.statusText);
    }
}

export async function getMovies(user: User): Promise<Movie[]> {
    const response = await fetch(config.serverUrl + "/movies", {
        method: "GET",
        headers: {
            ...authHeader(user)
        }
    });
    if (response.ok) {
        return await response.json() as Movie[];
    } else {
        throw Error(response.statusText);
    }
}

export async function saveNewSeance(user: User, data: SeanceData): Promise<Seance> {
    const response = await fetch(config.serverUrl + "/movie-shows",
        {
            method: "POST",
            body: JSON.stringify({
                hallId: data.hall.id,
                movieId: data.movie.id,
                start: formatTime(data.start)
            } as SeanceParameters),
            headers: {
                'Content-Type': 'application/json',
                ...authHeader(user)
            },
        });
    if (response.ok) {
        return await response.json() as Seance;
    } else {
        throw Error(response.statusText);
    }
}

export async function patchSeance(user: User, data: SeanceData): Promise<void> {
    const response = await fetch(config.serverUrl + "/movie-shows/" + data.id,
        {
            method: "PATCH",
            body: JSON.stringify({
                hallId: data.hall.id,
                movieId: data.movie.id,
                start: formatTime(data.start)
            } as SeanceParameters),
            headers: {
                'Content-Type': 'application/json',
                ...authHeader(user)
            },
        });
    if (!response.ok) {
        throw Error(response.statusText);
    }
}

export async function deleteSeance(user: User, id: number): Promise<void> {
    const response = await fetch(config.serverUrl + "/movie-shows/" + id,
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                ...authHeader(user)
            },
        });
    if (!response.ok) {
        throw Error(response.statusText);
    }
}

export async function getSeances(user: User): Promise<Seance[]> {
    console.debug(user)
    const response = await fetch(config.serverUrl + "/movie-shows", {
        method: "GET",
        headers: {
            ...authHeader(user)
        }
    });
    if (response.ok) {
        return await response.json() as Seance[];
    } else {
        throw Error(response.statusText);
    }
}

export async function getOption(user: User, key: string): Promise<string> {
    const response = await fetch(config.serverUrl + "/app-options/" + key, {
        method: "GET",
        headers: {
            ...authHeader(user)
        }
    });
    if (response.ok) {
        return await response.text();
    } else {
        throw Error(response.statusText);
    }
}

export async function saveOption(user: User, key: string, data: string): Promise<void> {
    const response = await fetch(config.serverUrl + "/app-options/" + key,
        {
            method: "POST",
            body: data,
            headers: {
                'Content-Type': 'text/plain',
                ...authHeader(user)
            },
        });
    if (!response.ok) {
        throw Error(response.statusText);
    }
}

export async function getUsers(user: User): Promise<User[]> {
    const response = await fetch(config.serverUrl + "/users", {
        method: "GET",
        headers: {
            ...authHeader(user)
        }
    });
    if (response.ok) {
        return await response.json() as User[];
    } else {
        throw Error(response.statusText);
    }
}

export function authHeader(user: User) {
    return {
        "Authorization": `Basic ${window.btoa(user.login + ":" + user.password)}`
    };
}