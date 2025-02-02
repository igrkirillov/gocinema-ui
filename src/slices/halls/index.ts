import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {Hall, HallsState} from "../../types";
import config from "../../../config/app.json"

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

const initialState = {
    data: [],
    loading: false,
    error: null
} as HallsState;

export const hallsSlice = createSliceWithThunk({
    name: "halls",
    initialState,
    selectors: {
        halls: (state) => state.data,
        hallsState: (state) => state
    },
    reducers: (create) => ({
        fetchHalls: create.asyncThunk<Hall[]>(
            async  (__, thunkApi) => {
                try {
                    const response = await fetch(config.serverUrl + "/halls", {method: "GET"});
                    if (response.ok) {
                        return await response.json() as Hall[];
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
                fulfilled: (state, action: PayloadAction<Hall[]>) => {
                    state.data = action.payload ? action.payload : [] as Hall[];
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

export const {fetchHalls} = hallsSlice.actions;
export const {halls, hallsState} = hallsSlice.selectors;