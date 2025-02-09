import {configureStore} from "@reduxjs/toolkit";
import {moviesSlice} from "../slices/movies";
import {usersSlice} from "../slices/users";
import {hallsSlice} from "../slices/halls";


export const store = configureStore({
    reducer: {
        movies: moviesSlice.reducer,
        users: usersSlice.reducer,
        halls: hallsSlice.reducer
    },
    devTools: true
})

export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
export type RootState = ReturnType<AppStore['getState']>