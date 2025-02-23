import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {ClientState, DayItem, DayTimes, Seance} from "../../types";
import {getSeances} from "../../serverApi";

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

const initialState = {
    data: [],
    loading: false,
    error: null,
    currentDate: Date.now().valueOf()
} as ClientState;

export const clientSlice = createSliceWithThunk({
    name: "client",
    initialState,
    selectors: {
        clientState: (state) => state,
        dayItems: (state) => {
            const movieIds = [...new Set(state.data.map(s => s.movie.id))];
            const movies = movieIds.map(id => state.data.find(s => s.movie.id === id)?.movie);
            return movies.sort((m1, m2) => m1.name.localeCompare(m2.name)).map(m => {
                const hallIds = [...new Set(state.data.map(s => s.hall.id))];
                const halls = hallIds.map(id => state.data.find(s => s.hall.id === id)?.hall)
                    .sort((h1, h2) => h1.name.localeCompare(h2.name));
                const timesMap = {} as DayTimes;
                for (const hall of halls) {
                    timesMap[hall.id] = state.data.filter(s => s.movie.id === m.id && s.hall.id === s.hall.id);
                }
                return {
                    movie: m,
                    halls: halls,
                    timesMap: timesMap
                } as DayItem
            }) as DayItem[];
        }
    },
    reducers: (create) => ({
        fetchDaySeances: create.asyncThunk<Seance[], number>(
            async  (currentDate, thunkApi) => {
                try {
                    // по-идее, следует использовать фильтр по дням currentDate
                    currentDate;
                    return await getSeances();
                } catch (e) {
                    return thunkApi.rejectWithValue((e as Error).message);
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = null;
                },
                fulfilled: (state, action: PayloadAction<Seance[]>) => {
                    state.data = action.payload ? action.payload : [] as Seance[];
                },
                rejected: (state, action) => {
                    state.error = action.payload as string;
                },
                settled: (state) => {
                    state.loading = false;
                }
            }),
        setCurrentDate: create.reducer((state, action: PayloadAction<number>) => {
            state.currentDate = action.payload;
        }),
    })
})

export const {fetchDaySeances, setCurrentDate} = clientSlice.actions;
export const {clientState, dayItems} = clientSlice.selectors;