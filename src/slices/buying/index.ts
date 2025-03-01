import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {BuyingState, Seance, SeancePlace, Ticket} from "../../types";
import {bookTicket, getSeancePlaces, makeBookTicket, makePayTicket} from "../../serverApi";
import {getCurrentUser} from "../../store/storeUtils";

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

const initialState = {
    data: [],
    loading: false,
    error: null,
    orderPlaces: [],
    seance: {} as Seance,
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
        loadBuying: create.asyncThunk<SeancePlace[], number>(
            async  (seanceId, thunkApi) => {
                try {
                    const currentUser = getCurrentUser(thunkApi.getState());
                    return await getSeancePlaces(currentUser, seanceId);
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = null;
                },
                fulfilled: (state, action: PayloadAction<SeancePlace[]>) => {
                    state.data = action.payload;
                    // считаем, что хотя бы одно место должно быть в зале
                    state.seance = action.payload[0].movieShow;
                },
                rejected: (state, action) => {
                    state.error = action.payload as string;
                },
                settled: (state) => {
                    state.loading = false;
                }
            }),
        addOrderPlace: create.reducer((state, action: PayloadAction<SeancePlace>) => {
            state.orderPlaces.push(action.payload);
        }),
        removeOrderPlace: create.reducer((state, action: PayloadAction<SeancePlace>) => {
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
                    return await makeBookTicket(currentUser, orderPlaces);
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