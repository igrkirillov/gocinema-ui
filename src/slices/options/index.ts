import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {SaleOptionsState, User, UsersState} from "../../types";
import config from "../../../config/app.json"

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

const initialState = {
    isSaleOpened: undefined,
    loading: false,
    error: null
} as SaleOptionsState;

export const optionsSlice = createSliceWithThunk({
    name: "options",
    initialState,
    selectors: {
        optionsState: (state) => state
    },
    reducers: (create) => ({
        fetchOptions: create.asyncThunk<User[]>(
            async  (__, thunkApi) => {
                try {
                    const response = await fetch(config.serverUrl + "/users", {method: "GET"});
                    if (response.ok) {
                        return await response.json() as User[];
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
                fulfilled: (state, action: PayloadAction<User[]>) => {
                    state.data = action.payload ? action.payload : [] as User[];
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

export const {fetchUsers} = usersSlice.actions;
export const {users, usersState} = usersSlice.selectors;