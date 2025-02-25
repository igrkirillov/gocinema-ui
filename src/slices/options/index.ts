import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {OptionsState} from "../../types";
import {getOption, saveOption} from "../../serverApi";
import {IS_SALE_OPENED_OPTION} from "../../constants";
import {getCurrentUser} from "../../store/storeUtils";

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

const initialState = {
    isSaleOpened: undefined,
    loading: false,
    error: null
} as OptionsState;

type Options = {
    isSaleOpened: boolean
}

export const optionsSlice = createSliceWithThunk({
    name: "options",
    initialState,
    selectors: {
        optionsState: (state) => state
    },
    reducers: (create) => ({
        fetchOptions: create.asyncThunk<Options>(
            async  (__, thunkApi) => {
                try {
                    const currentUser = getCurrentUser(thunkApi.getState());
                    return {
                        isSaleOpened: (await getOption(currentUser, IS_SALE_OPENED_OPTION)).toLowerCase() === "true"
                    } as Options
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = null;
                },
                fulfilled: (state, action: PayloadAction<Options>) => {
                    state.isSaleOpened = action.payload ? action.payload.isSaleOpened : undefined;
                },
                rejected: (state, action) => {
                    state.error = action.payload as string;
                },
                settled: (state) => {
                    state.loading = false;
                }
            }),
        openSale: create.asyncThunk<void>(
            async  (__, thunkApi) => {
                try {
                    const currentUser = getCurrentUser(thunkApi.getState());
                    await saveOption(currentUser, IS_SALE_OPENED_OPTION, "true")
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = null;
                },
                fulfilled: (state) => {
                    state.isSaleOpened = true;
                },
                rejected: (state, action) => {
                    state.error = action.payload as string;
                },
                settled: (state) => {
                    state.loading = false;
                }
            }),
        closeSale: create.asyncThunk<void>(
            async  (__, thunkApi) => {
                try {
                    const currentUser = getCurrentUser(thunkApi.getState());
                    await saveOption(currentUser, IS_SALE_OPENED_OPTION, "false")
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = null;
                },
                fulfilled: (state) => {
                    state.isSaleOpened = false;
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

export const {fetchOptions, openSale, closeSale} = optionsSlice.actions;
export const {optionsState} = optionsSlice.selectors;