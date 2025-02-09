import {useDispatch, useSelector, useStore} from 'react-redux'
import type {AppDispatch, AppStore, RootState} from './store'
import {useState} from "react";
import {CurrentHall} from "./data/CurrentHall";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()

export function useCurrentHall(defaultCurrentHall: CurrentHall | null): [CurrentHall|null, (currentHall: CurrentHall | null) => void ] {
    const [currentHallData, setCurrentHallData] = useState(defaultCurrentHall?.serialize());
    const setCurrentHall = (currentHall: CurrentHall | null) => {
        setCurrentHallData(currentHall?.serialize());
    }
    return [
        currentHallData ? new CurrentHall().fillFromData(currentHallData) : null,
        setCurrentHall
    ];
}