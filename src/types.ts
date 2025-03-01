import {Movie} from "./components/client/movie";

export type Movie = {
    id: number
    name: string,
    description: string,
    country: string,
    releaseDate: string,
    duration: number
}

type ArrayDataState<T> = LoadingState & {
    data: T[],
}

type LoadingState = {
    loading: boolean,
    error: string | null
}

export type MoviesState = ArrayDataState<Movie>

export type User = {
    id: number | null
    login: string,
    password: string | null
    role: string | null
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
    id: number | null,
    /**
     * Служит для идентификации добавленного элемента.
     * Заполняется при создании на UI.
     */
    uiId: number | null,
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

export type TimeData = {
    hours: number,
    minutes: number
}

export type Seance = {
    id: number,
    hall: Hall,
    movie: Movie,
    start: string
}

export type SeanceData = {
    id: number | null,
    /**
     * Служит для идентификации добавленного элемента.
     * Заполняется при создании на UI.
     */
    uiId: number | null,
    hall: Hall,
    movie: Movie,
    start: TimeData,
}

export type SeanceParameters = {
    hallId: number,
    movieId: number,
    start: string
}

export type SeancesState = ArrayDataState<Seance> & {
    currentTimeline: CurrentTimelineData
}

export type CurrentTimelineData = {
    seances: Seance[],
    changed: SeanceData[],
    deleted: SeanceData[],
    added: SeanceData[]
}

export type OptionsState = LoadingState & {
    isSaleOpened: boolean | undefined
}

// client

export type ClientState = ArrayDataState<Seance> & {
    currentDate: number
}

export type DayItem = {
    movie: Movie,
    halls: Hall[],
    timesMap: DayTimes
}

export type DayTimes = {
    [key: number]: Seance[] //key hallId
}

export type AuthState = LoadingState & {
    user: User | null
}

export type SeancePlace = {
    id: number,
    movieShow: Seance,
    hallPlace: Place,
    isBooked: boolean
}

export type BuyingState = ArrayDataState<SeancePlace> & {
    seance: Seance,
    orderPlaces: SeancePlace[]
}