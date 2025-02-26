import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "./storeHooks";
import {fetchOptions, optionsState} from "../slices/options";

/**
 * Кастомный хук позволяет определить можно ли редактировать залы, билеты и прочее
 */
export function useEditAvailable(): boolean {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch((fetchOptions()))
    }, [])
    const {isSaleOpened} = useAppSelector(optionsState);
    return !isSaleOpened;
}