import {configureStore} from "@reduxjs/toolkit";
import {moviesSlice} from "../slices/movies";
import {usersSlice} from "../slices/users";
import {hallsSlice} from "../slices/halls";
import {seancesSlice} from "../slices/seances";


export const store = configureStore({
    reducer: {
        movies: moviesSlice.reducer,
        users: usersSlice.reducer,
        halls: hallsSlice.reducer,
        seances: seancesSlice.reducer
    },
    devTools: true
})

export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
export type RootState = ReturnType<AppStore['getState']>