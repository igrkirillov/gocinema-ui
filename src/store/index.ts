import {configureStore} from "@reduxjs/toolkit";
import {moviesSlice} from "../slices/movies";
import {usersSlice} from "../slices/users";

export const store = configureStore({
    reducer: {
        movies: moviesSlice.reducer,
        users: usersSlice.reducer,
    }
})

export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
export type RootState = ReturnType<AppStore['getState']>