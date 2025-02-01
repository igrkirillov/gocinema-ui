import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {User, UsersState} from "../../types";
import config from "../../../config/app.json"

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

const initialState = {
    users: {},
    loading: false,
    error: null
} as UsersState;

export const usersSlice = createSliceWithThunk({
    name: "users",
    initialState,
    selectors: {
        users: (state) => state.users,
        usersState: (state) => state
    },
    reducers: (create) => ({
        fetchUsers: create.asyncThunk<User[]>(
            async  (__, thunkApi) => {
                console.log("fetchUsers")
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
                    state.users = action.payload ? action.payload : {} as User[];
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