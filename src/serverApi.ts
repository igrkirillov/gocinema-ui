import config from "../config/app.json";
import {
    BookedPlace,
    BookingTicketParameters,
    CurrentHallData,
    CurrentPricingData,
    Hall,
    HallParameters,
    Movie,
    MovieData,
    MovieParameters,
    PaymentTicketParameters,
    Place,
    PlaceParameters,
    Seance,
    SeanceData,
    SeanceParameters,
    Ticket,
    User
} from "./types";
import {formatTime} from "./data/dataUtils";
import {CurrentHall} from "./data/CurrentHall";

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
        console.log(response)
        throw Error(getErrorMessage(response));
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
        console.log(response)
        throw Error(getErrorMessage(response));
    }
}

export async function createNewHall(user: User, hall: Hall): Promise<Hall> {
    const response = await fetch(config.serverUrl + "/halls",
        {
                method: "POST",
                body: JSON.stringify({
                    name: hall.name,
                    cols: hall.cols,
                    rows: hall.rows,
                    places: new CurrentHall().filleFromParameters(hall.rows, hall.cols).refill().places.map(p => {
                        return {
                            row: p.row,
                            col: p.col
                        } as PlaceParameters;
                    })} as HallParameters),
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader(user)
                },
            });
    if (response.ok) {
        return await response.json() as Hall;
    } else {
        console.log(response)
        throw Error(getErrorMessage(response));
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
        console.log(response)
        throw Error(getErrorMessage(response));
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
        console.log(response)
        throw Error(getErrorMessage(response));
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
                duration: movieData.duration} as MovieParameters),
            headers: {
                'Content-Type': 'application/json',
                ...authHeader(user)
            },
        });
    if (response.ok) {
        return await response.json() as Movie;
    } else {
        console.log(response)
        throw Error(getErrorMessage(response));
    }
}

export async function patchMovie(user: User, movieData: MovieData): Promise<void> {
    const response = await fetch(config.serverUrl + "/movies/" + movieData.id,
        {
            method: "PATCH",
            body: JSON.stringify({
                name: movieData.name,
                description: movieData.description,
                country: movieData.country,
                releaseDate: null,
                duration: movieData.duration} as MovieParameters),
            headers: {
                'Content-Type': 'application/json',
                ...authHeader(user)
            },
        });
    if (!response.ok) {
        console.log(response)
        throw Error(getErrorMessage(response));
    }
}

export async function saveMoviePoster(user: User, id: number, file: File): Promise<void> {
    const response = await fetch(config.serverUrl + `/movies/${id}/poster?fileName=${file.name}`,
        {
            method: "POST",
            body: file,
            headers: {
                'Content-Type': `${file.type}`,
                'Content-Length': `${file.size}`,
                ...authHeader(user)
            },
        });
    if (!response.ok) {
        console.log(response)
        throw Error(getErrorMessage(response));
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
        console.log(response)
        throw Error(getErrorMessage(response));
    }
}

export async function getMovie(user: User, id: number): Promise<Movie> {
    const response = await fetch(config.serverUrl + `/movies/${id}`, {
        method: "GET",
        headers: {
            ...authHeader(user)
        }
    });
    if (response.ok) {
        return await response.json() as Movie;
    } else {
        console.log(response)
        throw Error(getErrorMessage(response));
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
        console.log(response)
        throw Error(getErrorMessage(response));
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
        console.log(response)
        throw Error(getErrorMessage(response));
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
        console.log(response)
        throw Error(getErrorMessage(response));
    }
}

export async function getSeances(user: User): Promise<Seance[]> {
    const response = await fetch(config.serverUrl + "/movie-shows", {
        method: "GET",
        headers: {
            ...authHeader(user)
        }
    });
    if (response.ok) {
        return await response.json() as Seance[];
    } else {
        console.log(response)
        throw Error(getErrorMessage(response));
    }
}

export async function getSeance(user: User, id: number): Promise<Seance> {
    const response = await fetch(config.serverUrl + "/movie-shows/" + id, {
        method: "GET",
        headers: {
            ...authHeader(user)
        }
    });
    if (response.ok) {
        return await response.json() as Seance;
    } else {
        console.log(response)
        throw Error(getErrorMessage(response));
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
        console.log(response)
        throw Error(getErrorMessage(response));
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
        console.log(response)
        throw Error(getErrorMessage(response));
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
        console.log(response)
        throw Error(getErrorMessage(response));
    }
}

export async function getUserByLogin(user: User): Promise<User> {
    const response = await fetch(config.serverUrl + "/users/" + user.login, {
        method: "GET",
        headers: {
            ...authHeader(user)
        }
    });
    if (response.ok) {
        return await response.json() as User;
    } else {
        console.log(response)
        throw Error(getErrorMessage(response));
    }
}

export async function getBookedPlaces(user: User, seanceId: number, seanceDate: string): Promise<BookedPlace[]> {
    const response = await fetch(config.serverUrl + "/booked-places?" +
        "movieShowId=" + seanceId + "&" +
        "date=" + seanceDate, {
        method: "GET",
        headers: {
            ...authHeader(user)
        }
    });
    if (response.ok) {
        return await response.json() as BookedPlace[];
    } else {
        console.log(response)
        throw Error(getErrorMessage(response));
    }
}

export async function makeBookTicket(user: User, places: Place[], seanceDate: string, seance: Seance): Promise<Ticket> {
    const response = await fetch(config.serverUrl + "/tickets/book",
        {
            method: "POST",
            body: JSON.stringify({
                placeIds: places.map(pl => pl.id),
                seanceDate: seanceDate,
                movieShowId: seance.id
            } as BookingTicketParameters),
            headers: {
                'Content-Type': 'application/json',
                ...authHeader(user)
            },
        });
    if (response.ok) {
        return await response.json() as Ticket;
    } else {
        console.log(response)
        throw Error(getErrorMessage(response));
    }
}

export async function makePayTicket(user: User, ticket: Ticket): Promise<Ticket> {
    const response = await fetch(config.serverUrl + `/tickets/${ticket.id}/pay`,
        {
            method: "POST",
            body: JSON.stringify({
                card: "9999 9999 9999 9999"
            } as PaymentTicketParameters),
            headers: {
                'Content-Type': 'application/json',
                ...authHeader(user)
            },
        });
    if (response.ok) {
        return await response.json() as Ticket;
    } else {
        console.log(response)
        throw Error(getErrorMessage(response));
    }
}

function getErrorMessage(r: Response) {
    if (r.status == 401) {
        return "Неправильный логин или пароль!"
    } else if (r.status == 403) {
        return "Нет прав!"
    } else if (!r.statusText){
        return r.statusText;
    } else {
        return "Неизвестная ошибка";
    }

}

function authHeader(user: User) {
    return {
        "Authorization": `Basic ${window.btoa(user.login + ":" + user.password)}`
    };
}