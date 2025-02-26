import {CurrentHall} from "../data/CurrentHall";
import {useState} from "react";

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