import {CurrentPricing} from "../data/CurrentPricing";
import {useState} from "react";

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