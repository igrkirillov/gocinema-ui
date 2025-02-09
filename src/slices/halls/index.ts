import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {Hall, HallsState} from "../../types";
import {createNextHall, deleteHallById, getAllHalls} from "../../serverApi";
import {CurrentHall} from "../../data/CurrentHall";

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

const initialState = {
    data: [],
    loading: false,
    error: null,
    currentHalls: []
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
                    return await getAllHalls();
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
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
            }),
        deleteHall: create.asyncThunk<Hall[], number>(
            async  (hallId, thunkApi) => {
                try {
                    await deleteHallById(hallId);
                    return await getAllHalls();
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
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
            }),
        createNewHall: create.asyncThunk<Hall[], Hall[]>(
            async  (allHalls, thunkApi) => {
                try {
                    await createNextHall(allHalls);
                    return await getAllHalls();
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
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
            }),
        updateCurrentHall: create.reducer((state, action: PayloadAction<CurrentHall>) => {
            const index = state.currentHalls && state.currentHalls.findIndex(h => h.id === action.payload.id);
            if (index && index >= 0) {
                state.currentHalls[index] = action.payload;
            } else {
                state.currentHalls.push(action.payload);
            }
        }),
        saveCurrentHall: create.asyncThunk<null, CurrentHall>(
            async  (currentHall, thunkApi) => {
                try {
                    // saving
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = null;
                },
                fulfilled: (state, action: PayloadAction<CurrentHall>) => {
                    const index = state.currentHalls.findIndex(h => h.id === action.payload.id);
                    state.currentHalls.splice(index, 1);
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

export const {fetchHalls, deleteHall, createNewHall, updateCurrentHall, saveCurrentHall} = hallsSlice.actions;
export const {halls, hallsState} = hallsSlice.selectors;