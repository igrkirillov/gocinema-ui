import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {CurrentTimelineData, Seance, SeancesState} from "../../types";
import {deleteSeance, getSeances, patchSeance, saveNewSeance} from "../../serverApi";
import {CurrentTimeline} from "../../data/CurrentTimeline";
import {getCurrentUser} from "../../store/storeUtils";

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

const initialState = {
    data: [],
    loading: false,
    error: null,
    currentTimeline: new CurrentTimeline().serialize()
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
                    const currentUser = getCurrentUser(thunkApi.getState());
                    return await getSeances(currentUser);
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
                    // проверка консистентности сетки сеансов перед сохранением
                    new CurrentTimeline().fromData(currentTimeline).checkConsistency();
                    const currentUser = getCurrentUser(thunkApi.getState());
                    for (let add of currentTimeline.added) {
                        await saveNewSeance(currentUser, add);
                    }
                    for (let ch of currentTimeline.changed) {
                        await patchSeance(currentUser, ch);
                    }
                    for (let del of currentTimeline.deleted) {
                        await deleteSeance(currentUser, del.id as number);
                    }
                    return await getSeances(currentUser);
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
        setCurrentTimeline: create.reducer((state, action: PayloadAction<CurrentTimelineData>) => {
            state.currentTimeline = action.payload ? action.payload : new CurrentTimeline().serialize();
            state.error = null;
        })
    })
})

export const {fetchSeances, saveCurrentTimeline, setCurrentTimeline} = seancesSlice.actions;
export const {seancesState} = seancesSlice.selectors;