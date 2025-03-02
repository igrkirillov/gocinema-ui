import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {CurrentHallData, CurrentPricingData, Hall, HallsState} from "../../types";
import {deleteHallById, getHalls, patchHall, savePricing, createNewHall} from "../../serverApi";
import {getHallByIdOrThrow} from "../../data/dataUtils";
import {getCurrentUser} from "../../store/storeUtils";

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

const initialState = {
    data: [],
    loading: false,
    error: null,
    currentHalls: [],
    currentPricings: []
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
                    const currentUser = getCurrentUser(thunkApi.getState());
                    return await getHalls(currentUser);
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
                    const currentUser = getCurrentUser(thunkApi.getState());
                    await deleteHallById(currentUser, hallId);
                    return await getHalls(currentUser);
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
        createHall: create.asyncThunk<Hall, Hall>(
            async  (hall, thunkApi) => {
                try {
                    const currentUser = getCurrentUser(thunkApi.getState());
                    return await createNewHall(currentUser, hall);
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = null;
                },
                fulfilled: (state, action: PayloadAction<Hall>) => {
                    state.data.push(action.payload);
                },
                rejected: (state, action) => {
                    state.error = action.payload as string;
                },
                settled: (state) => {
                    state.loading = false;
                }
            }),
        updateCurrentHall: create.reducer((state, action: PayloadAction<CurrentHallData>) => {
            const index = state.currentHalls.findIndex(h => h.id === action.payload.id);
            if (index >= 0) {
                state.currentHalls[index] = action.payload;
            } else {
                state.currentHalls.push(action.payload);
            }
        }),
        cancelCurrentHall: create.reducer((state, action: PayloadAction<CurrentHallData>) => {
            const index = state.currentHalls && state.currentHalls.findIndex(h => h.id === action.payload.id);
            if (index && index >= 0) {
                state.currentHalls.splice(index, 1);
            }
        }),
        saveCurrentHall: create.asyncThunk<Hall, CurrentHallData>(
            async  (currentHall, thunkApi) => {
                try {
                    // @ts-ignore
                    const currentUser = getCurrentUser(thunkApi.getState());
                    await patchHall(currentUser, currentHall, getHallByIdOrThrow(currentHall.id,
                        ((thunkApi.getState() as {[key: string]: {}})["halls"] as HallsState).data));
                    return getHallByIdOrThrow(currentHall.id, await getHalls(currentUser));
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = null;
                },
                fulfilled: (state, action: PayloadAction<Hall>) => {
                    const currentHallIndex = state.currentHalls.findIndex(h => h.id === action.payload.id);
                    state.currentHalls.splice(currentHallIndex, 1);
                    const hallIndex = state.data.findIndex(h => h.id === action.payload.id);
                    state.data[hallIndex] = action.payload;
                },
                rejected: (state, action) => {
                    state.error = action.payload as string;
                },
                settled: (state) => {
                    state.loading = false;
                }
            }),
        updateCurrentPricing: create.reducer((state, action: PayloadAction<CurrentPricingData>) => {
            const index = state.currentPricings.findIndex(h => h.id === action.payload.id);
            if (index >= 0) {
                state.currentPricings[index] = action.payload;
            } else {
                state.currentPricings.push(action.payload);
            }
        }),
        cancelCurrentPricing: create.reducer((state, action: PayloadAction<CurrentPricingData>) => {
            const index = state.currentPricings && state.currentPricings.findIndex(h => h.id === action.payload.id);
            if (index && index >= 0) {
                state.currentPricings.splice(index, 1);
            }
        }),
        saveCurrentPricing: create.asyncThunk<Hall, CurrentPricingData>(
            async  (currentPricing, thunkApi) => {
                try {
                    // @ts-ignore
                    const currentUser = getCurrentUser(thunkApi.getState());
                    const hall = getHallByIdOrThrow(currentPricing.id, ((thunkApi.getState() as {[key: string]: {}})["halls"] as HallsState).data);
                    await savePricing(currentUser, currentPricing, hall);
                    return getHallByIdOrThrow(currentPricing.id, await getHalls(currentUser));
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.errorPricing = null;
                },
                fulfilled: (state, action: PayloadAction<Hall>) => {
                    const currentHallIndex = state.currentPricings.findIndex(h => h.id === action.payload.id);
                    state.currentPricings.splice(currentHallIndex, 1);
                    const hallIndex = state.data.findIndex(h => h.id === action.payload.id);
                    state.data[hallIndex] = action.payload;
                },
                rejected: (state, action) => {
                    state.errorPricing = action.payload as string;
                },
                settled: (state) => {
                    state.loading = false;
                }
            })
    })
})

export const {fetchHalls, deleteHall, createHall, updateCurrentHall, saveCurrentHall, cancelCurrentHall,
    updateCurrentPricing, saveCurrentPricing, cancelCurrentPricing} = hallsSlice.actions;
export const {halls, hallsState} = hallsSlice.selectors;