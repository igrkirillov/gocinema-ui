import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {BookedPlace, BuyingState, Place, Seance, Ticket} from "../../types";
import {getBookedPlaces, getSeance, makeBookTicket, makePayTicket} from "../../serverApi";
import {getCurrentUser} from "../../store/storeUtils";

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

const initialState = {
    data: [],
    loading: false,
    error: null,
    orderPlaces: [],
    seance: null,
    seanceDate: "",
    bookedTicket: null
} as BuyingState;


export const buyingSlice = createSliceWithThunk({
    name: "buying",
    initialState,
    selectors: {
        orderPlaces: (state) => state.orderPlaces,
        buyingState: (state) => state
    },
    reducers: (create) => ({
        loadBuying: create.asyncThunk<{bookedPlaces: BookedPlace[], seance: Seance, seanceDate: string}, {seanceId: number, seanceDate: string}>(
            async  ({seanceId, seanceDate}, thunkApi) => {
                try {
                    console.log("seanceDate " + seanceDate)
                    const currentUser = getCurrentUser(thunkApi.getState());
                    return {
                        bookedPlaces: await getBookedPlaces(currentUser, seanceId, seanceDate),
                        seance: await getSeance(currentUser, seanceId),
                        seanceDate: seanceDate
                    };
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = null;
                },
                fulfilled: (state, action: PayloadAction<{bookedPlaces: BookedPlace[], seance: Seance, seanceDate: string}>) => {
                    state.data = action.payload.bookedPlaces;
                    state.seance = action.payload.seance;
                    state.seanceDate = action.payload.seanceDate;
                    state.orderPlaces = [];
                    state.bookedTicket = null;
                },
                rejected: (state, action) => {
                    state.error = action.payload as string;
                },
                settled: (state) => {
                    state.loading = false;
                }
            }),
        addOrderPlace: create.reducer((state, action: PayloadAction<Place>) => {
            state.orderPlaces.push(action.payload);
        }),
        removeOrderPlace: create.reducer((state, action: PayloadAction<Place>) => {
            const index = state.orderPlaces.findIndex(el => el.id === action.payload.id);
            if (index >= 0) {
                state.orderPlaces.splice(index, 1);
            }
        }),
        bookTicket: create.asyncThunk<Ticket>(
            async  (__, thunkApi) => {
                try {
                    const currentUser = getCurrentUser(thunkApi.getState());
                    const orderPlaces = (thunkApi.getState()["buying"] as BuyingState).orderPlaces;
                    const seanceDate = (thunkApi.getState()["buying"] as BuyingState).seanceDate;
                    const seance = (thunkApi.getState()["buying"] as BuyingState).seance;
                    return await makeBookTicket(currentUser, orderPlaces, seanceDate, seance as Seance);
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = null;
                },
                fulfilled: (state, action: PayloadAction<Ticket>) => {
                    state.bookedTicket = action.payload;
                    state.orderPlaces = [];
                },
                rejected: (state, action) => {
                    state.error = action.payload as string;
                },
                settled: (state) => {
                    state.loading = false;
                }
            }),
        payTicket: create.asyncThunk<Ticket>(
            async  (__, thunkApi) => {
                try {
                    const currentUser = getCurrentUser(thunkApi.getState());
                    const bookedTicket = (thunkApi.getState()["buying"] as BuyingState).bookedTicket as Ticket;
                    return await makePayTicket(currentUser, bookedTicket);
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = null;
                },
                fulfilled: (state, action: PayloadAction<Ticket>) => {
                    state.bookedTicket = action.payload;
                    state.orderPlaces = [];
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

export const {loadBuying, addOrderPlace, removeOrderPlace, bookTicket, payTicket} = buyingSlice.actions;
export const {buyingState, orderPlaces} = buyingSlice.selectors;