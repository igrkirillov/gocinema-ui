export type Movie = {
    id: number
    name: string,
    description: string,
    country: string,
    releaseDate: string
}

export type MoviesState = {
    movies: Movie[],
    loading: boolean,
    error: string | null
}

export type User = {
    id: number
    login: string,
    role: string
}

export type UsersState = {
    users: User[],
    loading: boolean,
    error: string | null
}