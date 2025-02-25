import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {AuthState, User} from "../../types";
import config from "../../../config/app.json"

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

const initialState = {
    user: config.anonymous as User,
    loading: false,
    error: null
} as AuthState;


export const authSlice = createSliceWithThunk({
    name: "auth",
    initialState,
    selectors: {
        currentUser: (state) => state.user
    },
    reducers: (create) => ({
        loginAdmin: create.asyncThunk<User, User>(
            async  (user, thunkApi) => {
                try {
                    // await check login
                    return user;
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = null;
                },
                fulfilled: (state, action: PayloadAction<User>) => {
                    state.user = action.payload;
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

export const {loginAdmin} = authSlice.actions;
export const {currentUser} = authSlice.selectors;