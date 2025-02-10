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
    places: Place[],
    vipPrice: number,
    standardPrice: number
}

export type Place = {
    id: number,
    row: number,
    col: number,
    isVip: boolean,
    isBlocked: boolean
}

export type HallsState = ArrayDataState<Hall> & {
    currentHalls: CurrentHallData[],
    currentPricings: CurrentPricingData[]
}

export type HallParameters = {
    name: string,
    rows: number,
    cols: number,
    places: PlaceParameters[],
    standardPrice: number,
    vipPrice: number
}

export type PlaceParameters = {
    row: number,
    col: number,
    isVip: boolean,
    isBlocked: boolean
}

export type CurrentHallData = {
    id: number | null,
    name: string,
    rows: number,
    cols: number,
    places: CurrentPlaceData[]
}

export type CurrentPlaceData = {
    row: number,
    col: number,
    isVip: boolean,
    isBlocked: boolean
}

export type CurrentPricingData = {
    id: number | null,
    vipPrice: number,
    standardPrice: number
}

export type MovieData = {
    id: number | null
    name: string,
    description: string,
    country: string,
    duration: number
}

export type MovieParameters = {
    name: string,
    description: string,
    country: string,
    duration: number
}