import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {CurrentTimelineData, Seance, SeanceData, SeancesState} from "../../types";
import config from "../../../config/app.json"
import {deleteSeance, getSeances, patchSeance, saveNewSeance} from "../../serverApi";

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
                    return await getSeances();
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
        saveCurrentTimeline: create.asyncThunk<Seance[], CurrentTimelineData>(
            async  (currentTimeline, thunkApi) => {
                try {
                    for (let i = 0; i < currentTimeline.added.length; ++i) {
                        await saveNewSeance(currentTimeline.added[i]);
                    }
                    for (let i = 0; i < currentTimeline.changed.length; ++i) {
                        await patchSeance(currentTimeline.changed[i]);
                    }
                    for (let i = 0; i < currentTimeline.deleted.length; ++i) {
                        await deleteSeance(currentTimeline.deleted[i].id as number);
                    }
                    return await getSeances();
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = null;
                },
                fulfilled: (state, action: PayloadAction<Seance[]>) => {
                    state.data = [];
                    state.data.push(...action.payload);
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

export const {fetchSeances, saveCurrentTimeline} = seancesSlice.actions;
export const {seancesState} = seancesSlice.selectors;