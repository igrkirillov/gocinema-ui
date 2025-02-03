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
    rows: number
}

export type HallsState = ArrayDataState<Hall>

export type HallParameters = {
    name: string,
    rows: number,
    cols: number
}