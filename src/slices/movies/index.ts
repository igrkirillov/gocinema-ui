import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {Movie, MovieData, MoviesState} from "../../types";
import config from "../../../config/app.json"
import {saveNewMovie} from "../../serverApi";

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

const initialState = {
    data: [],
    loading: false,
    error: null
} as MoviesState;

export const moviesSlice = createSliceWithThunk({
    name: "movies",
    initialState,
    selectors: {
        moviesState: (state) => state
    },
    reducers: (create) => ({
        fetchMovies: create.asyncThunk<Movie[]>(
            async  (__, thunkApi) => {
                try {
                    const response = await fetch(config.serverUrl + "/movies", {method: "GET"});
                    if (response.ok) {
                        return (await response.json()) as Movie[];
                    } else {
                        return thunkApi.rejectWithValue(response.statusText);
                    }
                } catch (e) {
                    return thunkApi.rejectWithValue(e);
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = null;
                },
                fulfilled: (state, action: PayloadAction<Movie[]>) => {
                    state.data = action.payload ? action.payload : [];
                },
                rejected: (state, action) => {
                    state.error = action.payload as string;
                },
                settled: (state) => {
                    state.loading = false;
                }
            }),
        saveMovie: create.asyncThunk<Movie, MovieData>(
            async  (movieData, thunkApi) => {
                try {
                    return await saveNewMovie(movieData);
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = null;
                },
                fulfilled: (state, action: PayloadAction<Movie>) => {
                    state.data.push(action.payload);
                },
                rejected: (state, action) => {
                    state.error = action.payload as string;
                },
                settled: (state) => {
                    state.loading = false;
                }
            }),
    })
})

export const {fetchMovies, saveMovie} = moviesSlice.actions;
export const {moviesState} = moviesSlice.selectors;