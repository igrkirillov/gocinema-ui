import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {Movie, MovieData, MoviesState} from "../../types";
import {getMovie, getMovies, patchMovie, saveMoviePoster, saveNewMovie} from "../../serverApi";
import {getCurrentUser} from "../../store/storeUtils";

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
                    const currentUser = getCurrentUser(thunkApi.getState());
                    return await getMovies(currentUser);
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
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
                    const currentUser = getCurrentUser(thunkApi.getState());
                    let movie;
                    if (!movieData.id) {
                        movie = await saveNewMovie(currentUser, movieData);
                    } else {
                        await patchMovie(currentUser, movieData);
                        movie = await getMovie(currentUser, movieData.id);
                    }
                    // если выбран файл постера, значит надо его загрузить на сервер
                    if (movieData.posterFile) {
                        await saveMoviePoster(currentUser, movie.id, movieData.posterFile);
                        movie = await getMovie(currentUser, movie.id);
                    }
                    return movie;
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
                    const index = state.data.findIndex(el => el.id === action.payload.id);
                    if (index >= 0) {
                        state.data[index] = action.payload;
                    } else {
                        state.data.push(action.payload);
                    }
                },
                rejected: (state, action) => {
                    state.error = action.payload as string;
                },
                settled: (state) => {
                    state.loading = false;
                }
            })
    })
})

export const {fetchMovies, saveMovie} = moviesSlice.actions;
export const {moviesState} = moviesSlice.selectors;