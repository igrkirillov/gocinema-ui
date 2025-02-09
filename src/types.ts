import {CurrentHall} from "./data/CurrentHall";

export type Movie = {
    id: number
    name: string,
    description: string,
    country: string,
    releaseDate: string
}

type ArrayDataState<T> = {
    data: T[],
    loading: boolean,
    error: string | null
}

export type MoviesState = ArrayDataState<Movie>

export type User = {
    id: number
    login: string,
    role: string
}

export type UsersState = ArrayDataState<User>

export type Hall = {
    id: number
    name: string,
    cols: number,
    rows: number,
    places: Place[]
}

export type Place = {
    id: number,
    row: number,
    col: number,
    isVip: boolean,
    isBlocked: boolean
}

export type HallsState = ArrayDataState<Hall> & {
    currentHalls: CurrentHall[]
}

export type HallParameters = {
    name: string,
    rows: number,
    cols: number,
    places: PlaceParameters[]
}

export type PlaceParameters = {
    row: number,
    col: number,
    isVip: boolean,
    isBlocked: boolean
}