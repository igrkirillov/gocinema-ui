import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {AuthState, User} from "../../types";
import config from "../../../config/app.json"
import {getUserByLogin} from "../../serverApi";
import {getLoginPasswordFromLocal, removeLoginPasswordFromLocal, saveLoginPasswordToLocal} from "../../localStorageApi";

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
        currentUser: (state) => state.user,
        authState: (state) => state
    },
    reducers: (create) => ({
        loginUser: create.asyncThunk<User, User>(
            async  (user, thunkApi) => {
                try {
                    const foundUser = await getUserByLogin(user);
                    saveLoginPasswordToLocal(foundUser.login, user.password as string);
                    return {
                        ...foundUser,
                        password: user.password
                    } as User;
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
            }),
        clearUser: create.reducer((state) => {
            state.user = null;
            removeLoginPasswordFromLocal();
        }),
        tryAuthFromLocalStorage: create.asyncThunk<User|null, void>(
            async  () => {
                try {
                    const [login, password] = getLoginPasswordFromLocal();
                    const foundUser = await getUserByLogin({login: login, password: password} as User);
                    return {
                        ...foundUser,
                        password: password
                    } as User;
                } catch (e) {
                    console.log(`Не удалось залогиниться из локального хранилища: ${(e as Error).message}`)
                    return null;
                }
            },
            {
                fulfilled: (state, action: PayloadAction<User|null>) => {
                    if (action.payload) {
                        state.user = action.payload;
                    }
                }
            }),
    })
})

export const {loginUser, clearUser, tryAuthFromLocalStorage} = authSlice.actions;
export const {currentUser, authState} = authSlice.selectors;