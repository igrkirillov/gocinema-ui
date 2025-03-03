import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {User, UsersState} from "../../types";
import {getUsers} from "../../serverApi";
import {getCurrentUser} from "../../store/storeUtils";

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

const initialState = {
    data: [],
    loading: false,
    error: null
} as UsersState;

export const usersSlice = createSliceWithThunk({
    name: "users",
    initialState,
    selectors: {
        users: (state) => state.data,
        usersState: (state) => state
    },
    reducers: (create) => ({
        fetchUsers: create.asyncThunk<User[]>(
            async  (__, thunkApi) => {
                try {
                    const currentUser = getCurrentUser(thunkApi.getState());
                    return await getUsers(currentUser)
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
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