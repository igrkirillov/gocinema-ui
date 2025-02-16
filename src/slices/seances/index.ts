import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {Seance, SeanceData, SeancesState} from "../../types";
import config from "../../../config/app.json"
import {saveNewSeance} from "../../serverApi";

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

const initialState = {
    data: [],
    loading: false,
    error: null
} as SeancesState;

export const seancesSlice = createSliceWithThunk({
    name: "seances",
    initialState,
    selectors: {
        seancesState: (state) => state
    },
    reducers: (create) => ({
        fetchSeances: create.asyncThunk<Seance[]>(
            async  (__, thunkApi) => {
                try {
                    const response = await fetch(config.serverUrl + "/movie-shows", {method: "GET"});
                    if (response.ok) {
                        return (await response.json()) as Seance[];
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
                fulfilled: (state, action: PayloadAction<Seance[]>) => {
                    state.data = action.payload ? action.payload : [];
                },
                rejected: (state, action) => {
                    state.error = action.payload as string;
                },
                settled: (state) => {
                    state.loading = false;
                }
            }),
        saveSeance: create.asyncThunk<Seance, SeanceData>(
            async  (seanceData, thunkApi) => {
                try {
                    return await saveNewSeance(seanceData);
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = null;
                },
                fulfilled: (state, action: PayloadAction<Seance>) => {
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

export const {fetchSeances, saveSeance} = seancesSlice.actions;
export const {seancesState} = seancesSlice.selectors;