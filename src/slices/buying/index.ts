import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {BuyingState, Place, Seance, SeancePlace} from "../../types";
import {getSeancePlaces} from "../../serverApi";
import {getCurrentUser} from "../../store/storeUtils";

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

const initialState = {
    data: [],
    loading: false,
    error: null,
    orderPlaces: [],
    seance: {} as Seance
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
                    console.log(seanceId)
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
                    console.debug(action.payload)
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
        addOrderPlace: create.reducer((state, action: PayloadAction<Place>) => {
            state.orderPlaces.push(action.payload);
        }),
        removeOrderPlace: create.reducer((state, action: PayloadAction<Place>) => {
            const index = state.orderPlaces.findIndex(el => el.col === action.payload.col && el.row === action.payload.row);
            if (index >= 0) {
                state.orderPlaces.splice(index, 1);
            }
        }),
    })
})

export const {loadBuying, addOrderPlace, removeOrderPlace} = buyingSlice.actions;
export const {buyingState, orderPlaces} = buyingSlice.selectors;