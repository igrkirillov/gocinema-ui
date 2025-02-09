import {useDispatch, useSelector, useStore} from 'react-redux'
import type {AppDispatch, AppStore, RootState} from './store'
import {useState} from "react";
import {CurrentHall} from "./data/CurrentHall";
import {CurrentPricing} from "./data/CurrentPricing";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()

/**
 * Кастомный хук над классом {@link CurrentHall},
 * позволяет работать с классом, а в стейт сохранять {@link CurrentHallData}
 *
 * @param initCurrentHall начальное значение, может быть null
 */
export function useCurrentHall(initCurrentHall: CurrentHall | null): [CurrentHall|null, (currentHall: CurrentHall | null) => void ] {
    const [currentHallData, setCurrentHallData] = useState(initCurrentHall?.serialize());
    const setCurrentHall = (currentHall: CurrentHall | null) => {
        setCurrentHallData(currentHall?.serialize());
    }
    return [
        currentHallData ? new CurrentHall().fillFromData(currentHallData) : null,
        setCurrentHall
    ];
}

/**
 * Кастомный хук над классом {@link CurrentPricing},
 * позволяет работать с классом, а в стейт сохранять {@link CurrentPricingData}
 *
 * @param initCurrentPricing начальное значение, может быть null
 */
export function useCurrentPricing(initCurrentPricing: CurrentPricing | null): [CurrentPricing|null, (currentPricing: CurrentPricing | null) => void ] {
    const [currentPricingData, setCurrentPricingData] = useState(initCurrentPricing?.serialize());
    const setCurrentPricing = (currentPricing: CurrentPricing | null) => {
        setCurrentPricingData(currentPricing?.serialize());
    }
    return [
        currentPricingData ? new CurrentPricing().fillFromData(currentPricingData) : null,
        setCurrentPricing
    ];
}